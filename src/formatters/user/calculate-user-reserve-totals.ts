import { valueToBigNumber, valueToZDBigNumber } from '../../bignumber';
export function calculateUserReserveTotals({ userReserves, }) {
    let totalLiquidityMarketReferenceCurrency = valueToZDBigNumber('0');
    let totalCollateralMarketReferenceCurrency = valueToZDBigNumber('0');
    let totalBorrowsMarketReferenceCurrency = valueToZDBigNumber('0');
    let currentLtv = valueToBigNumber('0');
    let currentLiquidationThreshold = valueToBigNumber('0');
    userReserves.forEach(userReserveSummary => {
        totalLiquidityMarketReferenceCurrency =
            totalLiquidityMarketReferenceCurrency.plus(userReserveSummary.underlyingBalanceMarketReferenceCurrency);
        totalBorrowsMarketReferenceCurrency = totalBorrowsMarketReferenceCurrency
            .plus(userReserveSummary.variableBorrowsMarketReferenceCurrency)
            .plus(userReserveSummary.stableBorrowsMarketReferenceCurrency);
        if (userReserveSummary.userReserve.reserve.usageAsCollateralEnabled &&
            userReserveSummary.userReserve.usageAsCollateralEnabledOnUser) {
            totalCollateralMarketReferenceCurrency =
                totalCollateralMarketReferenceCurrency.plus(userReserveSummary.underlyingBalanceMarketReferenceCurrency);
            currentLtv = currentLtv.plus(valueToBigNumber(userReserveSummary.underlyingBalanceMarketReferenceCurrency).multipliedBy(userReserveSummary.userReserve.reserve.baseLTVasCollateral));
            currentLiquidationThreshold = currentLiquidationThreshold.plus(valueToBigNumber(userReserveSummary.underlyingBalanceMarketReferenceCurrency).multipliedBy(userReserveSummary.userReserve.reserve.reserveLiquidationThreshold));
        }
    });
    if (currentLtv.gt(0)) {
        currentLtv = valueToZDBigNumber(currentLtv.div(totalCollateralMarketReferenceCurrency));
    }
    if (currentLiquidationThreshold.gt(0)) {
        currentLiquidationThreshold = valueToZDBigNumber(currentLiquidationThreshold.div(totalCollateralMarketReferenceCurrency));
    }
    return {
        totalLiquidityMarketReferenceCurrency,
        totalBorrowsMarketReferenceCurrency,
        totalCollateralMarketReferenceCurrency,
        currentLtv,
        currentLiquidationThreshold,
    };
}
//# sourceMappingURL=calculate-user-reserve-totals.js.map