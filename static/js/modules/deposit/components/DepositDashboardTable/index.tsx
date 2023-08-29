import { useThemeContext } from '../../../../libs/aave-ui-kit';
import { ReactElement } from 'react';
import DashboardTable from '../../../dashboard/components/DashboardTable';
import TableHeader from '../../../dashboard/components/DashboardTable/TableHeader';
import DepositItem from './DepositItem';
import DashboardMobileCardsWrapper from '../../../dashboard/components/DashboardMobileCardsWrapper';
import DepositMobileCard from './DepositMobileCard';
import { DepositTableItem } from './types';
import staticStyles from './style';

interface DepositDashboardTableProps {
  listData: DepositTableItem[];
  TableItem?: (props: DepositTableItem) => ReactElement;
  headers?: string[];
}

const head: string[] = ['Your deposit', 'Current balance', 'APY', 'Collateral'];

export default function DepositDashboardTable(props: DepositDashboardTableProps): ReactElement {
  const { listData, headers = head, TableItem } = props;
  const { sm } = useThemeContext();
  return (
    <>
      {!sm ? (
        <>
          <TableHeader head={headers} isDeposit />
          <DashboardTable>
            {listData.map((item: DepositTableItem, index): ReactElement => {

              console.log('item ===--->>>', index)
              const props = {
                ...item,
                index,
                key: `${TableItem ? 'table-item' : 'deposit-item'}-${index}`,
                'data-cy': `dashboardDespositListItem${item.reserve.symbol}`,
              };
              return <>{TableItem ? <TableItem {...props} /> : <DepositItem {...props} />}</>;
            })}
          </DashboardTable>
        </>
      ) : (
        <DashboardMobileCardsWrapper>
          {listData.map((item: DepositTableItem, index) => (
            <DepositMobileCard {...item} key={`deposit-mobile-card-${index}`} />
          ))}
        </DashboardMobileCardsWrapper>
      )}
      <style jsx={true} global={false}>
        {staticStyles}
      </style>
    </>
  );
}
