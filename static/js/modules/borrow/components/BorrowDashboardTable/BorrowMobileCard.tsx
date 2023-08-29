import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

import { BorrowRateMode } from '../../../../libs/pool-data-provider/graphql';
import CustomSwitch from '../../../../components/basic/CustomSwitch';
import MobileCardWrapper from '../../../../components/wrappers/MobileCardWrapper';
import Row from '../../../../components/basic/Row';
import Value from '../../../../components/basic/Value';
import LiquidityMiningCard from '../../../../components/liquidityMining/LiquidityMiningCard';
import NoData from '../../../../components/basic/NoData';
import Link from '../../../../components/basic/Link';
import DefaultButton from '../../../../components/basic/DefaultButton';
import BorrowInterestHelpModal from '../../../../components/HelpModal/BorrowInterestHelpModal';
import AMPLWarning from '../../../../components/AMPLWarning';

import defaultMessages from '../../../../defaultMessages';

import { BorrowTableItem } from './types';

export default function BorrowMobileCard({
  reserve: { symbol },
  currentBorrows,
  currentBorrowsUSD,
  borrowRate,
  avg30DaysVariableRate,
  borrowRateMode,
  onSwitchToggle,
  isActive,
  isFrozen,
  borrowingEnabled,
  stableBorrowRateEnabled,
  repayLink,
  borrowLink,
  vincentivesAPR,
  sincentivesAPR,
}: BorrowTableItem) {
  const intl = useIntl();
  const { currentTheme, isCurrentThemeDark } = useThemeContext();

  const swiperWidth = 50;
  const swiperHeight = 24;

  return (
    <>
      <MobileCardWrapper symbol={symbol}>
        <Row title="Current balance" withMargin={true}>
          <Value
            value={Number(currentBorrows)}
            subValue={Number(currentBorrowsUSD)}
            subSymbol="USD"
          />
        </Row>

        <Row title="APY" withMargin={true}>
          {borrowingEnabled ? (
            <LiquidityMiningCard
              symbol={symbol}
              value={Number(borrowRate)}
              thirtyDaysValue={
                borrowRateMode === BorrowRateMode.Variable ? avg30DaysVariableRate : ''
              }
              liquidityMiningValue={
                borrowRateMode === BorrowRateMode.Variable ? vincentivesAPR : sincentivesAPR
              }
              type={
                borrowRateMode === BorrowRateMode.Variable ? 'borrow-variable' : 'borrow-stable'
              }
            />
          ) : (
            <NoData color="dark" />
          )}
        </Row>

        <Row
          title={<BorrowInterestHelpModal text="APY Type" iconSize={12} />}
          withMargin={true}
          className="Row__center"
        >
          <CustomSwitch
            value={borrowRateMode === BorrowRateMode.Variable}
            offLabel="No"
            onLabel="Yes"
            onColor={isCurrentThemeDark ? currentTheme.lightBlue.hex : currentTheme.darkBlue.hex}
            offColor={isCurrentThemeDark ? currentTheme.lightBlue.hex : currentTheme.darkBlue.hex}
            onSwitch={onSwitchToggle}
            disabled={!stableBorrowRateEnabled || isFrozen || !isActive}
            swiperHeight={swiperHeight}
            swiperWidth={swiperWidth}
          />
        </Row>

        <Row title="Borrow more" className="Row__center" withMargin={true}>
          <Link
            to={borrowLink}
            className="ButtonLink"
            disabled={!isActive || !borrowingEnabled || isFrozen}
          >
            <DefaultButton
              title={intl.formatMessage(defaultMessages.borrow)}
              color="dark"
              disabled={!isActive || !borrowingEnabled || isFrozen}
            />
          </Link>
        </Row>

        <Row title="Repay your borrow" className="Row__center">
          <Link to={repayLink} className="ButtonLink" disabled={!isActive}>
            <DefaultButton
              title={intl.formatMessage(defaultMessages.repay)}
              color="dark"
              transparent={true}
              disabled={!isActive}
            />
          </Link>
        </Row>
      </MobileCardWrapper>

      {symbol === 'AMPL' && <AMPLWarning />}
    </>
  );
}
