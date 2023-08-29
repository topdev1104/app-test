import { useState } from 'react';

import {
  UiPoolDataProvider,
  ReservesDataHumanized,
  UserReserveDataHumanized,
  ChainId,
} from '@aave/contract-helpers';
import { usePolling } from '../../hooks/use-polling';
import { getProvider } from '../../../helpers/config/markets-and-network-config';
import { useUwuProviderContext } from '../../uwu-provider/UwuProvider';
import { AaveProtocolDataProviderContract } from '../../aave-protocol-js/AaveProtocolDataProviderContract';
import { useProtocolDataContext } from '../../protocol-data-provider';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000000;

export interface PoolDataResponse {
  loading: boolean;
  error: boolean;
  data: {
    reserves?: ReservesDataHumanized;
    userReserves?: UserReserveDataHumanized[];
  };
  refresh: () => Promise<any>;
}

// Fetch reserve and user incentive data from UiIncentiveDataProvider
export function usePoolData(
  lendingPoolAddressProvider: string,
  chainId: ChainId,
  poolDataProviderAddress: string,
  skip: boolean,
  userAddress?: string
): PoolDataResponse {
  const { currentMarketData } = useProtocolDataContext();
  const currentAccount: string | undefined = userAddress ? userAddress.toLowerCase() : undefined;
  const [loadingReserves, setLoadingReserves] = useState<boolean>(false);
  const [errorReserves, setErrorReserves] = useState<boolean>(false);
  const [loadingUserReserves, setLoadingUserReserves] = useState<boolean>(false);
  const [errorUserReserves, setErrorUserReserves] = useState<boolean>(false);
  const [reserves, setReserves] = useState<ReservesDataHumanized | undefined>(undefined);
  const [userReserves, setUserReserves] = useState<UserReserveDataHumanized[] | undefined>(
    undefined
  );
  const { provider: uwuProvider } = useUwuProviderContext();

  // Fetch and format reserve incentive data from UiIncentiveDataProvider contract
  const fetchReserves = async () => {
    const provider = uwuProvider;
    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: poolDataProviderAddress,
      provider,
    });

    try {
      setLoadingReserves(true);
      //TODO: get cached reserve
      // let reservesResponse = await fetch(`${process.env.REACT_APP_API_DOMAIN}/reserves`).then(
      //   (response) => {
      //     console.log('response.status', response.status)
      //     return (response.status === 200 ? response.json() : null)
      //   }
      // );

      const reservesResponse = await poolDataProviderContract.getReservesHumanized(
        lendingPoolAddressProvider
      );

      setReserves(reservesResponse);
      setErrorReserves(false);
    } catch (e) {
      console.log('e', e);
      setErrorReserves(e.message);
    }
    setLoadingReserves(false);
  };

  // Fetch and format user incentive data from UiIncentiveDataProvider
  const fetchUserReserves = async () => {
    if (!currentAccount) return;
    const provider = uwuProvider;
    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: poolDataProviderAddress,
      provider,
    });

    try {
      setLoadingUserReserves(true);
      const userReservesResponse: UserReserveDataHumanized[] =
        await poolDataProviderContract.getUserReservesHumanized(
          lendingPoolAddressProvider,
          currentAccount
        );

      setUserReserves(userReservesResponse);
      setErrorUserReserves(false);
    } catch (e) {
      console.log('e', e);
      setErrorUserReserves(e.message);
    }
    setLoadingUserReserves(false);
  };

  usePolling(fetchReserves, POLLING_INTERVAL, skip, [skip, poolDataProviderAddress, chainId]);
  usePolling(fetchUserReserves, POLLING_INTERVAL, skip, [
    skip,
    poolDataProviderAddress,
    chainId,
    currentAccount,
  ]);

  const loading = loadingReserves || loadingUserReserves;
  const error = errorReserves || errorUserReserves;
  return {
    loading,
    error,
    data: { reserves, userReserves },
    refresh: () => {
      return Promise.all([fetchUserReserves(), fetchReserves()]);
    },
  };
}
