import { useIntl } from 'react-intl';
import { BasicModal, getAssetInfo, isAssetStable } from '../../../libs/aave-ui-kit';
import queryString from 'query-string';
import {
  BigNumber,
  calculateHealthFactorFromBalancesBigUnits,
  InterestRate,
  valueToBigNumber,
} from '@aave/protocol-js';
import {
  ComputedReserveData,
  useDynamicPoolDataContext,
  UserSummary,
  useStaticPoolDataContext,
} from '../../../libs/pool-data-provider';
import { ComputedUserReserve } from '@aave/math-utils';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import messages from './messages';
import BasicForm from '../../forms/BasicForm';

import { RouteComponentProps } from 'react-router-dom';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import { useEffect, useMemo, useState } from 'react';
import HealthFactor from '../../HealthFactor';
import Value from '../../basic/Value';
import Row from '../../basic/Row';
import NotHaveEnoughFundsToRepayHelpModal from '../../HelpModal/NotHaveEnoughFundsToRepayHelpModal';
import PoolTxConfirmationView from '../../PoolTxConfirmationView';
import NoDataPanel from '../../NoDataPanel';
import { useWalletBalanceProviderContext } from '../../../libs/wallet-balance-provider/WalletBalanceProvider';

interface RepayModalProps extends Pick<RouteComponentProps, 'history' | 'location'> {
  showModal: boolean;
  onBackdropPress: () => void;
  currencySymbol: string;
  amount?: BigNumber;
  walletBalance: BigNumber;
  user?: UserSummary;
  poolReserve: ComputedReserveData;
  userReserve?: ComputedUserReserve;
}

enum Steps {
  amount = 'amount',
  confirmation = 'confirmation',
  finished = 'finished',
  approve = 'approve',
}

export default function RepayModal({
  showModal,
  onBackdropPress,
  currencySymbol,
  userReserve,
  poolReserve,
  walletBalance,
  history,
  location,
}: RepayModalProps) {
  const intl = useIntl();
  const { walletData } = useWalletBalanceProviderContext();
  const { networkConfig } = useProtocolDataContext();
  const { lendingPool } = useTxBuilderContext();
  const [step, setStep] = useState<string>(Steps.amount);
  const [amount, setAmount] = useState<BigNumber>(BigNumber('0'));

  const query = queryString.parse(location.search);
  const debtType = query.debtType || InterestRate.Variable;
  BigNumber.config({ EXPONENTIAL_AT: 40 });

  useEffect(() => {
    if (!showModal) {
      setStep(Steps.amount);
    }
  }, [showModal]);

  if (!userReserve) {
    throw new Error(intl.formatMessage(messages.error));
  }

  const userTokensBalance: BigNumber = useMemo((): BigNumber => {
    return walletData[poolReserve.underlyingAsset] === '0'
      ? valueToBigNumber('0')
      : valueToBigNumber(walletData[poolReserve.underlyingAsset] || '0').dividedBy(
          valueToBigNumber('10').pow(poolReserve.decimals)
        );
  }, [walletData, poolReserve]);

  const borrowed: BigNumber = BigNumber(
    debtType === InterestRate.Stable ? userReserve.stableBorrows : userReserve.variableBorrows
  );

  const maxAmountToRepay: BigNumber = userTokensBalance.gte(borrowed)
    ? borrowed
    : userTokensBalance;

  const _walletBalance = BigNumber(maxAmountToRepay);

  const handleSubmit = (amount: string, max?: boolean) => {
    setAmount(BigNumber(amount));
    setStep(Steps.confirmation);
  };

  const { reserves, user } = useDynamicPoolDataContext();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const [isTxExecuted, setIsTxExecuted] = useState(false);
  const assetDetails = getAssetInfo(poolReserve.symbol);

  if (!user) {
    return (
      <NoDataPanel
        title={'Please connect a wallet'}
        description={'We couldn’t detect a wallet. Connect a wallet to repay.'}
        withConnectButton={true}
      />
    );
  }

  if (!amount.toString() || !userReserve) {
    return null;
  }

  const safeAmountToRepayAll = BigNumber(maxAmountToRepay).multipliedBy('1.0025');

  let amountToRepay = amount.toString();
  let amountToRepayUI = amount;

  if (amountToRepay === '-1') {
    amountToRepayUI = BigNumber.min(walletBalance, safeAmountToRepayAll);
    if (
      userReserve.reserve.symbol.toUpperCase() === networkConfig.baseAsset ||
      walletBalance.eq(amountToRepayUI)
    ) {
      amountToRepay = BigNumber.min(walletBalance, safeAmountToRepayAll).toString();
    }
  }

  const displayAmountToRepay = BigNumber.min(amountToRepayUI, maxAmountToRepay);
  const displayAmountToRepayInUsd = displayAmountToRepay
    .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd);

  const amountAfterRepay = maxAmountToRepay.minus(amountToRepayUI).toString();
  const displayAmountAfterRepay = BigNumber.min(amountAfterRepay, maxAmountToRepay);
  const displayAmountAfterRepayInUsd = displayAmountAfterRepay
    .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd);

  const healthFactorAfterRepay = calculateHealthFactorFromBalancesBigUnits(
    user.totalCollateralUSD,
    BigNumber(user.totalBorrowsUSD).minus(displayAmountToRepayInUsd.toNumber()),
    user.currentLiquidationThreshold
  );

  const handleGetTransactions = (userId: string) => async () =>
    await lendingPool.repay({
      user: userId,
      reserve: poolReserve.underlyingAsset,
      amount: amountToRepay.toString(),
      interestRateMode: debtType as InterestRate,
    });

  const handleMainTxExecuted = () => setIsTxExecuted(true);

  const blockingError =
    _walletBalance.eq('0') || _walletBalance.lt(amountToRepay)
      ? intl.formatMessage(messages.error, {
          userReserveSymbol: assetDetails.formattedSymbol || assetDetails.symbol,
        })
      : '';

  const warningMessage =
    amount.eq('-1') &&
    amountToRepayUI.gte(maxAmountToRepay) &&
    !amountToRepayUI.gte(safeAmountToRepayAll)
      ? 'Mind that due to the continuous accumulation of interest, a small amount could be remaining, as your wallet balance is just above the current amount pending to repay'
      : '';

  const isNotHaveEnoughFunds =
    amountToRepay.toString() === '-1' && _walletBalance.lt(maxAmountToRepay);

  const handleConfirmGetTransactions = async () =>
    await lendingPool.repay({
      user: user.id,
      reserve: poolReserve.underlyingAsset,
      amount: amountToRepay.toString(),
      interestRateMode: InterestRate.Variable,
    });

  return (
    <>
      <BasicModal
        className="AddressModal"
        isVisible={showModal}
        onBackdropPress={onBackdropPress}
        withCloseButton={true}
      >
        {step === Steps.amount && (
          <BasicForm
            isRepay
            title="Repay"
            maxButtonValue={borrowed.toString(10)}
            userTokensBalance={userTokensBalance}
            balanceTitle="Borrowed"
            description="How much do you want to repay?"
            maxAmount={maxAmountToRepay.toString(10)}
            amountFieldTitle={intl.formatMessage(messages.amountTitle)}
            currencySymbol={currencySymbol}
            onSubmit={handleSubmit}
            absoluteMaximum={true}
            maxDecimals={poolReserve.decimals}
            getTransactionData={handleGetTransactions}
            poolReserve={poolReserve}
          />
        )}

        {step === Steps.confirmation && (
          <PoolTxConfirmationView
            mainTxName={'Repay'}
            caption={'Repay overview'}
            boxTitle={'Repay'}
            boxDescription={'Please submit to repay'}
            approveDescription={'Please approve before repaying'}
            getTransactionsData={handleConfirmGetTransactions}
            onMainTxExecuted={handleMainTxExecuted}
            blockingError={blockingError}
            goToAfterSuccess="/dashboard/borrowings"
            warningMessage={warningMessage}
          >
            <Row title={'Amount to repay'} withMargin={true}>
              <Value
                symbol={currencySymbol}
                value={displayAmountToRepay.toString()}
                tokenIcon={true}
                subValue={displayAmountToRepayInUsd.toString()}
                subSymbol="USD"
                maximumValueDecimals={isAssetStable(currencySymbol) ? 4 : 12}
                maximumSubValueDecimals={4}
                updateCondition={isTxExecuted}
                tooltipId={poolReserve.underlyingAsset}
              />
            </Row>

            <Row
              title={'Remaining to repay'}
              subTitle={
                isNotHaveEnoughFunds && (
                  <NotHaveEnoughFundsToRepayHelpModal
                    text={'You don’t have enough funds to repay the full amount'}
                  />
                )
              }
              withMargin={true}
            >
              <Value
                symbol={currencySymbol}
                value={Number(displayAmountAfterRepay) > 0 ? Number(displayAmountAfterRepay) : 0}
                subValue={
                  Number(displayAmountAfterRepayInUsd) > 0
                    ? Number(displayAmountAfterRepayInUsd)
                    : 0
                }
                subSymbol="USD"
                maximumSubValueDecimals={4}
                tokenIcon={true}
                maximumValueDecimals={
                  isNotHaveEnoughFunds ? 14 : isAssetStable(currencySymbol) ? 4 : 12
                }
                updateCondition={isTxExecuted}
                tooltipId={poolReserve.id}
                withSmallDecimals={isNotHaveEnoughFunds}
                isSmallValueCenterEllipsis={isNotHaveEnoughFunds}
              />
            </Row>

            <HealthFactor
              title={'Current Health Factor'}
              value={user.healthFactor}
              updateCondition={isTxExecuted}
              titleColor="dark"
            />

            <HealthFactor
              value={healthFactorAfterRepay.toString()}
              title={'Next Health Factor'}
              withoutModal={true}
              updateCondition={isTxExecuted}
              titleColor="dark"
            />
          </PoolTxConfirmationView>
        )}
      </BasicModal>

      <style jsx={true} global={true}>
        {`
          .BasicForm {
            width: 100%;
          }
        `}
      </style>
    </>
  );
}
