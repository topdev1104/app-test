import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { valueToBigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

import { useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import Row from '../../../basic/Row';
import ValuePercent from '../../../basic/ValuePercent';
import Value from '../../../basic/Value';
import Link from '../../../basic/Link';
import MaxLTVHelpModal from '../../../HelpModal/MaxLTVHelpModal';
import LiquidationThresholdHelpModal from '../../../HelpModal/LiquidationThresholdHelpModal';
import LiquidationBonusHelpModal from '../../../HelpModal/LiquidationBonusHelpModal';
import { ValidationWrapperComponentProps } from '../../../RouteParamsValidationWrapper';
import { InterestRateSeries } from '../../../graphs/types';
import { GraphLegendDot } from '../../../graphs/GraphLegend';
import { getAssetInfo, TokenIcon } from '../../../../helpers/config/assets-config';

import messages from './messages';
import staticStyles from './style';

interface CurrencyOverviewProps
  extends Pick<ValidationWrapperComponentProps, 'poolReserve' | 'currencySymbol'> {
  title?: string;
  type: 'deposit' | 'borrow';
  showGraphCondition: boolean;
  dots?: GraphLegendDot[];
  series: InterestRateSeries[];
  isCollapse?: boolean;
  dollarPrefix: boolean;
}

export default function CurrencyOverview({
  title,
  poolReserve,
  currencySymbol,
  type,
  showGraphCondition,
  dots,
  series,
  dollarPrefix,
  isCollapse,
}: CurrencyOverviewProps) {
  const intl = useIntl();
  const { currentTheme, sm } = useThemeContext();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const asset = getAssetInfo(currencySymbol);

  const overviewData = {
    utilizationRate: Number(poolReserve.utilizationRate),
    availableLiquidity: poolReserve.availableLiquidity,
    priceInUsd: valueToBigNumber(poolReserve.priceInMarketReferenceCurrency)
      .multipliedBy(marketRefPriceInUsd)
      .toNumber(),
    depositApy: Number(poolReserve.supplyAPY),
    avg30DaysLiquidityRate: Number(poolReserve.avg30DaysLiquidityRate),
    stableRate: Number(poolReserve.stableBorrowAPY),
    variableRate: Number(poolReserve.variableBorrowAPY),
    avg30DaysVariableRate: Number(poolReserve.avg30DaysVariableBorrowRate),
    usageAsCollateralEnabled: poolReserve.usageAsCollateralEnabled,
    stableBorrowRateEnabled: poolReserve.stableBorrowRateEnabled,
    baseLTVasCollateral: Number(poolReserve.baseLTVasCollateral),
    liquidationThreshold: Number(poolReserve.reserveLiquidationThreshold),
    liquidationBonus: Number(poolReserve.reserveLiquidationBonus),
    borrowingEnabled: poolReserve.borrowingEnabled,
  };

  const isDeposit = type === 'deposit';

  return (
    <div
      className={classNames('CurrencyOverview', {
        CurrencyOverview__borrow: !isDeposit,
      })}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
          <TokenIcon tokenSymbol={currencySymbol} height={sm ? 32 : 32} width={sm ? 32 : 32} />
          <div>
            <Link
              to={`/reserve-overview/${poolReserve.underlyingAsset}${poolReserve.id}`}
              className="CurrencyOverview__captionLink"
              color="white"
            >
              <p>{intl.formatMessage(messages.caption, { symbol: asset && asset.name })}</p>
              <span style={{ fontSize: '12px' }}>&#10097;</span>
            </Link>
            <div>
              <Row
                className="CurrencyOverview__row"
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 40,
                    background:
                      'linear-gradient(108.66deg, rgba(160, 175, 255, 0.02) 0.33%, rgba(182, 255, 237, 0.02) 99.67%)',
                  }}
                >
                  {!!dollarPrefix && (
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.01em',
                        color: '#FFFFFF',
                        marginRight: '2px',
                      }}
                    >
                      Asset price: $
                    </span>
                  )}
                  <Value
                    tokenIcon={true}
                    value={overviewData.priceInUsd}
                    maximumValueDecimals={2}
                    color="white"
                  />
                </div>
              </Row>
            </div>
          </div>
        </div>

        <div className="CurrencyOverview__currency-items">
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={
                <MaxLTVHelpModal
                  text={intl.formatMessage(messages.maximumLTV)}
                  color="white"
                  lightWeight={true}
                />
              }
              color="white"
              weight="light"
              isColumn={isCollapse}
            >
              {overviewData.baseLTVasCollateral === 0 ? (
                <span className="CurrencyOverview__no-data">—</span>
              ) : (
                <ValuePercent value={overviewData.baseLTVasCollateral} color="white" />
              )}
            </Row>
          </div>
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={
                <LiquidationThresholdHelpModal
                  text={intl.formatMessage(messages.liquidationThreshold)}
                  color="dark"
                  lightWeight={true}
                />
              }
              color="dark"
              weight="light"
              isColumn={isCollapse}
            >
              {overviewData.liquidationThreshold <= 0 ? (
                <span className="CurrencyOverview__no-data">—</span>
              ) : (
                <ValuePercent value={overviewData.liquidationThreshold} color="white" />
              )}
            </Row>
          </div>
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={
                <LiquidationBonusHelpModal
                  text={intl.formatMessage(messages.liquidationPenalty)}
                  color="white"
                  lightWeight={true}
                />
              }
              color="white"
              weight="light"
              isColumn={isCollapse}
            >
              {overviewData.liquidationBonus <= 0 ? (
                <span className="CurrencyOverview__no-data">—</span>
              ) : (
                <ValuePercent value={overviewData.liquidationBonus} color="white" />
              )}
            </Row>
          </div>
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={intl.formatMessage(messages.canBeUsedAsCollateral)}
              color="white"
              weight="light"
              isColumn={isCollapse}
            >
              <p
                className={classNames('CurrencyOverview__usageAsCollateral', {
                  CurrencyOverview__usageAsCollateralDisabled:
                    !overviewData.usageAsCollateralEnabled,
                })}
              >
                {intl.formatMessage(
                  overviewData.usageAsCollateralEnabled ? messages.yes : messages.no
                )}
              </p>
            </Row>
          </div>
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={intl.formatMessage(messages.utilizationRate)}
              color="white"
              weight="light"
              isColumn={isCollapse}
            >
              {overviewData.borrowingEnabled ? (
                <ValuePercent
                  value={overviewData.utilizationRate ? overviewData.utilizationRate : '0'}
                  color="white"
                />
              ) : (
                <span className="CurrencyOverview__noData">—</span>
              )}
            </Row>
          </div>
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={intl.formatMessage(messages.availableLiquidity)}
              color="white"
              weight="light"
              isColumn={isCollapse}
            >
              <Value
                maximumValueDecimals={2}
                minimumValueDecimals={2}
                symbol={currencySymbol}
                value={overviewData.availableLiquidity}
                color="white"
              />
            </Row>
          </div>
          <div className="CurrencyOverview__currency-item">
            <Row
              className="CurrencyOverview__row"
              title={intl.formatMessage(messages.depositAPY)}
              subTitle={
                !!overviewData.avg30DaysLiquidityRate && !isCollapse
                  ? intl.formatMessage(messages.depositAPR)
                  : ''
              }
              color="white"
              weight="light"
              isColumn={isCollapse}
            >
              <div className="CurrencyOverview__rowWithDoubleValue">
                {overviewData.borrowingEnabled ? (
                  <>
                    <ValuePercent value={overviewData.depositApy} color="white" />
                    {!!overviewData.avg30DaysLiquidityRate && !isCollapse && (
                      <ValuePercent
                        value={overviewData.avg30DaysLiquidityRate}
                        color="white"
                        className="CurrencyOverview__thirtyDays"
                      />
                    )}
                  </>
                ) : (
                  <span className="CurrencyOverview__no-data">—</span>
                )}
              </div>
            </Row>
          </div>
        </div>

        <div className="CurrencyOverview__currency-items-mobile">
          <div className="CurrencyOverview__currency-items-mobile__row">
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={
                  <MaxLTVHelpModal
                    text={intl.formatMessage(messages.maximumLTV)}
                    color="white"
                    lightWeight={true}
                  />
                }
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                {overviewData.baseLTVasCollateral === 0 ? (
                  <span className="CurrencyOverview__no-data">—</span>
                ) : (
                  <ValuePercent value={overviewData.baseLTVasCollateral} color="white" />
                )}
              </Row>
            </div>
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={
                  <LiquidationThresholdHelpModal
                    text={intl.formatMessage(messages.liquidationThreshold)}
                    color="white"
                    lightWeight={true}
                  />
                }
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                {overviewData.liquidationThreshold <= 0 ? (
                  <span className="CurrencyOverview__no-data">—</span>
                ) : (
                  <ValuePercent value={overviewData.liquidationThreshold} color="white" />
                )}
              </Row>
            </div>
          </div>
          <div className="CurrencyOverview__currency-items-mobile__row">
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={
                  <LiquidationBonusHelpModal
                    text={intl.formatMessage(messages.liquidationPenalty)}
                    color="white"
                    lightWeight={true}
                  />
                }
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                {overviewData.liquidationBonus <= 0 ? (
                  <span className="CurrencyOverview__no-data">—</span>
                ) : (
                  <ValuePercent value={overviewData.liquidationBonus} color="white" />
                )}
              </Row>
            </div>
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={intl.formatMessage(messages.canBeUsedAsCollateral)}
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                <p
                  className={classNames('CurrencyOverview__usageAsCollateral', {
                    CurrencyOverview__usageAsCollateralDisabled:
                      !overviewData.usageAsCollateralEnabled,
                  })}
                >
                  {intl.formatMessage(
                    overviewData.usageAsCollateralEnabled ? messages.yes : messages.no
                  )}
                </p>
              </Row>
            </div>
          </div>
          <div className="CurrencyOverview__currency-items-mobile__row">
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={intl.formatMessage(messages.assetPrice)}
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                <Value
                  tokenIcon={true}
                  symbol="USD"
                  value={overviewData.priceInUsd}
                  maximumValueDecimals={2}
                  color="white"
                />
              </Row>
            </div>
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={intl.formatMessage(messages.depositAPY)}
                subTitle={
                  !!overviewData.avg30DaysLiquidityRate && !isCollapse
                    ? intl.formatMessage(messages.depositAPR)
                    : ''
                }
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                <div className="CurrencyOverview__rowWithDoubleValue">
                  {overviewData.borrowingEnabled ? (
                    <>
                      <ValuePercent value={overviewData.depositApy} color="white" />
                      {!!overviewData.avg30DaysLiquidityRate && !isCollapse && (
                        <ValuePercent
                          value={overviewData.avg30DaysLiquidityRate}
                          color="white"
                          className="CurrencyOverview__thirtyDays"
                        />
                      )}
                    </>
                  ) : (
                    <span className="CurrencyOverview__no-data">—</span>
                  )}
                </div>
              </Row>
            </div>
          </div>
          <div className="CurrencyOverview__currency-items-mobile__row">
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title={intl.formatMessage(messages.utilizationRate)}
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                {overviewData.borrowingEnabled ? (
                  <ValuePercent
                    value={overviewData.utilizationRate ? overviewData.utilizationRate : '0'}
                    color="white"
                  />
                ) : (
                  <span className="CurrencyOverview__noData">—</span>
                )}
              </Row>
            </div>
            <div className="CurrencyOverview__currency-item">
              <Row
                className="CurrencyOverview__row"
                title="Available liquidity"
                color="white"
                weight="light"
                isColumn={isCollapse}
              >
                <Value
                  symbol={currencySymbol}
                  value={Number(overviewData.availableLiquidity).toFixed(2)}
                  color="white"
                />
              </Row>
            </div>
          </div>
        </div>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={false}>{`
        @import 'src/_mixins/screen-size';

        .CurrencyOverview {
          color: ${currentTheme.white.hex};

          .ValuePercent.ValuePercent__darkOrange,
          .ValuePercent.ValuePercent__primary,
          .ValuePercent.ValuePercent__secondary {
            .ValuePercent__value.ValuePercent__value {
              span {
                color: ${currentTheme.white.hex};
              }
            }
          }

          &__usageAsCollateral {
            color: ${currentTheme.green.hex};
          }
          &__usageAsCollateralDisabled {
            color: ${currentTheme.red.hex};
          }

          .ValuePercent__value,
          .Value__value,
          .CurrencyOverview__usageAsCollateral,
          .Row__title,
          .TextWithModal__text {
            @include respond-to(xs) {
              font-size: 12px;
            }
          }
        }
      `}</style>
    </div>
  );
}
