import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { useCurrentTimestamp } from '../hooks/use-current-timestamp';
import { useStaticPoolDataContext } from './static-pool-data-provider';
import {
  formatReserve,
  FormatReserveResponse,
  formatUserSummary,
  FormatUserSummaryResponse,
  normalize,
} from '@aave/math-utils';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import useTotalData from '../../aave-protocol-js/hooks/use-total-data';

export interface ComputedReserveData extends FormatReserveResponse {
  id: string;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  priceInMarketReferenceCurrency: string;
  avg30DaysLiquidityRate?: string;
  avg30DaysVariableBorrowRate?: string;
}

export interface UserSummary extends FormatUserSummaryResponse {
  id: string;
}

export interface DynamicPoolDataContextData {
  reserves: ComputedReserveData[];
  user?: UserSummary;
  locked: BigNumber;
  readyToVest: BigNumber;
  uwuPrice: BigNumber;
  marketCap: BigNumber;
  totalPlatformFees: BigNumber;
}

const DynamicPoolDataContext = React.createContext({} as DynamicPoolDataContextData);

export function DynamicPoolDataProvider({ children }: PropsWithChildren<{}>) {
  const { rawReserves, rawUserReserves, userId, marketRefCurrencyDecimals, marketRefPriceInUsd } =
    useStaticPoolDataContext();
  const { locked, readyToVest, uwuPrice, marketCap, totalPlatformFees } = useTotalData();
  const currentTimestamp = useCurrentTimestamp(60);
  const [lastAvgRatesUpdateTimestamp, setLastAvgRatesUpdateTimestamp] = useState(currentTimestamp);

  useEffect(() => {
    if (currentTimestamp > lastAvgRatesUpdateTimestamp + 1000 * 60 * 5) {
      setLastAvgRatesUpdateTimestamp(currentTimestamp);
    }
  }, [currentTimestamp, lastAvgRatesUpdateTimestamp]);

  const computedUserData =
    userId && rawUserReserves
      ? formatUserSummary({
          currentTimestamp,
          marketRefPriceInUsd,
          marketRefCurrencyDecimals,
          rawUserReserves: rawUserReserves,
        })
      : undefined;

  const index = rawReserves.findIndex((reserve) => reserve.symbol.toUpperCase() === 'SIFUM');
  if (index !== -1) {
    const sifum = { ...rawReserves[index] };
    rawReserves.splice(index, 1);
    rawReserves.push(sifum);
  }
  const indexOfMim = rawReserves.findIndex((item) => item.symbol.toLowerCase() === 'mim');

  if (indexOfMim !== -1) {
    rawReserves.splice(indexOfMim, 1);
  }

  const formattedPoolReserves: ComputedReserveData[] = rawReserves.map((reserve) => {
    const formattedReserve = formatReserve({
      reserve,
      currentTimestamp,
    });

    const fullReserve: ComputedReserveData = {
      ...reserve,
      ...formattedReserve,
      priceInMarketReferenceCurrency: normalize(
        reserve.priceInMarketReferenceCurrency,
        marketRefCurrencyDecimals
      ),
    };

    if (fullReserve.underlyingAsset === '0x29127fe04ffa4c32acac0ffe17280abd74eac313') {
      fullReserve.symbol = 'SIFU_OLD';
    }

    return fullReserve;
  });

  let userSummary: UserSummary | undefined = undefined;
  if (computedUserData && userId) {
    const _userReservesData = computedUserData.userReservesData.map(item => {

      return {
        ...item,
        reserve: {
          ...item.reserve,
          symbol: item.reserve.underlyingAsset === '0x29127fe04ffa4c32acac0ffe17280abd74eac313' ? 'SIFU_OLD' : item.reserve.symbol
        } 
      }
    })

    computedUserData.userReservesData = [..._userReservesData]

    userSummary = {
      id: userId,
      ...computedUserData,
    };
  }

  return (
    <DynamicPoolDataContext.Provider
      value={{
        user: userSummary,
        reserves: formattedPoolReserves,
        locked: valueToBigNumber(locked ? locked : 0),
        readyToVest: valueToBigNumber(readyToVest ? readyToVest : 0),
        uwuPrice: valueToBigNumber(uwuPrice ? uwuPrice : 0),
        marketCap: valueToBigNumber(marketCap ? marketCap : 0),
        totalPlatformFees: valueToBigNumber(totalPlatformFees ? totalPlatformFees : 0),
      }}
    >
      {children}
    </DynamicPoolDataContext.Provider>
  );
}

export const useDynamicPoolDataContext = () => useContext(DynamicPoolDataContext);
