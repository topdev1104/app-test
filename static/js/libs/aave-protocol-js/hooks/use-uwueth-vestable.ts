import { useState, useEffect, useCallback } from 'react';

import { useProtocolDataContext } from '../../protocol-data-provider';
import { useStaticPoolDataContext } from '../../pool-data-provider';
import { ChefIncentivesService } from '../ChefIncentivesContract';
import { AaveProtocolDataProviderContract } from '../AaveProtocolDataProviderContract';
import { useUwuProviderContext } from '../../uwu-provider/UwuProvider';

const useUwuEthVestable = () => {
  const { chainId, currentMarketData } = useProtocolDataContext();
  const { userId } = useStaticPoolDataContext();
  const [availableForVesting, setAvailableForVesting] = useState<number>(0);
  const { provider: uwuProvider } = useUwuProviderContext();

  const fetchData = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      if (currentMarketData.addresses.STAKING_TOKEN && currentMarketData.addresses.MASTER_CHEF) {
        let _availableForVesting = 0;

        const chefChefIncentivesService = new ChefIncentivesService(
          uwuProvider,
          currentMarketData.addresses.CHEF_INCENTIVES_CONTROLLER
        );
        const dataProviderContract = new AaveProtocolDataProviderContract(
          uwuProvider,
          currentMarketData.addresses.AAVE_PROTOCOL_DATA_PROVIDER
        );

        const tokens = await dataProviderContract.getTokens();
        const amounts = await chefChefIncentivesService.claimableRewards(userId, tokens);

        amounts.forEach((amount, i) => {
          if (Number(amount) > 0.001) {
            _availableForVesting += amount;
          }
        });

        setAvailableForVesting(_availableForVesting);
      } else {
        throw new Error('Please set STAKING_TOKEN or MASTER_CHEF');
      }
    } catch (error) {
      console.log('useUwuEthVestable => Error: ', error);
    }
  }, [chainId, currentMarketData, userId]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [userId]);

  return {
    availableForVesting,
    fetchData,
  };
};

export default useUwuEthVestable;
