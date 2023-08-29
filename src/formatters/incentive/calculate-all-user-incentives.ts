import { BigNumber } from 'bignumber.js';
import { valueToZDBigNumber } from '../../bignumber';
import { calculateUserReserveIncentives, } from './calculate-user-reserve-incentives';
export function calculateAllUserIncentives({ reserveIncentives, userReserveIncentives, userReserves, currentTimestamp, }) {
    // calculate incentive per token
    const rewards = userReserveIncentives
        .map((userReserveIncentive) => {
        const reserve = reserveIncentives.find((reserve) => reserve.underlyingAsset === userReserveIncentive.underlyingAsset);
        const userReserve = userReserves.find((reserve) => reserve.underlyingAsset === userReserveIncentive.underlyingAsset);
        if (reserve) {
            let rewards = {
                aIncentives: valueToZDBigNumber('0'),
                vIncentives: valueToZDBigNumber('0'),
                sIncentives: valueToZDBigNumber('0'),
            };
            if (userReserve) {
                rewards = calculateUserReserveIncentives({
                    reserveIncentives: reserve,
                    userReserveIncentives: userReserveIncentive,
                    userReserveData: userReserve,
                    currentTimestamp,
                });
            }
            return [
                {
                    tokenAddress: userReserveIncentive.aTokenIncentivesUserData.tokenAddress,
                    incentiveController: userReserveIncentive.aTokenIncentivesUserData
                        .incentiveControllerAddress,
                    rewardTokenAddress: userReserveIncentive.aTokenIncentivesUserData.rewardTokenAddress,
                    rewardTokenDecimals: userReserveIncentive.aTokenIncentivesUserData.rewardTokenDecimals,
                    accruedRewards: new BigNumber(rewards.aIncentives),
                    unclaimedRewards: new BigNumber(userReserveIncentive.aTokenIncentivesUserData.userUnclaimedRewards),
                },
                {
                    tokenAddress: userReserveIncentive.vTokenIncentivesUserData.tokenAddress,
                    incentiveController: userReserveIncentive.vTokenIncentivesUserData
                        .incentiveControllerAddress,
                    rewardTokenAddress: userReserveIncentive.vTokenIncentivesUserData.rewardTokenAddress,
                    rewardTokenDecimals: userReserveIncentive.vTokenIncentivesUserData.rewardTokenDecimals,
                    accruedRewards: new BigNumber(rewards.vIncentives),
                    unclaimedRewards: new BigNumber(userReserveIncentive.vTokenIncentivesUserData.userUnclaimedRewards),
                },
                {
                    tokenAddress: userReserveIncentive.sTokenIncentivesUserData.tokenAddress,
                    incentiveController: userReserveIncentive.sTokenIncentivesUserData
                        .incentiveControllerAddress,
                    rewardTokenAddress: userReserveIncentive.sTokenIncentivesUserData.rewardTokenAddress,
                    rewardTokenDecimals: userReserveIncentive.sTokenIncentivesUserData.rewardTokenDecimals,
                    accruedRewards: new BigNumber(rewards.sIncentives),
                    unclaimedRewards: new BigNumber(userReserveIncentive.sTokenIncentivesUserData.userUnclaimedRewards),
                },
            ];
        }
        return [];
    })
        .flat();
    // normalize incentives per controller
    return rewards.reduce((acc, reward) => {
        if (!acc[reward.incentiveController]) {
            acc[reward.incentiveController] = {
                assets: [],
                claimableRewards: reward.unclaimedRewards,
                rewardTokenAddress: reward.rewardTokenAddress,
                rewardTokenDecimals: reward.rewardTokenDecimals,
            };
        }
        if (reward.accruedRewards.gt(0)) {
            acc[reward.incentiveController].claimableRewards = acc[reward.incentiveController].claimableRewards.plus(reward.accruedRewards);
            acc[reward.incentiveController].assets.push(reward.tokenAddress);
        }
        return acc;
    }, {});
}
//# sourceMappingURL=calculate-all-user-incentives.js.map