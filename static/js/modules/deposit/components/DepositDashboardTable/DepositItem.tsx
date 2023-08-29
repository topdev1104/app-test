import { useThemeContext } from '../../../../libs/aave-ui-kit';
import CustomSwitch from '../../../../components/basic/CustomSwitch';
import TableItem from '../../../dashboard/components/DashboardTable/TableItem';
import TableValueCol from '../../../dashboard/components/DashboardTable/TableValueCol';
import TableCol from '../../../dashboard/components/DashboardTable/TableCol';
import TableButtonsWrapper from '../../../dashboard/components/DashboardTable/TableButtonsWrapper';
import { DepositTableItem } from './types';
import TableButtonColumn from '../../../dashboard/components/DashboardTable/TableButtonColumn';
import { ReactElement } from 'react';
import TableAprCol from '../../../dashboard/components/DashboardTable/TableAprCol';
import cx from 'classnames';

export default function DepositItem(props: DepositTableItem): ReactElement {
  const {
    reserve,
    uiColor,
    usageAsCollateralEnabledOnUser,
    usageAsCollateralEnabledOnThePool,
    underlyingBalance,
    underlyingBalanceUSD,
    onToggleSwitch,
    isActive,
    isFrozen,
    avg30DaysLiquidityRate,
    index,
    aincentivesAPR,
    onDeposit,
    onWithdraw,
    depositAPY,
    ...rest
  } = props;
  const { symbol, underlyingAsset } = reserve
  const { currentTheme, xl, lg, md } = useThemeContext();

  const swiperWidth = xl && !lg ? 30 : md ? 30 : 40;
  const swiperHeight = xl && !lg ? 16 : md ? 16 : 20;

  // const onColor = 'linear-gradient(180deg, #4CA9DE 0%, #4CDEBB 100%)';
  const onColor = '#4CA9DE';

  const apr = Number(aincentivesAPR).toFixed(6);

  const IS_SIFU_OLD = underlyingAsset.toLowerCase() === '0x29127fe04ffa4c32acac0ffe17280abd74eac313'

  const symbolLabel = IS_SIFU_OLD ? 'SIFU_OLD' : symbol;

  return (
    <>
      <TableItem tokenSymbol={symbolLabel} color={uiColor} {...rest}>
        <TableValueCol value={Number(underlyingBalance)} subValue={Number(underlyingBalanceUSD)} />
        <TableAprCol
          type="deposit"
          value={depositAPY || 0}
          liquidityMiningValue={apr}
          symbol={symbol}
        />
        <TableCol>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <CustomSwitch
              className={cx('collateral', { active: usageAsCollateralEnabledOnUser })}
              value={usageAsCollateralEnabledOnUser}
              onColor={onColor}
              offColor={currentTheme.red.hex}
              onSwitch={onToggleSwitch}
              disabled={!usageAsCollateralEnabledOnThePool}
              swiperHeight={swiperHeight}
              swiperWidth={swiperWidth}
            />
            <span className={cx('SwitchVariableLabel', { active: usageAsCollateralEnabledOnUser })}>
              {usageAsCollateralEnabledOnUser ? 'Yes' : 'No'}
            </span>
          </div>
        </TableCol>
        <TableButtonsWrapper>
          <TableButtonColumn disabled={!isActive || isFrozen} title="Deposit" onClick={onDeposit} />
          <TableButtonColumn
            className="TableButtonCol__withdraw"
            disabled={!isActive}
            title="Withdraw"
            onClick={onWithdraw}
          />
        </TableButtonsWrapper>
      </TableItem>
      <style jsx global>
        {`
          .SwitchVariableLabel {
            color: rgb(222, 89, 89);
            font-size: 12px;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            line-height: 16px;

            &.active {
              color: #abf3c7;
            }
          }
          .Switcher.collateral {
            .Switcher__swiper {
              .react-switch-bg {
                background: rgb(222, 89, 89) !important;
              }
            }
            &.active {
              .Switcher__swiper {
                .react-switch-bg {
                  background: linear-gradient(180deg, #4ca9de 0%, #4cdebb 100%) !important;
                }
              }
            }
          }
        `}
      </style>
    </>
  );
}
