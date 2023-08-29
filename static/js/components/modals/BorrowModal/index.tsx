import { useIntl } from 'react-intl';
import {
  BasicModal,
  getAssetInfo,
  isAssetStable,
  useThemeContext,
} from '../../../libs/aave-ui-kit';
import queryString from 'query-string';
import {
  BigNumber,
  valueToBigNumber,
  InterestRate,
  calculateHealthFactorFromBalancesBigUnits,
} from '@aave/protocol-js';
import {
  UserSummary,
  useDynamicPoolDataContext,
  ComputedReserveData,
  useStaticPoolDataContext,
} from '../../../libs/pool-data-provider';
import { ComputedUserReserve } from '@aave/math-utils';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import messages from './messages';
import BasicForm from '../../forms/BasicForm';
import { useEffect, useMemo, useState } from 'react';
import BorrowCurrencyWrapper from '../../../modules/borrow/components/BorrowCurrencyWrapper';
import Borrow1ClickLoopForm from '../../Borrow1ClickLoopForm';
import NoDataPanel from '../../NoDataPanel';
import PoolTxConfirmationView from '../../PoolTxConfirmationView';
import Row from '../../basic/Row';
import Value from '../../basic/Value';
import ValuePercent from '../../basic/ValuePercent';
import HealthFactor from '../../HealthFactor';
import { getReferralCode } from '../../../libs/referral-handler';
import { getAtokenInfo } from '../../../helpers/get-atoken-info';
import ErrorPage from '../../ErrorPage';

enum BorrowStep {
  AmountForm,
  RateModeSelection,
}

enum Steps {
  amount = 'amount',
  confirmation = 'confirmation',
  finished = 'finished',
  approve = 'approve',
}

interface BorrowAmountProps {
  showModal: boolean;
  onBackdropPress: () => void;
  poolReserve: ComputedReserveData;
  userReserve?: ComputedUserReserve;
  user?: UserSummary;
  currencySymbol: string;
  history: any;
}

export default function BorrowModal({
  showModal,
  onBackdropPress,
  userReserve,
  poolReserve,
  user,
  currencySymbol,
  history,
}: BorrowAmountProps) {
  const [amountToBorrow, setAmountToBorrow] = useState<BigNumber>(BigNumber('0'));
  const intl = useIntl();
  const { lendingPool } = useTxBuilderContext();
  const [step, setStep] = useState<string>(Steps.amount);

  useEffect(() => {
    if (!showModal) {
      setStep(Steps.amount);
    }
  }, [showModal]);

  const maxUserAmountToBorrow = valueToBigNumber(
    user?.availableBorrowsMarketReferenceCurrency || 0
  ).div(poolReserve.priceInMarketReferenceCurrency);
  let maxAmountToBorrow = BigNumber.max(
    BigNumber.min(poolReserve.availableLiquidity, maxUserAmountToBorrow),
    0
  );
  if (
    maxAmountToBorrow.gt(0) &&
    user?.totalBorrowsMarketReferenceCurrency !== '0' &&
    maxUserAmountToBorrow.lt(valueToBigNumber(poolReserve.availableLiquidity).multipliedBy('1.01'))
  ) {
    maxAmountToBorrow = maxAmountToBorrow.multipliedBy('0.99');
  }
  const formattedMaxAmountToBorrow = maxAmountToBorrow.toString(10);

  const handleSetAmountSubmit = (amount: string) => {
    setAmountToBorrow(BigNumber(amount));
    setStep(Steps.confirmation);
    // const query = queryString.stringify({ rateMode: 'Variable', amount: amount });
    // history.push(`${history.location.pathname}/confirmation?${query}`);
  };

  const handleTransactionData = (userId: string) => async () => {
    const referralCode = undefined;
    return await lendingPool.borrow({
      interestRateMode: InterestRate.Variable,
      referralCode,
      user: userId,
      amount: formattedMaxAmountToBorrow,
      reserve: poolReserve.underlyingAsset,
      debtTokenAddress: poolReserve.variableDebtTokenAddress,
    });
  };

  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const { currentTheme } = useThemeContext();
  let blockingError = '';

  const aTokenData = getAtokenInfo({
    address: poolReserve.underlyingAsset,
    symbol: currencySymbol,
    decimals: poolReserve.decimals,
    withFormattedSymbol: true,
  });

  // lock values to not update them after tx was executed
  const [isTxExecuted, setIsTxExecuted] = useState(false);

  const interestRateMode = InterestRate.Variable;

  if (!user) {
    return (
      <NoDataPanel
        title={intl.formatMessage(messages.connectWallet)}
        description={intl.formatMessage(messages.connectWalletDescription)}
        withConnectButton={true}
      />
    );
  }

  const currentStableBorrowRate =
    userReserve && userReserve.stableBorrows !== '0' && poolReserve.stableBorrowAPY;
  const newBorrowRate =
    interestRateMode === InterestRate.Variable
      ? poolReserve.variableBorrowAPY
      : poolReserve.stableBorrowAPY;

  if (!interestRateMode || !amountToBorrow) {
    return (
      <ErrorPage
        description={intl.formatMessage(messages.errorPageDescription)}
        buttonType="back"
      />
    );
  }

  let userAvailableAmountToBorrow = valueToBigNumber(
    user.availableBorrowsMarketReferenceCurrency
  ).div(poolReserve.priceInMarketReferenceCurrency);

  if (
    userAvailableAmountToBorrow.gt(0) &&
    user?.totalBorrowsMarketReferenceCurrency !== '0' &&
    userAvailableAmountToBorrow.lt(
      valueToBigNumber(poolReserve.availableLiquidity).multipliedBy('1.01')
    )
  ) {
    userAvailableAmountToBorrow = userAvailableAmountToBorrow.multipliedBy('0.995');
  }

  if (amountToBorrow.gt(poolReserve.availableLiquidity)) {
    blockingError = intl.formatMessage(messages.errorNotEnoughLiquidity, {
      currencySymbol,
    });
  }
  if (userAvailableAmountToBorrow.lt(amountToBorrow)) {
    blockingError = intl.formatMessage(messages.errorNotEnoughCollateral);
  }
  if (!poolReserve.borrowingEnabled) {
    blockingError = intl.formatMessage(messages.errorBorrowingNotAvailable);
  }

  const amountToBorrowInUsd = amountToBorrow
    .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
    .multipliedBy(marketRefPriceInUsd);

  const newHealthFactor = calculateHealthFactorFromBalancesBigUnits(
    user.totalCollateralUSD,
    valueToBigNumber(user.totalBorrowsUSD).plus(amountToBorrowInUsd),
    user.currentLiquidationThreshold
  );

  const handleGetTransactions = async () => {
    const referralCode = getReferralCode() || undefined;
    return await lendingPool.borrow({
      interestRateMode,
      referralCode,
      user: user.id,
      amount: amountToBorrow.toString(),
      reserve: poolReserve.underlyingAsset,
      debtTokenAddress:
        interestRateMode === InterestRate.Variable
          ? poolReserve.variableDebtTokenAddress
          : poolReserve.stableDebtTokenAddress,
    });
  };

  const handleMainTxExecuted = () => setIsTxExecuted(true);

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
            title={intl.formatMessage(messages.title)}
            description={intl.formatMessage(messages.description)}
            maxAmount={formattedMaxAmountToBorrow}
            currencySymbol={currencySymbol}
            onSubmit={handleSetAmountSubmit}
            amountFieldTitle={intl.formatMessage(messages.amountTitle)}
            withRiskBar={true}
            maxDecimals={poolReserve.decimals}
            getTransactionData={handleTransactionData}
            poolReserve={poolReserve}
            balanceTitle="Available to borrow"
          />
        )}

        {step === Steps.confirmation && (
          <PoolTxConfirmationView
            mainTxName={'Borrow'}
            caption={'Borrow overview'}
            boxTitle={'Borrow'}
            boxDescription={'Please submit to borrow'}
            approveDescription={'Please approve before borrowing'}
            getTransactionsData={handleGetTransactions}
            onMainTxExecuted={handleMainTxExecuted}
            blockingError={blockingError}
            goToAfterSuccess="/dashboard/borrowings"
            className="BorrowConfirmation"
            aTokenData={aTokenData}
          >
            <Row title={'Amount'} withMargin={true}>
              <Value
                symbol={currencySymbol}
                value={amountToBorrow.toString()}
                tokenIcon={true}
                subValue={amountToBorrowInUsd.toString()}
                subSymbol="USD"
                tooltipId={currencySymbol}
              />
            </Row>

            {currentStableBorrowRate && (
              <Row
                title={intl.formatMessage(messages.currentBorrowRateTitle, {
                  borrowRateMode: 'Stable'.toLowerCase(),
                })}
                withMargin={true}
              >
                <ValuePercent
                  value={currentStableBorrowRate}
                  color="dark"
                  updateCondition={isTxExecuted}
                />
              </Row>
            )}

            <Row title={intl.formatMessage(messages.APYRowTitle)} withMargin={true}>
              <ValuePercent value={newBorrowRate} color="dark" updateCondition={isTxExecuted} />
            </Row>

            <Row title={intl.formatMessage(messages.rateTypeRowTitle)} withMargin={true}>
              <strong className="BorrowRateMode">
                {interestRateMode === InterestRate.Variable
                  ? intl.formatMessage(messages.variable)
                  : intl.formatMessage(messages.stable)}
              </strong>
            </Row>

            <HealthFactor
              value={newHealthFactor.toString()}
              title={intl.formatMessage(messages.healthFactorRowTitle)}
              updateCondition={isTxExecuted}
              withoutModal={true}
            />

            <style jsx={true} global={true}>{`
              .BorrowRateMode {
                color: ${currentTheme.textDarkBlue.hex};
              }
            `}</style>
          </PoolTxConfirmationView>
        )}
      </BasicModal>
    </>
  );
}
