import { rayMul } from '../../ray.math';
import { calculateCompoundedInterest } from '../compounded-interest/calculate-compounded-interest';
export function calculateReserveDebt(reserveDebt, currentTimestamp) {
    const timestamp = currentTimestamp;
    const totalVariableDebt = getTotalVariableDebt(reserveDebt, timestamp);
    const totalStableDebt = getTotalStableDebt(reserveDebt, timestamp);
    return {
        totalVariableDebt,
        totalStableDebt,
        totalDebt: totalVariableDebt.plus(totalStableDebt),
    };
}
function getTotalVariableDebt(reserveDebt, currentTimestamp) {
    return rayMul(rayMul(reserveDebt.totalScaledVariableDebt, reserveDebt.variableBorrowIndex), calculateCompoundedInterest({
        rate: reserveDebt.variableBorrowRate,
        currentTimestamp,
        lastUpdateTimestamp: reserveDebt.lastUpdateTimestamp,
    }));
}
function getTotalStableDebt(reserveDebt, currentTimestamp) {
    return rayMul(reserveDebt.totalPrincipalStableDebt, calculateCompoundedInterest({
        rate: reserveDebt.averageStableRate,
        currentTimestamp,
        lastUpdateTimestamp: reserveDebt.stableDebtLastUpdateTimestamp,
    }));
}
//# sourceMappingURL=calculate-reserve-debt.js.map