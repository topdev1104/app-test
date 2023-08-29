import { calculateCompoundedInterest } from '../../pool-math';
import { rayMul } from '../../ray.math';
export function calculateSupplies({ reserve, currentTimestamp, }) {
    const { totalVariableDebt, totalStableDebt } = calculateReserveDebtSuppliesRaw({
        reserve,
        currentTimestamp,
    });
    const totalDebt = totalVariableDebt.plus(totalStableDebt);
    const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);
    return {
        totalVariableDebt,
        totalStableDebt,
        totalLiquidity,
    };
}
/**
 * Calculates the debt accrued to a given point in time.
 * @param reserve
 * @param currentTimestamp unix timestamp which must be higher than reserve.lastUpdateTimestamp
 */
function calculateReserveDebtSuppliesRaw({ reserve, currentTimestamp, }) {
    const totalVariableDebt = rayMul(rayMul(reserve.totalScaledVariableDebt, reserve.variableBorrowIndex), calculateCompoundedInterest({
        rate: reserve.variableBorrowRate,
        currentTimestamp,
        lastUpdateTimestamp: reserve.lastUpdateTimestamp,
    }));
    const totalStableDebt = rayMul(reserve.totalPrincipalStableDebt, calculateCompoundedInterest({
        rate: reserve.averageStableRate,
        currentTimestamp,
        lastUpdateTimestamp: reserve.stableDebtLastUpdateTimestamp,
    }));
    return { totalVariableDebt, totalStableDebt };
}
//# sourceMappingURL=calculate-supplies.js.map