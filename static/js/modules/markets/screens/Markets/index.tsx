import { useEffect, useState } from 'react';
import { valueToBigNumber } from '@aave/protocol-js';

import {
  useDynamicPoolDataContext,
  useStaticPoolDataContext,
} from '../../../../libs/pool-data-provider';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import MarketTable from '../../components/MarketTable';
import MarketTableItem from '../../components/MarketTableItem';
import TotalMarketsSize from '../../components/TotalMarketsSize';
import MarketMobileCard from '../../components/MarketMobileCard';

import staticStyles from './style';
import marketsBackground from '../../../../images/markets/markets-background-header.svg';
import useRdntLendingPoolRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-lending-pool-rewards';
import { BN_ONE, BN_ZERO, estimateLooping } from '../../../../helpers/leverage';
import { isAssetStable } from '../../../../helpers/config/assets-config';
import WelcomeModal from '../../../../components/WelcomeModal';
import BigNumber from 'bignumber.js';
import PlatformFeesPaidToLocked from '../../components/PlatformFeesPaidToLocked';
import LockUwUAndEarn from '../../components/LockUwUAndEarn';
import useRdntTokenStakingRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-token-staking-rewards';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import useUwuPrices from '../../../../libs/aave-protocol-js/hooks/use-uwu-prices';
import { MultiFeeDistributionV2Service } from '../../../../libs/aave-protocol-js/MulteFeeDistributionV2Contract';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

export default function Markets() {
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const { reserves, totalPlatformFees } = useDynamicPoolDataContext();
  const { projectedFeesPerYear } = useRdntTokenStakingRewards();

  const { getRewardApr, projectedFeesPerYearByAssets } = useRdntLendingPoolRewards();
  const [isPriceInUSD] = useState(true);
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const [apr, setAPR] = useState<BigNumber>(BigNumber(0));
  const { currentMarketData } = useProtocolDataContext();
  const { prices } = useUwuPrices();
  const { provider: uwuProvider } = useUwuProviderContext();
  let totalLockedInUsd = valueToBigNumber('0');

  let sortedData = reserves
    .filter((res) => res.isActive && !res.isFrozen)
    .map((reserve) => {
      totalLockedInUsd = totalLockedInUsd.plus(
        valueToBigNumber(reserve.totalLiquidity)
          .multipliedBy(reserve.priceInMarketReferenceCurrency)
          .multipliedBy(marketRefPriceInUsd)
      );

      const totalLiquidity = Number(reserve.totalLiquidity);
      const totalLiquidityInUSD = valueToBigNumber(reserve.totalLiquidity)
        .multipliedBy(reserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const totalBorrows = Number(reserve.totalDebt);
      const totalBorrowsInUSD = valueToBigNumber(reserve.totalDebt)
        .multipliedBy(reserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const rdntRewardsDepositApr = getRewardApr(reserve.aTokenAddress);
      const rdntRewardsBorrowApr = getRewardApr(reserve.variableDebtTokenAddress);
      const isStable = isAssetStable(reserve.symbol);

      let loopAPY = BN_ONE;
      const maxLeverage = BN_ONE.div(
        BN_ONE.minus(valueToBigNumber(reserve.baseLTVasCollateral))
      ).decimalPlaces(2, BigNumber.ROUND_FLOOR);

      const { netAPY } = estimateLooping({
        amount: valueToBigNumber(1),
        asset: reserve,
        leverage: valueToBigNumber(maxLeverage),
        depositIncentiveAPR: valueToBigNumber(rdntRewardsDepositApr),
        variableBorrowIncentiveAPR: valueToBigNumber(rdntRewardsBorrowApr),
        userSummary: undefined,
      });

      loopAPY = netAPY;

      return {
        totalLiquidity,
        totalLiquidityInUSD,
        totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
        totalBorrowsInUSD: reserve.borrowingEnabled ? totalBorrowsInUSD : -1,
        id: reserve.id,
        underlyingAsset: reserve.underlyingAsset,
        currencySymbol: reserve.symbol,
        depositAPY: reserve.borrowingEnabled ? Number(reserve.supplyAPY) : -1,
        avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
        stableBorrowRate:
          reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
            ? Number(reserve.stableBorrowAPY)
            : -1,
        variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowAPY) : -1,
        avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
        borrowingEnabled: reserve.borrowingEnabled,
        stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
        isFreezed: reserve.isFrozen,
        rdntRewardsDepositApr,
        rdntRewardsBorrowApr,
        isStable,
        loopAPY: Number(loopAPY) > 0 ? loopAPY : BN_ZERO,
        maxCap: 0,
      };
    });

  if (sortDesc) {
    if (sortName === 'currencySymbol') {
      sortedData.sort((a, b) =>
        b.currencySymbol.toUpperCase() < a.currencySymbol.toUpperCase() ? -1 : 0
      );
    } else {
      // @ts-ignore
      sortedData.sort((a, b) => a[sortName] - b[sortName]);
    }
  } else {
    if (sortName === 'currencySymbol') {
      sortedData.sort((a, b) =>
        a.currencySymbol.toUpperCase() < b.currencySymbol.toUpperCase() ? -1 : 0
      );
    } else {
      // @ts-ignore
      sortedData.sort((a, b) => b[sortName] - a[sortName]);
    }
  }

  useEffect(() => {
    if (
      currentMarketData.addresses.UWU_TOKEN &&
      currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
    ) {
      const multiFeeDistributionServiceV2 = new MultiFeeDistributionV2Service(
        uwuProvider,
        currentMarketData.addresses.UWU_TOKEN,
        currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
      );

      multiFeeDistributionServiceV2.getTotalLockedSupply().then((data) => {
        const lockedSupply = BigNumber(data.toString()).div(10 ** 18);
        const _projectedFeesPerYear = BigNumber(projectedFeesPerYear);
        const lpPrice =
          prices && prices.lpTokenPrice
            ? BigNumber(prices.lpTokenPrice.toString()).div(10 ** 8)
            : BigNumber('0');

        const apr = _projectedFeesPerYear.div(lockedSupply.multipliedBy(lpPrice)).multipliedBy(100);
        setAPR(apr);
      });
    }
  }, [prices]);

  return (
    <ScreenWrapper pageTitle="Markets" className="Markets" withMobileGrayBg={true}>
      <div className="TotalFeesLock" style={{ backgroundImage: `url(${marketsBackground})` }}>
        <PlatformFeesPaidToLocked totalPlatformFees={totalPlatformFees.toFixed(2).toString()} />
        <LockUwUAndEarn
          data={sortedData}
          projectedFeesPerYearByAssets={projectedFeesPerYearByAssets}
          projectedFeesPerYear={projectedFeesPerYear}
          apr={apr}
        />
      </div>

      <div className="Markets__table">
        <p className="Markets__table__title">Markets</p>
        <div className="Markets__table__marketSize">
          <TotalMarketsSize value={totalLockedInUsd} />
        </div>
        <MarketTable
          sortName={sortName}
          setSortName={setSortName}
          sortDesc={sortDesc}
          setSortDesc={setSortDesc}
        >
          {sortedData.map((item, index) => (
            <MarketTableItem {...item} isPriceInUSD={isPriceInUSD} key={index} />
          ))}
        </MarketTable>
      </div>

      <div className="Markets__mobile--cards">
        {sortedData.map((item, index) => (
          <MarketMobileCard {...item} key={index} />
        ))}
      </div>

      <WelcomeModal />
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </ScreenWrapper>
  );
}
