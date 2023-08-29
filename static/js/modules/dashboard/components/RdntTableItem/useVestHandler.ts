import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';

import { ChefIncentivesService } from '../../../../libs/aave-protocol-js/ChefIncentivesContract';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import { useRdntBalanceContext } from '../../../../libs/wallet-balance-provider/RdntBalanceProvider';
import { sendEthTransaction } from '../../../../helpers/send-ethereum-tx';
import useUwuEthVestable from '../../../../libs/aave-protocol-js/hooks/use-uwueth-vestable';
import { AaveProtocolDataProviderContract } from '../../../../libs/aave-protocol-js/AaveProtocolDataProviderContract';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

const useVestHandler = () => {
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { chainId, currentMarketData } = useProtocolDataContext();
  const { userId } = useStaticPoolDataContext();
  const { vestable, fetchVestable } = useRdntBalanceContext();
  const { fetchData: fetchAvailableForVesting } = useUwuEthVestable();
  const { provider: uwuProvider } = useUwuProviderContext();

  return useCallback(
    async (event) => {
      if (!userId || !chainId) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (
        currentMarketData.addresses.CHEF_INCENTIVES_CONTROLLER &&
        currentMarketData.addresses.ALL_TOKENS
      ) {
        const chefIncentivesService = new ChefIncentivesService(
          uwuProvider,
          currentMarketData.addresses.CHEF_INCENTIVES_CONTROLLER
        );

        const dataProviderContract = new AaveProtocolDataProviderContract(
          uwuProvider,
          currentMarketData.addresses.AAVE_PROTOCOL_DATA_PROVIDER
        );

        const tokens = await dataProviderContract.getTokens();

        const txGetter = await chefIncentivesService._claim(userId, tokens ?? []);

        return sendEthTransaction(
          txGetter,
          provider,
          () => {
            console.log('state setter');
          },
          null,
          {
            onConfirmation: () => {
              console.log('vested');
              fetchVestable();
              fetchAvailableForVesting();
            },
          }
        );
      } else {
        return;
      }
    },
    [userId, chainId, vestable.join(), fetchVestable]
  );
};

export default useVestHandler;
