import { useState, useEffect } from 'react';

import { useProtocolDataContext } from '../../protocol-data-provider';
import { getApiVersion } from '../../../helpers/apiVersion';

const useRdntTokenStakingRewards = () => {
  const [stakingApr, setStakingApr] = useState<number>(0);
  const [lockingApr, setLockingApr] = useState<number>(0);
  const [projectedFeesPerYear, setProjectedFeesPerYear] = useState<number>(0);
  const [tokenPrices, setTokenPrices] = useState<any>([]);
  const [platformStats, setPlatformStats] = useState<{
    platformFeesPerSecondUSD?: number;
    penaltyFeesPerSecondUSD?: number;
    totalRevenuePerSecondUSD?: number;
    dailyPlatformFee?: number;
  }>({
    platformFeesPerSecondUSD: 0,
    penaltyFeesPerSecondUSD: 0,
    totalRevenuePerSecondUSD: 0,
    dailyPlatformFee: 0,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const tokenStakingRewardsResponse = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/tokenStakingRewards.json`
        );
        const tokenStakingRewards = await tokenStakingRewardsResponse.json();
        setTokenPrices(tokenStakingRewards.data.rewardTokens);
        setStakingApr(tokenStakingRewards.data.stakingAPR);
        setLockingApr(tokenStakingRewards.data.lockingAPR);
        setProjectedFeesPerYear(tokenStakingRewards.data.projectedFeesPerYear);

        setPlatformStats({
          platformFeesPerSecondUSD: tokenStakingRewards.data.platformFeesPerSecondUSD,
          penaltyFeesPerSecondUSD: tokenStakingRewards.data.penaltyFeesPerSecondUSD,
          totalRevenuePerSecondUSD: tokenStakingRewards.data.totalRevenuePerSecondUSD,
          dailyPlatformFee: tokenStakingRewards.data.dailyPlatformFee,
        });
      } catch (error) {
        console.log('useRdntTokenStakingRewards: Error => ', error);
      }
    };

    getData();
    const intervalId = setInterval(getData, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    stakingApr,
    lockingApr,
    platformStats,
    tokenPrices,
    projectedFeesPerYear,
  };
};

export default useRdntTokenStakingRewards;
