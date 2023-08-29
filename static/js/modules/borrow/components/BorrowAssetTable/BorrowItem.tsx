import TableItemBorrow from '../../../../components/BasicAssetsTable/TableItemBorrow';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import Value from '../../../../components/basic/Value';
import LiquidityMiningCard from '../../../../components/liquidityMining/LiquidityMiningCard';
import NoData from '../../../../components/basic/NoData';

import { BorrowTableItem } from './types';

export default function BorrowItem({
  id,
  symbol,
  underlyingAsset,
  availableBorrows,
  availableBorrowsInUSD,
  stableBorrowRate,
  variableBorrowRate,
  avg30DaysVariableRate,
  stableBorrowRateEnabled,
  userId,
  isFreezed,
  vincentivesAPR,
  sincentivesAPR,
  rdntRewardsBorrowApr,
  onClick,
}: BorrowTableItem) {
  const url = `/borrow/${underlyingAsset}-${id}`;

  return (
    <TableItemBorrow
      symbol={symbol}
      isFreezed={isFreezed}
      disabledButton={!(Number(availableBorrows) > 0)}
      darkOnDarkMode={true}
      onClick={onClick}
    >
      <TableColumn>
        {!userId || Number(availableBorrows) <= 0 ? (
          <NoData color="dark" />
        ) : (
          <Value
            value={Number(availableBorrows)}
            subValue={availableBorrowsInUSD}
            subSymbol="USD"
            maximumSubValueDecimals={2}
            minimumValueDecimals={2}
            maximumValueDecimals={3}
          />
        )}
      </TableColumn>

      {!isFreezed && (
        <TableColumn>
          <LiquidityMiningCard
            value={variableBorrowRate}
            thirtyDaysValue={avg30DaysVariableRate}
            liquidityMiningValue={rdntRewardsBorrowApr}
            symbol={symbol}
            type="borrow-variable"
          />
        </TableColumn>
      )}
    </TableItemBorrow>
  );
}
