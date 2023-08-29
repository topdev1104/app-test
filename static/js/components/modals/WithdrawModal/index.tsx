import { useIntl } from 'react-intl';
import { BasicModal } from '../../../libs/aave-ui-kit';
import queryString from 'query-string';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import { ComputedReserveData, UserSummary } from '../../../libs/pool-data-provider';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import defaultMessages from '../../../defaultMessages';
import messages from './messages';

import BasicForm from '../../forms/BasicForm';
import NoDataPanel from '../../NoDataPanel';
import { ComputedUserReserve } from '@aave/math-utils';
import WithdrawConfirmationModal from './confirmation';
import { useState } from 'react';

interface WithdrawModalProps {
  showModal: boolean;
  onBackdropPress: () => void;
  currencySymbol: string;
  poolReserve: ComputedReserveData;
  history: any;
  userReserve?: ComputedUserReserve;
  user?: UserSummary;
}

export default function WithdrawModal({
  showModal,
  onBackdropPress,
  currencySymbol,
  poolReserve,
  history,
  userReserve,
  user,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState<BigNumber>(new BigNumber('-1'));
  const [showConfirmationModal, setConfirmationModal] = useState<boolean>(false);
  const intl = useIntl();
  const { lendingPool } = useTxBuilderContext();

  if (!user) {
    return (
      <NoDataPanel
        title={intl.formatMessage(messages.connectWallet)}
        description={intl.formatMessage(messages.connectWalletDescription)}
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
    // maxUserAmountToWithdraw = BigNumber.min(
    //   maxUserAmountToWithdraw,
    //   totalCollateralToWithdrawInETH.dividedBy(poolReserve.priceInMarketReferenceCurrency)
    // ).toString();
  }
  maxUserAmountToWithdraw = BigNumber.max(maxUserAmountToWithdraw, 0).toString();

  const handleWithdrawSubmit = (amount: string, max?: boolean) => {
    // const query = queryString.stringify({
    //   amount: max ? '-1' : amount,
    // });
    const _amount = new BigNumber(max ? '-1' : amount);
    setAmount(_amount);
    setConfirmationModal(true);
    //history.push(`${history.location.pathname}/confirmation?${query}`);
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
    <>
      <BasicModal
        className="AddressModal"
        isVisible={showModal}
        onBackdropPress={onBackdropPress}
        withCloseButton={true}
      >
        <div style={{ width: '100%' }}>
          <BasicForm
            balanceTitle="Available"
            title={intl.formatMessage(defaultMessages.withdraw)}
            description={intl.formatMessage(messages.formDescription)}
            maxAmount={maxUserAmountToWithdraw}
            currencySymbol={currencySymbol}
            onSubmit={handleWithdrawSubmit}
            amountFieldTitle={intl.formatMessage(messages.amountTitle)}
            absoluteMaximum={true}
            maxDecimals={poolReserve.decimals}
            getTransactionData={handleTransactionData}
            poolReserve={poolReserve}
          />
        </div>
      </BasicModal>

      <WithdrawConfirmationModal
        history={history}
        currencySymbol={currencySymbol}
        userReserve={userReserve}
        poolReserve={poolReserve}
        amount={amount}
        user={user}
        showModal={showConfirmationModal}
        onBackdropPress={() => setConfirmationModal(false)}
      />
    </>
  );
}
