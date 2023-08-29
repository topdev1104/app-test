import { calculateAvailableBorrowsMarketReferenceCurrency, calculateHealthFactorFromBalances, } from '../../pool-math';
import { calculateUserReserveTotals } from './calculate-user-reserve-totals';
function convertToUsd(value, marketRefPriceInUsd, marketRefCurrencyDecimals) {
    return value
        .multipliedBy(marketRefPriceInUsd)
        .shiftedBy(marketRefCurrencyDecimals * -1);
}
export function generateRawUserSummary({ userReserves, marketRefPriceInUsd, marketRefCurrencyDecimals, }) {
    const { totalLiquidityMarketReferenceCurrency, totalBorrowsMarketReferenceCurrency, totalCollateralMarketReferenceCurrency, currentLtv, currentLiquidationThreshold, } = calculateUserReserveTotals({ userReserves });
    const availableBorrowsMarketReferenceCurrency = calculateAvailableBorrowsMarketReferenceCurrency({
        collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
        currentLtv,
    });
    return {
        totalLiquidityUSD: convertToUsd(totalLiquidityMarketReferenceCurrency, marketRefPriceInUsd, marketRefCurrencyDecimals),
        totalCollateralUSD: convertToUsd(totalCollateralMarketReferenceCurrency, marketRefPriceInUsd, marketRefCurrencyDecimals),
        totalBorrowsUSD: convertToUsd(totalBorrowsMarketReferenceCurrency, marketRefPriceInUsd, marketRefCurrencyDecimals),
        totalLiquidityMarketReferenceCurrency,
        totalCollateralMarketReferenceCurrency,
        totalBorrowsMarketReferenceCurrency,
        availableBorrowsMarketReferenceCurrency,
        availableBorrowsUSD: convertToUsd(availableBorrowsMarketReferenceCurrency, marketRefPriceInUsd, marketRefCurrencyDecimals),
        currentLoanToValue: currentLtv,
        currentLiquidationThreshold,
        healthFactor: calculateHealthFactorFromBalances({
            collateralBalanceMarketReferenceCurrency: totalCollateralMarketReferenceCurrency,
            borrowBalanceMarketReferenceCurrency: totalBorrowsMarketReferenceCurrency,
            currentLiquidationThreshold,
        }),
    };
}
//# sourceMappingURL=generate-raw-user-summary.js.map