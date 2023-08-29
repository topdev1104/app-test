import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import ValuePercent from '../../basic/ValuePercent';
import ThirtyDayAverage from '../ThirtyDayAverage';
import LiquidityMiningAPYLine from '../LiquidityMiningAPYLine';

import staticStyles from './style';

interface LiquidityMiningCardProps {
  symbol?: string;
  type?: string;
  value?: string | number;
  thirtyDaysValue?: string | number;
  liquidityMiningValue?: string | number;
  className?: string;
  mobilePosition?: 'left' | 'right';
  noBorder?: boolean;
  showUwUIcon?: boolean;
}

export default function LiquidityMiningCard({
  symbol,
  type,
  value = '-1',
  thirtyDaysValue,
  liquidityMiningValue,
  className,
  mobilePosition = 'right',
  noBorder,
  showUwUIcon = false,
}: LiquidityMiningCardProps) {
  const { currentTheme, sm, isCurrentThemeDark } = useThemeContext();

  const helpLiquidityAPYTooltipId =
    symbol && type ? `help-liquidity-apy-${type}-${symbol}` : undefined;
  const thirtyDaysAverageTooltipId =
    symbol && type ? `show-30days-average-${type}-${symbol}` : undefined;

  return (
    <div
      className={classNames(
        'LiquidityMiningCard',
        `LiquidityMiningCard__${mobilePosition}`,
        className
      )}
    >
      <div
        className={
          !sm && !!symbol && thirtyDaysValue && +thirtyDaysValue > 0
            ? 'LiquidityMiningCard__valueWithTooltip'
            : ''
        }
        data-tip={!!symbol}
        data-for={thirtyDaysAverageTooltipId}
      >
        {value.toString() !== '-1' ? (
          <ValuePercent maximumDecimals={2} minimumDecimals={2} value={value} />
        ) : null}
      </div>

      {!sm && !!symbol && thirtyDaysValue && +thirtyDaysValue > 0 ? (
        <ReactTooltip
          className="LiquidityMiningCard__tooltip"
          id={thirtyDaysAverageTooltipId}
          effect="solid"
        >
          <ThirtyDayAverage forTooltip={true} size="small" value={+thirtyDaysValue} />
        </ReactTooltip>
      ) : undefined}

      {sm && (
        <>
          {thirtyDaysValue && +thirtyDaysValue > 0 ? (
            <ThirtyDayAverage value={+thirtyDaysValue} />
          ) : null}
        </>
      )}

      {((liquidityMiningValue && liquidityMiningValue !== '0') ||
        (symbol === 'FEI' && type !== 'borrow-stable' && type !== 'deposit')) && (
        <LiquidityMiningAPYLine
          symbol={symbol}
          value={liquidityMiningValue || 0}
          tooltipId={helpLiquidityAPYTooltipId}
          noBorder={noBorder}
          showUwUIcon={showUwUIcon}
        />
      )}

      {liquidityMiningValue && liquidityMiningValue === '0' && type === 'borrow-stable' && (
        <div style={{ color: 'white', fontSize: '12px' }}>Fetching UwU APR...</div>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .LiquidityMiningAPYLine__withTooltip {
          .ValuePercent {
            p {
              font-size: 14px !important;
            }
          }
        }
        .LiquidityMiningCard__tooltip {
          background: ${isCurrentThemeDark
            ? currentTheme.mainBg.hex
            : currentTheme.darkBlue.hex} !important;
          &:after {
            border-top-color: ${isCurrentThemeDark
              ? currentTheme.mainBg.hex
              : currentTheme.darkBlue.hex} !important;
          }
        }
      `}</style>
    </div>
  );
}
