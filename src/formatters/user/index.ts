import { normalize } from '../../bignumber';
import { LTV_PRECISION } from '../../constants';
import { formatUserReserve } from './format-user-reserve';
import { generateRawUserSummary } from './generate-raw-user-summary';
import { generateUserReserveSummary, } from './generate-user-reserve-summary';
export function formatUserSummary({ currentTimestamp, marketRefPriceInUsd, marketRefCurrencyDecimals, rawUserReserves, }) {
    const computedUserReserves = rawUserReserves.map(userReserve => generateUserReserveSummary({
        userReserve,
        marketRefPriceInUsd,
        marketRefCurrencyDecimals,
        currentTimestamp,
    }));
    const formattedUserReserves = computedUserReserves.map(computedUserReserve => formatUserReserve({
        reserve: computedUserReserve,
        marketRefCurrencyDecimals,
    }));
    const userData = generateRawUserSummary({
        userReserves: computedUserReserves,
        marketRefPriceInUsd,
        marketRefCurrencyDecimals,
    });
    return {
        userReservesData: formattedUserReserves,
        totalLiquidityMarketReferenceCurrency: normalize(userData.totalLiquidityMarketReferenceCurrency, marketRefCurrencyDecimals),
        totalLiquidityUSD: userData.totalLiquidityUSD.toString(),
        totalCollateralMarketReferenceCurrency: normalize(userData.totalCollateralMarketReferenceCurrency, marketRefCurrencyDecimals),
        totalCollateralUSD: userData.totalCollateralUSD.toString(),
        totalBorrowsMarketReferenceCurrency: normalize(userData.totalBorrowsMarketReferenceCurrency, marketRefCurrencyDecimals),
        totalBorrowsUSD: userData.totalBorrowsUSD.toString(),
        availableBorrowsMarketReferenceCurrency: normalize(userData.availableBorrowsMarketReferenceCurrency, marketRefCurrencyDecimals),
        availableBorrowsUSD: userData.availableBorrowsUSD.toString(),
        currentLoanToValue: normalize(userData.currentLoanToValue, LTV_PRECISION),
        currentLiquidationThreshold: normalize(userData.currentLiquidationThreshold, LTV_PRECISION),
        healthFactor: userData.healthFactor.toFixed(),
    };
}
//# sourceMappingURL=index.js.map