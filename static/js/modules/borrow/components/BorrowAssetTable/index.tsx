import BasicAssetsTable from '../../../../components/BasicAssetsTable';
import BorrowItem from './BorrowItem';

import messages from './messages';

import { BorrowTableItem } from './types';

interface BorrowAssetTableProps {
  listData: BorrowTableItem[];
  userId?: string;
  sortName: string;
  setSortName: (value: string) => void;
  sortDesc: boolean;
  setSortDesc: (value: boolean) => void;
}

export default function BorrowAssetTable({
  listData,
  userId,
  sortName,
  setSortName,
  sortDesc,
  setSortDesc,
}: BorrowAssetTableProps) {
  const columns = [
    {
      title: messages.asset,
    },
    {
      title: messages.availableToBorrow,
      subtitle: messages.basedCollateral,
    },
    {
      title: messages.variableAPY,
      sortKey: 'variableBorrowRate',
    },
  ];

  return (
    <BasicAssetsTable
      columns={columns}
      sortName={sortName}
      setSortName={setSortName}
      sortDesc={sortDesc}
      setSortDesc={setSortDesc}
    >
      {listData.map((item, index) => (
        <BorrowItem {...item} key={index} userId={userId} onClick={item.onClick} />
      ))}
    </BasicAssetsTable>
  );
}
