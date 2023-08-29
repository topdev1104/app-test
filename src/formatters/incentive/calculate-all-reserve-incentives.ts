import { calculateReserveIncentives, } from './calculate-reserve-incentives';
// Calculate incentive token price from reserves data or priceFeed from UiIncentiveDataProvider
function calculateRewardTokenPrice(reserves, address, priceFeed) {
    address = address.toLowerCase();
    // For stkAave incentives, use Aave price feed
    if (address.toLowerCase() === '0x4da27a545c0c5b758a6ba100e3a049001de870f5') {
        address = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
    }
    const rewardReserve = reserves.find(reserve => reserve.underlyingAsset.toLowerCase() === address);
    if (rewardReserve) {
        return rewardReserve.priceInMarketReferenceCurrency;
    }
    return priceFeed;
}
export function calculateAllReserveIncentives({ reserveIncentives, reserves, }) {
    const reserveDict = {};
    // calculate incentive per reserve token
    reserveIncentives.forEach(reserveIncentive => {
        // Find the corresponding reserve data for each reserveIncentive
        const reserve = reserves.find((reserve) => reserve.underlyingAsset.toLowerCase() ===
            reserveIncentive.underlyingAsset.toLowerCase());
        if (reserve) {
            const calculatedReserveIncentives = calculateReserveIncentives({
                reserveIncentiveData: reserveIncentive,
                totalLiquidity: reserve.totalLiquidity,
                totalVariableDebt: reserve.totalVariableDebt,
                totalStableDebt: reserve.totalStableDebt,
                priceInMarketReferenceCurrency: reserve.priceInMarketReferenceCurrency,
                decimals: reserve.decimals,
                aRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(reserves, reserveIncentive.aIncentiveData.rewardTokenAddress.toLowerCase(), reserveIncentive.aIncentiveData.priceFeed),
                vRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(reserves, reserveIncentive.vIncentiveData.rewardTokenAddress.toLowerCase(), reserveIncentive.vIncentiveData.priceFeed),
                sRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(reserves, reserveIncentive.sIncentiveData.rewardTokenAddress.toLowerCase(), reserveIncentive.sIncentiveData.priceFeed),
            });
            reserveDict[calculatedReserveIncentives.underlyingAsset] = {
                aIncentives: calculatedReserveIncentives.aIncentivesData,
                vIncentives: calculatedReserveIncentives.vIncentivesData,
                sIncentives: calculatedReserveIncentives.sIncentivesData,
            };
        }
    });
    return reserveDict;
}
//# sourceMappingURL=calculate-all-reserve-incentives.js.map