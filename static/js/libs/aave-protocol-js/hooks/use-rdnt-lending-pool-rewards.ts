import { useState, useEffect, useCallback } from 'react';

import { useProtocolDataContext } from '../../protocol-data-provider';
import { getApiVersion } from '../../../helpers/apiVersion';

const useRdntLendingPoolRewards = () => {
  const { chainId } = useProtocolDataContext();

  const [lendingPoolRewards, setLendingPoolRewards] = useState<{
    poolAPRs?: Array<any>;
    tokenAddresses?: Array<Object>;
  }>({});

  const [projectedFeesPerYearByAssets, setProjectedFeesPerYearByAssets] = useState<{
    poolAPRs?: Array<any>;
    tokenAddresses?: Array<Object>;
  }>({});

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/lendingPoolRewards.json`);
        const { data, projectedFeesPerYearByAssets } = await response.json();

        projectedFeesPerYearByAssets['SIFU_OLD'] = projectedFeesPerYearByAssets.sifu;

        setLendingPoolRewards(data);
        setProjectedFeesPerYearByAssets(projectedFeesPerYearByAssets);
      } catch (error) {
        console.log('useRdntLendingPoolRewards: Error => ', error);
      }
    })();
  }, []);

  const getRewardApr = useCallback(
    (tokenAddr: string): number => {
      if (lendingPoolRewards?.poolAPRs) {
        for (var pool of lendingPoolRewards?.poolAPRs) {
          if (pool.tokenAddress && pool.tokenAddress.toLowerCase() === tokenAddr.toLowerCase()) {
            return pool.apr;
          }
        }
      }

      return 0;
    },
    [lendingPoolRewards?.poolAPRs?.join()]
  );

  return {
    lendingPoolRewards,
    getRewardApr,
    projectedFeesPerYearByAssets,
  };
};

export default useRdntLendingPoolRewards;
