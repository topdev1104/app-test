import BasicAssetsTable from '../../../../components/BasicAssetsTable';
import VaultItem from './VaultItem';

import messages from './messages';

import { VaultTableItem } from './types';

interface VaultAssetTableProps {
  listData: VaultTableItem[];
  userId?: string;
}

export default function VaultAssetTable({ listData, userId }: VaultAssetTableProps) {
  const columns = [
    {
      title: messages.asset,
    },
    {
      title: messages.APY,
      sortKey: 'variableBorrowRate',
    },
    {
      title: messages.totalAssets,
      sortKey: 'totalAssets',
    },
    {
      title: messages.buttons,
    },
  ];

  return (
    <BasicAssetsTable columns={columns}>
      {listData.map((item, index) => (
        <VaultItem {...item} key={index} userId={userId} />
      ))}
    </BasicAssetsTable>
  );
}
