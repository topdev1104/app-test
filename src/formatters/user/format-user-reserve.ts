import { normalize, valueToBigNumber, valueToZDBigNumber, } from '../../bignumber';
import { LTV_PRECISION, RAY_DECIMALS, SECONDS_PER_YEAR } from '../../constants';
import { RAY, rayPow } from '../../ray.math';
export function formatUserReserve({ reserve: _reserve, marketRefCurrencyDecimals, }) {
    const { userReserve } = _reserve;
    const { reserve } = userReserve;
    const reserveDecimals = reserve.decimals;
    const normalizeWithReserve = (n) => normalize(n, reserve.decimals);
    const exactStableBorrowRate = rayPow(valueToZDBigNumber(userReserve.stableBorrowRate)
        .dividedBy(SECONDS_PER_YEAR)
        .plus(RAY), SECONDS_PER_YEAR).minus(RAY);
    return Object.assign(Object.assign({}, userReserve), { reserve: Object.assign(Object.assign({}, reserve), { reserveLiquidationBonus: normalize(valueToBigNumber(reserve.reserveLiquidationBonus).shiftedBy(LTV_PRECISION), LTV_PRECISION) }), scaledATokenBalance: normalizeWithReserve(userReserve.scaledATokenBalance), underlyingBalance: normalize(_reserve.underlyingBalance, reserveDecimals), underlyingBalanceMarketReferenceCurrency: normalize(_reserve.underlyingBalanceMarketReferenceCurrency, marketRefCurrencyDecimals), underlyingBalanceUSD: _reserve.underlyingBalanceUSD.toString(), stableBorrows: normalizeWithReserve(_reserve.stableBorrows), stableBorrowsMarketReferenceCurrency: normalize(_reserve.stableBorrowsMarketReferenceCurrency, marketRefCurrencyDecimals), stableBorrowsUSD: _reserve.stableBorrowsUSD.toString(), variableBorrows: normalizeWithReserve(_reserve.variableBorrows), variableBorrowsMarketReferenceCurrency: normalize(_reserve.variableBorrowsMarketReferenceCurrency, marketRefCurrencyDecimals), variableBorrowsUSD: _reserve.variableBorrowsUSD.toString(), totalBorrows: normalizeWithReserve(_reserve.totalBorrows), totalBorrowsMarketReferenceCurrency: normalize(_reserve.totalBorrowsMarketReferenceCurrency, marketRefCurrencyDecimals), totalBorrowsUSD: _reserve.totalBorrowsUSD.toString(), totalLiquidity: normalizeWithReserve(_reserve.totalLiquidity), totalStableDebt: normalizeWithReserve(_reserve.totalStableDebt), totalVariableDebt: normalizeWithReserve(_reserve.totalVariableDebt), stableBorrowAPR: normalize(userReserve.stableBorrowRate, RAY_DECIMALS), stableBorrowAPY: normalize(exactStableBorrowRate, RAY_DECIMALS) });
}
//# sourceMappingURL=format-user-reserve.js.map