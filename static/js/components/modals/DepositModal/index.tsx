import { useIntl } from 'react-intl';
import { BasicModal, getAssetInfo } from '../../../libs/aave-ui-kit';
import {
  BigNumber,
  calculateHealthFactorFromBalancesBigUnits,
  valueToBigNumber,
} from '@aave/protocol-js';
import {
  ComputedReserveData,
  useDynamicPoolDataContext,
  useStaticPoolDataContext,
} from '../../../libs/pool-data-provider';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import messages from './messages';

import BasicForm from '../../forms/BasicForm';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import { useWalletBalanceProviderContext } from '../../../libs/wallet-balance-provider/WalletBalanceProvider';
import { useEffect, useMemo, useState } from 'react';
import PoolTxConfirmationView from '../../PoolTxConfirmationView';
import Row from '../../basic/Row';
import Value from '../../basic/Value';
import HealthFactor from '../../HealthFactor';
import { getAtokenInfo } from '../../../helpers/get-atoken-info';
import NoDataPanel from '../../NoDataPanel';
import { getReferralCode } from '../../../libs/referral-handler';

enum Steps {
  amount = 'amount',
  confirmation = 'confirmation',
  finished = 'finished',
  approve = 'approve',
}

interface DepositModalProps {
  showModal: boolean;
  onBackdropPress: () => void;
  currencySymbol: string;
  poolReserve: ComputedReserveData;
  history: any;
}

export default function DepositModal({
  showModal,
  onBackdropPress,
  currencySymbol,
  poolReserve,
  history,
}: DepositModalProps) {
  const intl = useIntl();
  const { networkConfig, currentMarketData } = useProtocolDataContext();
  const { lendingPool } = useTxBuilderContext();
  const { walletData } = useWalletBalanceProviderContext();
  const [step, setStep] = useState<string>(Steps.amount);
  const [amount, setAmount] = useState<BigNumber>(BigNumber(0));
  const { user } = useDynamicPoolDataContext();

  useEffect(() => {
    if (!showModal) {
      setStep(Steps.amount);
    }
  }, [showModal]);

  const walletBalance = useMemo(() => {
    const maxWalletBalance =
      walletData[poolReserve.underlyingAsset] === '0'
        ? valueToBigNumber('0')
        : valueToBigNumber(walletData[poolReserve.underlyingAsset] || '0').dividedBy(
            valueToBigNumber('10').pow(poolReserve.decimals)
          );

    return maxWalletBalance.toString(10);
  }, [walletData, poolReserve]);

  let maxAmountToDeposit = valueToBigNumber(walletBalance);
  if (maxAmountToDeposit.gt(0) && poolReserve.symbol.toUpperCase() === networkConfig.baseAsset) {
    // keep it for tx gas cost
    maxAmountToDeposit = maxAmountToDeposit.minus('0.001');
  }
  if (maxAmountToDeposit.lte(0)) {
    maxAmountToDeposit = valueToBigNumber('0');
  }

  const handleSubmit = (amount: string) => {
    setAmount(BigNumber(amount));
    setStep(Steps.confirmation);
    // const query = queryString.stringify({ amount });
    // history.push(`${history.location.pathname}/confirmation?${query}`);
  };

  const handleTransactionData = (userId: string) => async () => {
    return await lendingPool.deposit({
      user: userId,
      reserve: poolReserve.underlyingAsset,
      amount: maxAmountToDeposit.toString(10),
      referralCode: undefined,
    });
  };

  const userReserve = user?.userReservesData.find((userReserve) => {
    return userReserve.reserve.symbol.toUpperCase() === poolReserve.symbol.toUpperCase();
  });

  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const aTokenData = getAtokenInfo({
    address: poolReserve.aTokenAddress,
    symbol: currencySymbol,
    decimals: poolReserve.decimals,
  });
  const assetDetails = getAssetInfo(poolReserve.symbol);

  if (!user) {
    return (
      <NoDataPanel
        title={'Please connect a wallet'}
        description={
          'We couldn’t detect a wallet. Connect a wallet to deposit and see your balance grow.'
        }
        withConnectButton={true}
      />
    );
  }

  let blockingError = '';
  if (BigNumber(walletBalance).lt(amount)) {
    blockingError = intl.formatMessage(messages.errorWalletBalanceNotEnough, {
      poolReserveSymbol: assetDetails.formattedSymbol || assetDetails.symbol,
    });
  }

  const amountIntEth = amount.multipliedBy(poolReserve.priceInMarketReferenceCurrency);
  const amountInUsd = amountIntEth.multipliedBy(marketRefPriceInUsd);
  const totalCollateralMarketReferenceCurrencyAfter = valueToBigNumber(
    user.totalCollateralMarketReferenceCurrency
  ).plus(amountIntEth);

  const liquidationThresholdAfter = valueToBigNumber(user.totalCollateralMarketReferenceCurrency)
    .multipliedBy(user.currentLiquidationThreshold)
    .plus(amountIntEth.multipliedBy(poolReserve.reserveLiquidationThreshold))
    .dividedBy(totalCollateralMarketReferenceCurrencyAfter);

  const healthFactorAfterDeposit = calculateHealthFactorFromBalancesBigUnits(
    totalCollateralMarketReferenceCurrencyAfter,
    valueToBigNumber(user.totalBorrowsMarketReferenceCurrency),
    liquidationThresholdAfter
  );

  const handleGetTransactions = async () => {
    return lendingPool.deposit({
      user: user.id,
      reserve: poolReserve.underlyingAsset,
      amount: amount.toString(),
      referralCode: getReferralCode(),
    });
  };

  const notShowHealthFactor =
    user.totalBorrowsMarketReferenceCurrency !== '0' && poolReserve.usageAsCollateralEnabled;

  const usageAsCollateralEnabledOnDeposit =
    poolReserve.usageAsCollateralEnabled &&
    (!userReserve?.underlyingBalance ||
      userReserve.underlyingBalance === '0' ||
      userReserve.usageAsCollateralEnabledOnUser);

  return (
    <>
      <BasicModal
        className="AddressModal"
        isVisible={showModal}
        onBackdropPress={onBackdropPress}
        withCloseButton={true}
      >
        {step === Steps.amount && (
          <div className="DepositOverview__form">
            <BasicForm
              title="Deposit overview"
              description="These are your transaction details/ Make sure to check if this is correct before submitting"
              amountFieldTitle="Available to deposit"
              maxAmount={maxAmountToDeposit.toString(10)}
              currencySymbol={currencySymbol}
              onSubmit={handleSubmit}
              maxDecimals={poolReserve.decimals}
              getTransactionData={handleTransactionData}
              poolReserve={poolReserve}
            />
          </div>
        )}

        {step === Steps.confirmation && (
          <PoolTxConfirmationView
            mainTxName={'Deposit'}
            caption={'Deposit overview'}
            boxTitle={'Deposit'}
            boxDescription={'Please submit to deposit'}
            approveDescription={'Please approve before depositing'}
            getTransactionsData={handleGetTransactions}
            blockingError={blockingError}
            aTokenData={aTokenData}
          >
            <Row title={'Amount'} withMargin={notShowHealthFactor}>
              <Value
                symbol={currencySymbol}
                value={amount.toString()}
                tokenIcon={true}
                subValue={amountInUsd.toString()}
                subSymbol="USD"
                tooltipId={currencySymbol}
              />
            </Row>

            <Row title={'Collateral Usage'} withMargin={notShowHealthFactor}>
              <strong
                style={{
                  color: usageAsCollateralEnabledOnDeposit ? 'green' : 'red',
                }}
                className="Collateral__text"
              >
                {usageAsCollateralEnabledOnDeposit ? 'Yes' : 'No'}
              </strong>
            </Row>

            {notShowHealthFactor && (
              <HealthFactor
                title={'New health factor'}
                withoutModal={true}
                value={healthFactorAfterDeposit.toString()}
              />
            )}
          </PoolTxConfirmationView>
        )}
      </BasicModal>
    </>
  );
}
