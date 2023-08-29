import { BigNumber, providers } from 'ethers';
import { LPStakingContract, PoolContract } from '../../../libs/aave-protocol-js/LPStaking';
import { mainet } from '../../../ui-config/markets/tokensConfig';
import { valueToBigNumber } from '@aave/protocol-js';

export class Calculator {
  readonly lpStakingContract: LPStakingContract;
  readonly provider: providers.Provider;
  constructor(provider: providers.Provider) {
    this.lpStakingContract = new LPStakingContract(provider, mainet.LPStaking);
    this.provider = provider;
  }

  public async calculateVaultAPR(symbol: string) {
    const reserve = mainet.vaultReserves.find((res) => res.symbol === symbol);

    if (reserve) {
      const poolContract = new PoolContract(this.provider, reserve.strikeReserve.asset);
      const totalAllocPoint = valueToBigNumber(
        (await this.lpStakingContract.totalAllocPoint()).toString()
      );
      const stargatePerBlock = valueToBigNumber(
        (await this.lpStakingContract.stargatePerBlock()).toString()
      ).div(10 ** 18);
      const poolInfo = await this.lpStakingContract.poolInfo(BigNumber.from(reserve.poolInfoId));
      const allocPoint = valueToBigNumber(poolInfo.allocPoint.toString());
      const poolDec = valueToBigNumber(10).exponentiatedBy(valueToBigNumber(reserve.decimals));

      const poolShare = allocPoint.div(totalAllocPoint);
      const secondsPerYear = valueToBigNumber(
        BigNumber.from(60).mul(60).mul(24).mul(365).toString()
      );
      const stargatePerSecond = stargatePerBlock.div(12).multipliedBy(poolShare);
      const price = await fetch('https://api.uwulend.finance/stargate-prices.json').then((res) =>
        res.json()
      );

      if (typeof price[reserve.coingeckoSymbol.toUpperCase()] !== 'undefined') {
        const stargatePrice = valueToBigNumber(price[reserve.coingeckoSymbol.toUpperCase()]);

        const totalYearRewards = stargatePerSecond.multipliedBy(secondsPerYear);
        const totalYearRewardsUSD = totalYearRewards.multipliedBy(stargatePrice);

        const totalLiquidity = valueToBigNumber((await poolContract.totalLiquidity()).toString());
        const poolValue = totalLiquidity.div(poolDec);
        const apr = totalYearRewardsUSD.div(poolValue).multipliedBy(100);

        // console.log('pool' + symbol, {
        //   totalAllocPoint: totalAllocPoint.toString(),
        //   stargatePerBlock: stargatePerBlock.toString(),
        //   allocPoint: allocPoint.toString(),
        //   poolDec: poolDec.toString(),
        //   secondsPerYear: secondsPerYear.toString(),
        //   totalYearRewards: totalYearRewards.toString(),
        //   poolShare: poolShare.toString(),
        //   totalLiquidity: totalLiquidity.toString(),
        //   poolValue: poolValue.toString(),
        //   apr: apr.toString(),
        // })

        return apr;
      }
    }

    return valueToBigNumber(0);
  }
}
