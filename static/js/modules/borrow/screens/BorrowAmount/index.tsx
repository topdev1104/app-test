import { useState } from 'react';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { valueToBigNumber, BigNumber, InterestRate } from '@aave/protocol-js';

import NoDataPanel from '../../../../components/NoDataPanel';
import BasicForm from '../../../../components/forms/BasicForm';

import { useTxBuilderContext } from '../../../../libs/tx-provider';
import messages from './messages';

import routeParamValidationHOC, {
  ValidationWrapperComponentProps,
} from '../../../../components/RouteParamsValidationWrapper';
import { getAssetInfo } from '../../../../helpers/config/assets-config';

/**
 * @deprecated нужно удалить после добавления модалки
 */
enum BorrowStep {
  AmountForm,
  RateModeSelection,
}

interface BorrowAmountProps
  extends Pick<
    ValidationWrapperComponentProps,
    'userReserve' | 'poolReserve' | 'user' | 'currencySymbol' | 'history'
  > {}

function BorrowAmount({
  userReserve,
  poolReserve,
  user,
  currencySymbol,
  history,
}: BorrowAmountProps) {
  const [amountToBorrow, setAmountToBorrow] = useState('0');
  const [borrowStep, setBorrowStep] = useState<BorrowStep>(BorrowStep.AmountForm);
  const intl = useIntl();
  const { lendingPool } = useTxBuilderContext();

  const asset = getAssetInfo(currencySymbol);

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
    setAmountToBorrow(amount);
    const query = queryString.stringify({ rateMode: 'Variable', amount: amount });
    history.push(`${history.location.pathname}/confirmation?${query}`);
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

  return (
    <>
      {formattedMaxAmountToBorrow !== '0' ? (
        <>
          {borrowStep === BorrowStep.AmountForm && (
            <div className="FormWrapper">
              <div className="BorrowOverview__form">
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
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <NoDataPanel
          title={
            !user
              ? intl.formatMessage(messages.connectWallet)
              : poolReserve.availableLiquidity === '0'
              ? intl.formatMessage(messages.noLiquidityAvailableTitle)
              : !user || user.totalLiquidityMarketReferenceCurrency === '0'
              ? intl.formatMessage(messages.noDataTitle)
              : intl.formatMessage(messages.healthFactorTooLowTitle)
          }
          description={
            !user
              ? intl.formatMessage(messages.connectWalletDescription)
              : poolReserve.availableLiquidity === '0'
              ? intl.formatMessage(messages.noLiquidityAvailableDescription, {
                  symbol: asset.formattedName,
                })
              : !user || user.totalLiquidityMarketReferenceCurrency === '0'
              ? intl.formatMessage(messages.noDataDescription)
              : intl.formatMessage(messages.healthFactorTooLowDescription)
          }
          buttonTitle={!user ? undefined : intl.formatMessage(messages.noDataButtonTitle)}
          linkTo={!user ? undefined : `/deposit/${poolReserve.underlyingAsset}-${poolReserve.id}`}
          withConnectButton={!user}
        />
      )}

      <style jsx={true} global={true}>
        {`
          .BorrowOverview {
            &__form {
              background: #120d48;
              border-radius: 8px;
              padding: 12px;
              width: 100%;
            }
          }
          .FormWrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          }
          .BasicForm {
            margin: 0;
            max-width: none;
          }
          .Loop {
            margin-left: 19px;
          }
          .BasicForm,
          .Loop {
            width: 100%;
          }
          .AmountField__wrapper {
            background: #1c165b;
            border: 1px solid #493fb5;
            border-radius: 8px;
            margin-top: 24px;
          }

          .AmountField__maxButton {
            color: #a49fda;
          }

          .AmountField {
            width: 100%;
          }
          @media (max-width: 540px) {
            .Loop {
              margin-left: 0;
              margin-top: 16px;
            }
            .FormWrapper {
              display: flex;
              flex-direction: column;
            }
            .AmountField__wrapper {
              width: 100%;
            }

            .BasicForm {
              padding: 5px;
            }
          }
        `}
      </style>
    </>
  );
}

export default routeParamValidationHOC({})(BorrowAmount);
