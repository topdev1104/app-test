import React, { useCallback, useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { valueToBigNumber } from '@aave/protocol-js';

import { getProvider } from '../../helpers/config/markets-and-network-config';
import { useProtocolDataContext } from '../protocol-data-provider';
import { useStaticPoolDataContext } from '../pool-data-provider';
import { GeistTokenContract } from '../aave-protocol-js/GeistTokenContract';
import { MultiFeeDistributionService } from '../aave-protocol-js/MulteFeeDistributionContract';
import { AaveProtocolDataProviderContract } from '../aave-protocol-js/AaveProtocolDataProviderContract';
import { ChefIncentivesServiceV2 } from '../aave-protocol-js/ChefIncentivesContract';
import { useUwuProviderContext } from '../uwu-provider/UwuProvider';

type RdntBalanceProviderContext = {
  walletBalance: BigNumber;
  currencySymbol: string;
  totalSupply: BigNumber;
  loading: boolean;
  ready: boolean;
  refetch: () => void;
  fetchVestable: () => void;
  earned: BigNumber;
  locked: BigNumber;
  staked: BigNumber;

  availableForVesting: number;
  vestable: string[];
};

const Context = React.createContext<RdntBalanceProviderContext>({} as RdntBalanceProviderContext);

const FETCH_VEST_INTERVAL = 60000;

export const RdntBalanceProvider: React.FC = ({ children }) => {
  const { provider: uwuProvider } = useUwuProviderContext();
  const { chainId, currentMarketData } = useProtocolDataContext();
  const { userId } = useStaticPoolDataContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState<{
    walletBalance: BigNumber;
    currencySymbol: string;
    totalSupply: BigNumber;
  }>({
    walletBalance: valueToBigNumber(0),
    currencySymbol: 'RDNT',
    totalSupply: valueToBigNumber(0),
  });

  const [earned, setEarned] = useState<BigNumber>(valueToBigNumber(-10));
  const [locked, setLocked] = useState<BigNumber>(valueToBigNumber(-10));
  const [staked, setStaked] = useState<BigNumber>(valueToBigNumber(-10));

  const [availableForVesting, setAvailableForVesting] = useState<number>(0);
  const [vestable, setVestable] = useState<string[]>([]);

  const fetch = useCallback(async () => {
    if (chainId && userId && currentMarketData.addresses.UWU_TOKEN) {
      const contract = new GeistTokenContract(uwuProvider, currentMarketData.addresses.UWU_TOKEN);
      const rdntInfo = await contract.getInfo(userId);
      setTokenInfo(rdntInfo);
      setReady(true);
    }
  }, [chainId, userId]);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      await fetch();
    } catch (e) {
      console.log('error fetching RDNT balance', e);
    }
    setLoading(false);
  }, [setLoading, fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const fetchUserEarnings = useCallback(async () => {
    if (!chainId || !userId) {
      return;
    }

    try {
      if (
        currentMarketData.addresses.UWU_TOKEN &&
        currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
      ) {
        const multiFeeDistributionService = new MultiFeeDistributionService(
          uwuProvider,
          currentMarketData.addresses.UWU_TOKEN,
          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
        );
        const [totalBalance, unlocked, earned] = await multiFeeDistributionService.getBalances(
          userId
        );
        setEarned(earned);
        setLocked(totalBalance.minus(unlocked));
        setStaked(unlocked);
      } else {
        throw new Error('Please set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
      }
    } catch (e) {
      console.log(e);
    }
  }, [chainId, userId]);

  useEffect(() => {
    // todo: проверить где используются эти значения, если где-то нужны, то включить функцию обратно
    // fetchUserEarnings();
  }, [fetchUserEarnings]);

  const fetchVestable = useCallback(async () => {
    // console.log(`fetching vestable1`);

    if (!chainId || !userId) {
      return;
    }

    if (
      currentMarketData.addresses.AAVE_PROTOCOL_DATA_PROVIDER &&
      currentMarketData.addresses.CHEF_INCENTIVES_CONTROLLER
    ) {
      const dataProviderContract = new AaveProtocolDataProviderContract(
        uwuProvider,
        currentMarketData.addresses.AAVE_PROTOCOL_DATA_PROVIDER
      );

      const chefChefIncentivesService = new ChefIncentivesServiceV2(
        uwuProvider,
        currentMarketData.addresses.CHEF_INCENTIVES_CONTROLLER
      );

      const tokens = await dataProviderContract.getTokens();
      const amounts = await chefChefIncentivesService.claimableRewards(userId, tokens);
      const userBaseClaimable = await chefChefIncentivesService.userBaseClaimable(userId);

      let result = amounts
        .filter((amount) => Number(amount) > 0.001)
        .reduce((s, n) => s + Number(n), 0);
      result += userBaseClaimable;
      setAvailableForVesting(result);

      const vestableTokens: string[] = [];
      amounts.forEach((amount, i) => {
        if (Number(amount) > 0.001) {
          vestableTokens.push(tokens[i]);
        }
      });
      setVestable(vestableTokens);
    } else {
      return;
    }
  }, [chainId, userId]);

  useEffect(() => {
    fetchVestable();
    const interval = setInterval(fetchVestable, FETCH_VEST_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchVestable]);

  return (
    <Context.Provider
      value={{
        ...tokenInfo,
        loading,
        ready,
        refetch,

        earned,
        locked,
        staked,

        availableForVesting,
        vestable,
        fetchVestable,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRdntBalanceContext = () => useContext(Context);
