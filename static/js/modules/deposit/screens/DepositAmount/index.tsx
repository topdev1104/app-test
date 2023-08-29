import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { valueToBigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

import { useTxBuilderContext } from '../../../../libs/tx-provider';
import { usePayments } from '../../../../helpers/payments';
import { getLPTokenPoolLink } from '../../../../helpers/lp-tokens';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import NoDataPanel from '../../../../components/NoDataPanel';
import DefaultButton from '../../../../components/basic/DefaultButton';
import BasicForm from '../../../../components/forms/BasicForm';
import PaymentsPanel from '../../components/PaymentsPanel';
import Link from '../../../../components/basic/Link';
import DepositCurrencyWrapper from '../../components/DepositCurrencyWrapper';
import routeParamValidationHOC, {
  ValidationWrapperComponentProps,
} from '../../../../components/RouteParamsValidationWrapper';

import messages from './messages';

import linkIcon from '../../../../images/whiteLinkIcon.svg';
import { getAssetInfo, isAssetStable } from '../../../../helpers/config/assets-config';
import Borrow1ClickLoopForm from '../../../../components/Borrow1ClickLoopForm';
import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';

interface DepositAmountProps
  extends Pick<
    ValidationWrapperComponentProps,
    'currencySymbol' | 'poolReserve' | 'history' | 'walletBalance' | 'user' | 'userReserve'
  > {}

function DepositAmount({
  currencySymbol,
  poolReserve,
  user,
  userReserve,
  history,
  walletBalance,
}: DepositAmountProps) {
  const intl = useIntl();
  const { networkConfig, currentMarketData } = useProtocolDataContext();
  const { lendingPool } = useTxBuilderContext();
  const { payments, isPaymentNashNotOnMainMarket } = usePayments();
  const { sm } = useThemeContext();
  const { reserves } = useDynamicPoolDataContext();
  const [reserveId, setReserveId] = useState<string>('');

  const asset = getAssetInfo(currencySymbol);

  const stableReserves = useMemo(
    () =>
      reserves.filter(
        ({ symbol, borrowingEnabled, isActive }) =>
          borrowingEnabled && isActive && isAssetStable(symbol)
      ),
    [reserves]
  );

  let maxAmountToDeposit = valueToBigNumber(walletBalance);
  if (maxAmountToDeposit.gt(0) && poolReserve.symbol.toUpperCase() === networkConfig.baseAsset) {
    // keep it for tx gas cost
    maxAmountToDeposit = maxAmountToDeposit.minus('0.001');
  }
  if (maxAmountToDeposit.lte(0)) {
    maxAmountToDeposit = valueToBigNumber('0');
  }

  const handleSubmit = (amount: string) => {
    const query = queryString.stringify({ amount });
    history.push(`${history.location.pathname}/confirmation?${query}`);
  };

  const handleTransactionData = (userId: string) => async () => {
    return await lendingPool.deposit({
      user: userId,
      reserve: poolReserve.underlyingAsset,
      amount: maxAmountToDeposit.toString(10),
      referralCode: undefined,
    });
  };

  const lpPoolLink = getLPTokenPoolLink(poolReserve);

  return (
    <>
      {!maxAmountToDeposit.eq('0') && (
        <div className="FormWrapper">
          <div className="DepositOverview__form">
            <BasicForm
              title="Deposit overview"
              description="These are your transaction details/ Make sure to check if this is correct before submitting"
              amountFieldTitle={intl.formatMessage(messages.amountTitle)}
              maxAmount={maxAmountToDeposit.toString(10)}
              currencySymbol={currencySymbol}
              onSubmit={handleSubmit}
              maxDecimals={poolReserve.decimals}
              getTransactionData={handleTransactionData}
              poolReserve={poolReserve}
            />
          </div>
        </div>
      )}

      {maxAmountToDeposit.eq('0') && user && lpPoolLink && (
        <NoDataPanel
          title={intl.formatMessage(messages.noDataTitle)}
          description={intl.formatMessage(messages.noDataLPTokenDescription, {
            currencySymbol: asset.formattedName,
          })}
        >
          <Link to={lpPoolLink} absolute={true} inNewWindow={true} className="ButtonLink">
            <DefaultButton
              className="DepositAmount__poolLink--button"
              title={intl.formatMessage(messages.viewPool)}
              iconComponent={<img src={linkIcon} alt="" />}
              size="medium"
              mobileBig={true}
            />
          </Link>
        </NoDataPanel>
      )}

      {user &&
        sm &&
        payments.some(
          (payment) =>
            payment.availableAssets?.includes(currencySymbol.toUpperCase()) &&
            !isPaymentNashNotOnMainMarket(payment.name)
        ) && (
          <PaymentsPanel
            currencySymbol={currencySymbol}
            withoutOrTitle={maxAmountToDeposit.eq('0')}
          />
        )}

      <style jsx={true} global={true}>
        {`
          .DepositOverview {
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
              padding: 0;
            }
          }
        `}
      </style>
    </>
  );
}

export default routeParamValidationHOC({
  withWalletBalance: true,
})(DepositAmount);
