import { useIntl } from 'react-intl';

import TableItem from '../../../dashboard/components/DashboardTable/TableItem';
import TableValueCol from '../../../dashboard/components/DashboardTable/TableValueCol';
import TableButtonsWrapper from '../../../dashboard/components/DashboardTable/TableButtonsWrapper';

import defaultMessages from '../../../../defaultMessages';

import { BorrowTableItem } from './types';
import TableButtonColumn from '../../../dashboard/components/DashboardTable/TableButtonColumn';
import TableAprCol from '../../../dashboard/components/DashboardTable/TableAprCol';
import { ReactElement, memo } from 'react';

function BorrowItem(props: BorrowTableItem): ReactElement {
  const {
    reserve: { symbol },
    uiColor,
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
    index,
    vincentivesAPR,
    sincentivesAPR,
    onBorrowClick,
    onRepayClick,
    rdntRewardsBorrowApr,
    apy,
    ...rest
  } = props;
  const intl = useIntl();

  return (
    <TableItem tokenSymbol={symbol} {...rest} color={uiColor}>
      <TableValueCol value={Number(currentBorrows)} subValue={Number(currentBorrowsUSD)} />
      <TableAprCol
        type="borrow"
        value={apy ?? 0}
        liquidityMiningValue={rdntRewardsBorrowApr ?? 0}
        symbol={symbol}
      />
      <TableButtonsWrapper>
        <TableButtonColumn
          disabled={!isActive || !borrowingEnabled || isFrozen}
          title={intl.formatMessage(defaultMessages.borrow)}
          // linkTo={borrowLink}
          onClick={onBorrowClick}
        />
        <TableButtonColumn
          disabled={!isActive}
          title={intl.formatMessage(defaultMessages.repay)}
          // linkTo={repayLink}
          onClick={onRepayClick}
          className="TableButtonCol__repay"
        />
      </TableButtonsWrapper>
    </TableItem>
  );
}

export default BorrowItem;
