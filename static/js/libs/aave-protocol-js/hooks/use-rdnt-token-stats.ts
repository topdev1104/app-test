import { useState, useEffect } from 'react';

import { useProtocolDataContext } from '../../protocol-data-provider';
import { getApiVersion } from '../../../helpers/apiVersion';

const useRdntTokenStats = () => {
  const { chainId } = useProtocolDataContext();

  const [tokenStats, setTokenStats] = useState<{
    supplyLocked?: number;
    supplyLockedUSD?: number;
    totalStaked?: number;
    totalStakedUSD?: number;
    circulatingSupply?: number;
    marketCapUSD?: number;
  }>({});

  useEffect(() => {
    (async () => {
      try {
        let apiVersion = getApiVersion(new Date().getTime());
        const tokenStatsResponse = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/tokenStats.json`
        );
        const json = await tokenStatsResponse.json();
        setTokenStats(json.data);
      } catch (error) {
        console.log('useRdntTokenStats: Error => ', error);
      }
    })();
  }, []);

  return {
    tokenStats,
  };
};

export default useRdntTokenStats;
