import queryString from 'query-string';
import { valueToBigNumber, BigNumber } from '@aave/protocol-js';

import BasicForm from '../../../../components/forms/BasicForm';
import NoDataPanel from '../../../../components/NoDataPanel';
import routeParamValidationHOC, {
  ValidationWrapperComponentProps,
} from '../../../../components/RouteParamsValidationWrapper';
import { useTxBuilderContext } from '../../../../libs/tx-provider';
import staticStyles from './style';

function WithdrawAmount({
  currencySymbol,
  poolReserve,
  userReserve,
  user,
  history,
}: ValidationWrapperComponentProps) {
  const { lendingPool } = useTxBuilderContext();
  if (!user) {
    return (
      <NoDataPanel
        title="Please connect a wallet"
        description="We couldn’t detect a wallet. Connect a wallet to withdraw."
        withConnectButton={true}
      />
    );
  }

  if (!userReserve) {
    return null;
  }

  let maxUserAmountToWithdraw = BigNumber.min(
    userReserve.underlyingBalance,
    poolReserve.availableLiquidity
  ).toString(10);

  if (
    userReserve.usageAsCollateralEnabledOnUser &&
    poolReserve.usageAsCollateralEnabled &&
    user.totalBorrowsMarketReferenceCurrency !== '0'
  ) {
    // if we have any borrowings we should check how much we can withdraw without liquidation
    // with 0.5% gap to avoid reverting of tx
    let totalCollateralToWithdrawInETH = valueToBigNumber('0');
    const excessHF = valueToBigNumber(user.healthFactor).minus('1');
    if (excessHF.gt('0')) {
      totalCollateralToWithdrawInETH = excessHF
        .multipliedBy(user.totalBorrowsMarketReferenceCurrency)
        // because of the rounding issue on the contracts side this value still can be incorrect
        .div(Number(poolReserve.reserveLiquidationThreshold) + 0.01)
        .multipliedBy('0.99');
    }
    maxUserAmountToWithdraw = BigNumber.min(
      maxUserAmountToWithdraw,
      totalCollateralToWithdrawInETH.dividedBy(poolReserve.priceInMarketReferenceCurrency)
    ).toString();
  }
  maxUserAmountToWithdraw = BigNumber.max(maxUserAmountToWithdraw, 0).toString();

  const handleWithdrawSubmit = (amount: string, max?: boolean) => {
    const query = queryString.stringify({
      amount: max ? '-1' : amount,
    });
    history.push(`${history.location.pathname}/confirmation?${query}`);
  };

  const handleTransactionData = (userId: string) => async () => {
    return await lendingPool.withdraw({
      user: userId,
      reserve: poolReserve.underlyingAsset,
      amount: '-1',
      aTokenAddress: poolReserve.aTokenAddress,
    });
  };

  return (
    <div className="WithdrawAmount">
      <BasicForm
        title="Withdraw"
        description="How much do you want to withdraw?"
        maxAmount={maxUserAmountToWithdraw}
        currencySymbol={currencySymbol}
        onSubmit={handleWithdrawSubmit}
        amountFieldTitle="Available to withdraw"
        absoluteMaximum={true}
        maxDecimals={poolReserve.decimals}
        getTransactionData={handleTransactionData}
        poolReserve={poolReserve}
      />
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}

export default routeParamValidationHOC({
  withUserReserve: true,
})(WithdrawAmount);
