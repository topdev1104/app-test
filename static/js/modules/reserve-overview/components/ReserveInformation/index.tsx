import { useIntl } from 'react-intl';
import { valueToBigNumber } from '@aave/protocol-js';

import { useThemeContext } from '../../../../libs/aave-ui-kit';
import MaxLTVHelpModal from '../../../../components/HelpModal/MaxLTVHelpModal';
import LiquidationThresholdHelpModal from '../../../../components/HelpModal/LiquidationThresholdHelpModal';
import LiquidationBonusHelpModal from '../../../../components/HelpModal/LiquidationBonusHelpModal';
import ReserveStatusGraph from '../Graphs/ReserveStatus';
import TotalValue from '../TotalValue';
import PercentBlock from '../InformationBlock/PercentBlock';
import TextBlock from '../InformationBlock/TextBlock';
import APYCard from '../APYCard';
import APYLine from '../APYLine';
import Link from '../../../../components/basic/Link';

import defaultMessages from '../../../../defaultMessages';
import messages from './messages';
import staticStyles from './style';

import linkIcon from '../../../../images/blueLinkIcon.svg';
import { getLPTokenPoolLink } from '../../../../helpers/lp-tokens';
import {
  ComputedReserveData,
  useDynamicPoolDataContext,
} from '../../../../libs/pool-data-provider';
import { getAssetInfo, TokenIcon } from '../../../../helpers/config/assets-config';
import { useHistory } from 'react-router-dom';
import backArrowPurp from '../../../../images/back-arrowPurp.svg';
import ReserveOverviewTableFooter from '../ReserveOverviewTableFooter';
import MarketPrice from '../../../markets/components/MarketPrice';
import buyArrow from '../../../../images/buy-arrow.svg';
import Refresh from '../../../../images/refresh.svg';
import Value from '../../../../components/basic/Value';
import SubValue from '../../../../components/basic/Value/SubValue';
import { Divider } from 'antd';

interface ReserveInformationProps {
  symbol: string;
  poolReserve: ComputedReserveData;
  marketRefPriceInUsd: string;
  dollarPrefix?: boolean;
}

export default function ReserveInformation({
  dollarPrefix,
  symbol,
  poolReserve,
  marketRefPriceInUsd,
}: ReserveInformationProps) {
  const intl = useIntl();
  const history = useHistory();

  const totalLiquidityInUsd = valueToBigNumber(poolReserve.totalLiquidity)
    .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd)
    .toString();
  const totalBorrowsInUsd = valueToBigNumber(poolReserve.totalDebt)
    .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd)
    .toString();
  const availableLiquidityInUsd = valueToBigNumber(poolReserve.availableLiquidity)
    .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd)
    .toString();

  const reserveOverviewData = {
    totalLiquidityInUsd,
    totalBorrowsInUsd,
    availableLiquidityInUsd,
    totalLiquidity: poolReserve.totalLiquidity,
    totalBorrows: poolReserve.totalDebt,
    availableLiquidity: poolReserve.availableLiquidity,
    supplyAPY: Number(poolReserve.supplyAPY),
    supplyAPR: Number(poolReserve.supplyAPR),
    avg30DaysLiquidityRate: Number(poolReserve.avg30DaysLiquidityRate),
    stableAPY: Number(poolReserve.stableBorrowAPY),
    stableAPR: Number(poolReserve.stableBorrowAPR),
    variableAPY: Number(poolReserve.variableBorrowAPY),
    variableAPR: Number(poolReserve.variableBorrowAPR),
    stableOverTotal: valueToBigNumber(poolReserve.totalStableDebt)
      .dividedBy(poolReserve.totalDebt)
      .toNumber(),
    variableOverTotal: valueToBigNumber(poolReserve.totalVariableDebt)
      .dividedBy(poolReserve.totalDebt)
      .toNumber(),
    avg30DaysVariableRate: Number(poolReserve.avg30DaysVariableBorrowRate),
    utilizationRate: Number(poolReserve.utilizationRate),
    baseLTVasCollateral: Number(poolReserve.baseLTVasCollateral),
    liquidationThreshold: Number(poolReserve.reserveLiquidationThreshold),
    liquidationBonus: Number(poolReserve.reserveLiquidationBonus),
    usageAsCollateralEnabled: poolReserve.usageAsCollateralEnabled,
    stableBorrowRateEnabled: poolReserve.stableBorrowRateEnabled,
    borrowingEnabled: poolReserve.borrowingEnabled,
  };

  const poolLink = getLPTokenPoolLink({
    symbol,
    underlyingAsset: poolReserve.underlyingAsset,
  });
  const percentFromValue = (percent: number, value: number) => percent * (value / 100);

  const iconSize = 44;
  const symbolsLength = getAssetInfo(symbol).symbolsArray?.length || 0;
  const formattedIconSize =
    symbolsLength === 3
      ? percentFromValue(70, iconSize)
      : symbolsLength === 4
      ? percentFromValue(60, iconSize)
      : iconSize;

  const IS_SIFU_OLD = symbol === 'SIFU_OLD';
  const symbolLabel = IS_SIFU_OLD ? 'SIFU (old)' : symbol;

  return (
    <div className="ReserveInformation">
      <div className="ReserveInformation__inner">
        <div className="ReserveInformation__content">
          {poolLink && (
            <div className="ReserveInformation__poolLink-inner">
              <p>
                {intl.formatMessage(messages.provideLiquidity, {
                  here: (
                    <Link
                      to={poolLink}
                      title="here"
                      absolute={true}
                      inNewWindow={true}
                      bold={true}
                      color="secondary"
                    />
                  ),
                })}
              </p>
              <img src={linkIcon} alt="" />
            </div>
          )}

          <div className="ReserveInformation__inner__info">
            <div className="BackTo" onClick={history.goBack}>
              <img src={backArrowPurp} alt="" />
              <span>Back to market</span>
            </div>
            <div className="ReserveInformation__inner__info__graph">
              <p className="ReserveInformation__inner__info__graph__title">
                Reserve overview {symbolLabel}
              </p>
              <div className="ReserveInformation__inner__info__graph-data">
                <div className="ReserveInformation__inner__info__graph-data__values">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TotalValue
                      color="red"
                      title="Total Borrowed"
                      value={reserveOverviewData.totalBorrows}
                      subValue={reserveOverviewData.totalBorrowsInUsd}
                      borrowingEnabled={reserveOverviewData.borrowingEnabled}
                    />
                  </div>
                  <div className="ReserveInformation__inner__info__graph__inner">
                    <ReserveStatusGraph
                      symbol={symbol}
                      totalBorrows={reserveOverviewData.totalBorrows}
                      availableLiquidity={reserveOverviewData.availableLiquidity}
                    />
                    <div className="ReserveStatusGraphContainer">
                      <TokenIcon
                        className="ReserveStatusGraph__icon"
                        tokenSymbol={symbol}
                        height={formattedIconSize}
                        width={formattedIconSize}
                      />
                    </div>
                  </div>
                  <div>
                    <TotalValue
                      title="Available Liquidity"
                      value={reserveOverviewData.availableLiquidity}
                      subValue={reserveOverviewData.availableLiquidityInUsd}
                      borrowingEnabled={reserveOverviewData.borrowingEnabled}
                    />
                  </div>
                </div>
              </div>
              <div className="PlatformFeesPaidToLocked__footer">
                <div className="PlatformFeesPaidToLocked__footer__price">
                  <TokenIcon width={35} height={35} tokenSymbol={symbol} />
                  <div>
                    <div>
                      <div className="PlatformFeesPaidToLocked__footer__price__symbol">
                        {symbolLabel}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {!!dollarPrefix && <span>$</span>}
                        <Value
                          value={poolReserve.priceInMarketReferenceCurrency}
                          maximumValueDecimals={2}
                          tokenIcon={true}
                        />
                      </div>
                    </div>
                  </div>
                  {poolReserve.underlyingAsset.toLowerCase() != '0x5938999Dd0cC4d480c3B1a451AECc78aE4dDaab5'.toLowerCase() ? <a
                    href={`https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${poolReserve.underlyingAsset}`}
                    className="PlatformFeesPaidToLocked__footer__price__button"
                  >
                    <img src={Refresh} alt="refresh" />
                    Buy
                    <img src={buyArrow} alt="buyArrow" />
                  </a> : <div></div>}

                </div>
              </div>
            </div>

            <div className="ReserveInformation__bottom-info-mobile">
              <div
                className="ReserveInformation__bottom-info-mobile__row"
                style={{ marginTop: '10px' }}
              >
                <div style={{ width: '100%' }}>
                  <PercentBlock
                    value={reserveOverviewData.baseLTVasCollateral}
                    titleComponent={<MaxLTVHelpModal text="Maximum LTV" />}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <PercentBlock
                    value={
                      reserveOverviewData.liquidationBonus <= 0
                        ? 0
                        : reserveOverviewData.liquidationThreshold
                    }
                    titleComponent={<LiquidationThresholdHelpModal text="Liquidation threshold" />}
                  />
                </div>
              </div>
              <div
                className="ReserveInformation__bottom-info-mobile__row"
                style={{ marginTop: '20px' }}
              >
                <div style={{ width: '100%' }}>
                  <PercentBlock
                    value={reserveOverviewData.liquidationBonus}
                    titleComponent={<LiquidationBonusHelpModal text="Liquidation penalty" />}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <TextBlock
                    condition={reserveOverviewData.usageAsCollateralEnabled}
                    title="Used as collateral"
                  />
                </div>
              </div>
              <div
                className="ReserveInformation__bottom-info-mobile__row"
                style={{ marginTop: '20px' }}
              >
                <div style={{ width: '100%' }}>
                  <PercentBlock
                    value={
                      reserveOverviewData.borrowingEnabled ? reserveOverviewData.utilizationRate : 0
                    }
                    title="Utilisation rate"
                  />
                </div>
              </div>
            </div>

            <div className="ReserveInformation__APY-info">
              <div className="ReserveInformation__APY-info__card-wrapper">
                <APYCard title={intl.formatMessage(defaultMessages.deposit)}>
                  <div className="gorizontalDiv__cards"></div>
                  <APYLine
                    title={intl.formatMessage(messages.depositAPY)}
                    value={reserveOverviewData.supplyAPY}
                    condition={reserveOverviewData.borrowingEnabled}
                  />
                  <div className="gorizontalDiv__cards"></div>
                  <APYLine
                    title={intl.formatMessage(messages.depositAPR)}
                    value={reserveOverviewData.supplyAPR}
                    condition={reserveOverviewData.borrowingEnabled}
                  />
                  <div className="gorizontalDiv__cards"></div>
                </APYCard>
              </div>
              <div className="ReserveInformation__APY-info__card-wrapper-borrowing">
                <APYCard title={intl.formatMessage(messages.variableBorrowing)}>
                  <div className="gorizontalDiv__cards"></div>
                  <APYLine
                    title={intl.formatMessage(messages.borrowAPY)}
                    value={reserveOverviewData.variableAPY}
                    condition={reserveOverviewData.borrowingEnabled}
                  />
                  <div className="gorizontalDiv__cards"></div>
                  <APYLine
                    title={intl.formatMessage(messages.borrowAPR)}
                    value={reserveOverviewData.variableAPR}
                    condition={reserveOverviewData.borrowingEnabled}
                  />
                  <div className="gorizontalDiv__cards"></div>
                  <APYLine
                    title={intl.formatMessage(messages.overTotal)}
                    value={reserveOverviewData.variableOverTotal}
                    condition={reserveOverviewData.borrowingEnabled}
                  />
                </APYCard>
              </div>
            </div>

            <div className="ReserveInformation__bottom-info">
              <div>
                <PercentBlock
                  value={reserveOverviewData.baseLTVasCollateral}
                  titleComponent={<MaxLTVHelpModal text="Maximum LTV" />}
                />
              </div>
              {/* <div className="VerticalDiv"></div> */}
              <div>
                <PercentBlock
                  value={
                    reserveOverviewData.liquidationBonus <= 0
                      ? 0
                      : reserveOverviewData.liquidationThreshold
                  }
                  titleComponent={<LiquidationThresholdHelpModal text="Liquidation threshold" />}
                />
              </div>
              {/* <div className="VerticalDiv"></div> */}
              <div>
                <PercentBlock
                  value={reserveOverviewData.liquidationBonus}
                  titleComponent={<LiquidationBonusHelpModal text="Liquidation penalty" />}
                />
              </div>
              {/* <div className="VerticalDiv"></div> */}
              <div>
                <TextBlock
                  condition={reserveOverviewData.usageAsCollateralEnabled}
                  title="Used as collateral"
                />
              </div>
              {/* <div className="VerticalDiv"></div> */}
              <div>
                <PercentBlock
                  value={
                    reserveOverviewData.borrowingEnabled ? reserveOverviewData.utilizationRate : 0
                  }
                  title="Utilisation rate"
                />
              </div>
            </div>
            <ReserveOverviewTableFooter />
          </div>
        </div>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true}>
        {`
          .ReserveStatusGraphContainer {
            width: 161px;
            height: 161px;
            opacity: 0.8;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            top: -161px;
            left: 4px;
          }
        `}
      </style>
    </div>
  );
}
