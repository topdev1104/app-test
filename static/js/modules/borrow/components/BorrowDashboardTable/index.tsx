import { useThemeContext } from '../../../../libs/aave-ui-kit';
import DashboardTable from '../../../dashboard/components/DashboardTable';
import TableHeader from '../../../dashboard/components/DashboardTable/TableHeader';
import BorrowItem from './BorrowItem';
import DashboardMobileCardsWrapper from '../../../dashboard/components/DashboardMobileCardsWrapper';
import BorrowMobileCard from './BorrowMobileCard';

import { BorrowTableItem } from './types';
import { ReactElement } from 'react';

interface BorrowDashboardTableProps {
  listData: BorrowTableItem[];
}

export default function BorrowDashboardTable({ listData }: BorrowDashboardTableProps) {
  const { sm } = useThemeContext();
  const head = ['Your borrow', 'Current balance', 'APY'];
  return (
    <>
      {!sm ? (
        <>
          <TableHeader head={head} />
          <DashboardTable>
            {listData.map(
              (item: BorrowTableItem, index: number): ReactElement => (
                <BorrowItem
                  {...item}
                  index={index}
                  key={index}
                  data-cy={`dashboardBorrowListItem_${item.reserve.symbol}`}
                />
              )
            )}
          </DashboardTable>
        </>
      ) : (
        <DashboardMobileCardsWrapper>
          {listData.map((item, index) => (
            <BorrowMobileCard {...item} key={index} />
          ))}
        </DashboardMobileCardsWrapper>
      )}
    </>
  );
}
