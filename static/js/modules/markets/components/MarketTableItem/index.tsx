import { useHistory } from 'react-router-dom';
import TableItemWrapper from '../../../../components/BasicTable/TableItemWrapper';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import Value from '../../../../components/basic/Value';
import FreezedWarning from '../../../../components/FreezedWarning';
import NoData from '../../../../components/basic/NoData';
import LiquidityMiningCard from '../../../../components/liquidityMining/LiquidityMiningCard';
import { getAssetInfo, TokenIcon } from '../../../../helpers/config/assets-config';

import staticStyles from './style';
import { BigNumberValue } from '@aave/math-utils';
export interface MarketTableItemProps {
  id: string;
  underlyingAsset: string;
  currencySymbol: string;
  totalLiquidity: number;
  totalLiquidityInUSD: number;
  totalBorrows: number;
  totalBorrowsInUSD: number;
  depositAPY: number;
  avg30DaysLiquidityRate: number;
  stableBorrowRate: number;
  variableBorrowRate: number;
  avg30DaysVariableRate: number;
  borrowingEnabled?: boolean;
  stableBorrowRateEnabled?: boolean;
  isFreezed?: boolean;
  isPriceInUSD?: boolean;
  rdntRewardsDepositApr?: number;
  rdntRewardsBorrowApr?: number;
  isStable?: boolean;
  loopAPY: BigNumberValue;
  maxCap?: number;
}

export default function MarketTableItem({
  id,
  underlyingAsset,
  currencySymbol,
  totalLiquidity,
  totalLiquidityInUSD,
  totalBorrows,
  totalBorrowsInUSD,
  depositAPY,
  // aincentivesAPR,
  // vincentivesAPR,
  // sincentivesAPR,
  avg30DaysLiquidityRate,
  stableBorrowRate,
  variableBorrowRate,
  avg30DaysVariableRate,
  borrowingEnabled,
  stableBorrowRateEnabled,
  isFreezed,
  isPriceInUSD,
  rdntRewardsDepositApr,
  rdntRewardsBorrowApr,
  isStable,
  loopAPY,
  maxCap,
}: MarketTableItemProps) {
  const history = useHistory();

  const asset = getAssetInfo(currencySymbol);

  const handleClick = () => {
    history.push(`/reserve-overview/${underlyingAsset}-${id}`);
  };

  return (
    <TableItemWrapper onClick={handleClick} className="MarketTableItem" withGoToTop={true}>
      <TableColumn className="MarketTableItem__column">
        <TokenIcon
          tokenSymbol={currencySymbol}
          height={35}
          width={35}
          tokenFullName={asset.name}
          className="MarketTableItem__token"
        />
      </TableColumn>
      <TableColumn className="MarketTableItem__column">
        {maxCap !== 0 && <span>{maxCap}</span>}

        <Value
          value={isPriceInUSD ? totalLiquidityInUSD : totalLiquidity}
          compact={true}
          maximumValueDecimals={2}
          withoutSymbol={true}
          tooltipId={`market-size-${asset.symbol}`}
          symbol={isPriceInUSD ? 'USD' : ''}
          tokenIcon={isPriceInUSD}
          className="MarketTableItem__value"
        />
      </TableColumn>
      <TableColumn className="MarketTableItem__column">
        {borrowingEnabled ? (
          <Value
            value={isPriceInUSD ? totalBorrowsInUSD : totalBorrows}
            compact={true}
            maximumValueDecimals={2}
            className="MarketTableItem__value"
            withoutSymbol={true}
            symbol={isPriceInUSD ? 'USD' : ''}
            tokenIcon={isPriceInUSD}
            tooltipId={`borrows-size-${asset.symbol}`}
          />
        ) : (
          <NoData color="dark" />
        )}
      </TableColumn>

      {!isFreezed && (
        <>
          <TableColumn className="MarketTableItem__column">
            <LiquidityMiningCard
              value={depositAPY}
              thirtyDaysValue={avg30DaysLiquidityRate}
              liquidityMiningValue={rdntRewardsDepositApr}
              symbol={currencySymbol === 'SIFU_OLD' ? 'sifu' : currencySymbol}
              type="deposit"
              showUwUIcon={true}
            />
          </TableColumn>

          <TableColumn className="MarketTableItem__column">
            {borrowingEnabled && +variableBorrowRate >= 0 ? (
              <LiquidityMiningCard
                value={variableBorrowRate}
                thirtyDaysValue={avg30DaysVariableRate}
                liquidityMiningValue={rdntRewardsBorrowApr}
                symbol={currencySymbol === 'SIFU_OLD' ? 'sifu' : currencySymbol}
                type="borrow-variable"
                showUwUIcon={true}
              />
            ) : (
              <NoData color="dark" />
            )}
          </TableColumn>
        </>
      )}

      {isFreezed && (
        <>
          <div />
          <div className="MarketTableItem__isFreezed-inner">
            <FreezedWarning symbol={currencySymbol === 'SIFU_OLD' ? 'sifu' : currencySymbol} />
          </div>
        </>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </TableItemWrapper>
  );
}
