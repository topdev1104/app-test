import TableItem from '../../../../components/BasicAssetsTable/TableItem';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import Value from '../../../../components/basic/Value';
import LiquidityMiningCard from '../../../../components/liquidityMining/LiquidityMiningCard';
import NoData from '../../../../components/basic/NoData';

import { DepositTableItem } from './types';

export default function DepositItem({
  id,
  symbol,
  underlyingAsset,
  walletBalance,
  walletBalanceInUSD,
  liquidityRate,
  avg30DaysLiquidityRate,
  rdntRewardsDepositApr,
  userId,
  borrowingEnabled,
  isFreezed,
  aincentivesAPR,
  onClick,
}: DepositTableItem) {
  const url = `/deposit/${underlyingAsset}-${id}`;

  return (
    <TableItem symbol={symbol} isFreezed={isFreezed} darkOnDarkMode={true} onClick={onClick}>
      <TableColumn>
        {!userId || Number(walletBalance) <= 0 ? (
          <NoData color="dark" />
        ) : (
          <Value
            value={Number(walletBalance)}
            subValue={walletBalanceInUSD}
            maximumSubValueDecimals={2}
            subSymbol="USD"
            maximumValueDecimals={3}
            minimumValueDecimals={2}
          />
        )}
      </TableColumn>

      {!isFreezed && (
        <TableColumn>
          <LiquidityMiningCard
            value={liquidityRate}
            thirtyDaysValue={avg30DaysLiquidityRate}
            liquidityMiningValue={rdntRewardsDepositApr}
            symbol={symbol}
            type="deposit"
          />
        </TableColumn>
      )}
    </TableItem>
  );
}
