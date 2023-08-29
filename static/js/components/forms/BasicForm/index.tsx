import { FormEvent, ReactNode, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { valueToBigNumber, EthereumTransactionTypeExtended } from '@aave/protocol-js';

import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import Caption from '../../basic/Caption';
import AmountField from '../../fields/AmountField';
import RiskBar from '../../basic/RiskBar';
import DefaultButton from '../../basic/DefaultButton';
import ConnectButton from '../../ConnectButton';
import messages from './messages';
import staticStyles from './style';
import { ValidationWrapperComponentProps } from '../../RouteParamsValidationWrapper';
import { getAssetInfo } from '../../../libs/aave-ui-kit';
import { BigNumber } from '@aave/protocol-js';

interface BasicFormProps extends Pick<ValidationWrapperComponentProps, 'poolReserve'> {
  title?: string;
  description?: string | ReactNode;
  maxAmount: string;
  amountFieldTitle?: string;
  currencySymbol: string;
  onSubmit: (amount: string, max?: boolean) => void;
  withRiskBar?: boolean;
  submitButtonTitle?: string;
  absoluteMaximum?: boolean;
  className?: string;
  maxDecimals?: number;
  warning?: ReactNode;
  children?: ReactNode;
  isDeposit?: boolean;
  isRepay?: boolean;
  userTokensBalance?: BigNumber;
  getTransactionData?: (
    user: string
  ) => () => Promise<EthereumTransactionTypeExtended[]> | EthereumTransactionTypeExtended[];
  balanceTitle?: string;
  maxButtonValue?: string | number;
}

export default function BasicForm({
  poolReserve,
  title,
  description,
  maxAmount,
  amountFieldTitle,
  currencySymbol,
  onSubmit,
  withRiskBar,
  submitButtonTitle,
  absoluteMaximum,
  className,
  maxDecimals,
  warning,
  children,
  isDeposit,
  getTransactionData,
  balanceTitle,
  isRepay,
  userTokensBalance,
  maxButtonValue = maxAmount,
}: BasicFormProps) {
  const intl = useIntl();
  const { chainId } = useProtocolDataContext();
  const { currentAccount } = useUserWalletDataContext();

  const [isMaxSelected, setIsMaxSelected] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const asset = getAssetInfo(currencySymbol);

  const userTokensBalanceValue: string = userTokensBalance
    ? Number(userTokensBalance.toFixed(6)).toString()
    : '0';

  const handleAmountChange = (newAmount: string) => {
    const newAmountValue = valueToBigNumber(newAmount);
    setError('');
    if (newAmountValue.gt(maxAmount)) {
      setAmount(maxAmount);
      return setIsMaxSelected(true);
    } else if (newAmountValue.isNegative()) {
      setAmount('0');
    } else {
      setAmount(newAmount);
    }
    setIsMaxSelected(false);
  };

  const handleMaxButtonClick = () => {
    setAmount(maxAmount);
    setIsMaxSelected(true);
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!valueToBigNumber(amount).isNaN() && +amount !== 0) {
      return onSubmit(amount, absoluteMaximum && isMaxSelected);
    }

    setError(intl.formatMessage(messages.error));
  };

  return (
    <form onSubmit={handleSubmit} className={classNames('BasicForm', className)}>
      {!!title && <Caption title={title} description={description} />}

      <div className="BasicForm__inner">
        {children}

        <AmountField
          maxButtonValue={maxButtonValue}
          title={amountFieldTitle}
          maxAmount={maxAmount}
          symbol={currencySymbol}
          maxDecimals={maxDecimals}
          value={amount}
          onChange={handleAmountChange}
          onMaxButtonClick={handleMaxButtonClick}
          error={error}
          poolReserve={poolReserve}
          balanceTitle={balanceTitle}
        />

        {withRiskBar && (
          <RiskBar
            value={Number(amount)}
            onChange={handleAmountChange}
            maxAmount={maxAmount}
            currencySymbol={currencySymbol}
          />
        )}

        {isRepay && (
          <div style={{ marginTop: 10 }}>
            <div className="BasicForm__deposit-block__column">
              <div className="BasicForm__deposit-block__column-title" />
              <div className="BasicForm__deposit-block__column-value" style={{ color: '#a49fda' }}>
                {`Balance: ${userTokensBalanceValue}`}
              </div>
            </div>
          </div>
        )}

        {isDeposit && (
          <div className="BasicForm__deposit-block" style={{ color: 'white' }}>
            <div className="BasicForm__deposit-block__column">
              <div className="BasicForm__deposit-block__column-title">Amount</div>
              <div className="BasicForm__deposit-block__column-value">
                <img
                  className="TokenIcon__image"
                  src={asset.icon}
                  alt={currencySymbol}
                  height={24}
                  width={24}
                />
                {amount} {currencySymbol.toUpperCase()}
              </div>
            </div>
            <div className="BasicForm__deposit-block__column">
              <div className="BasicForm__deposit-block__column-title">Collateral Usage</div>
              <div className="BasicForm__deposit-block__column-value BasicForm__deposit-block__column-collateral">
                Yes
              </div>
            </div>
          </div>
        )}

        {/* {[ChainId.mainnet].includes(chainId) && getTransactionData && (
         <TxEstimation getTransactionsData={getTransactionData} amount={amount} />
         )} */}

        {!!warning && <div className="BasicForm__warning">{warning}</div>}
      </div>

      <div className="BasicForm__buttons">
        {!currentAccount ? (
          <ConnectButton />
        ) : (
          <DefaultButton
            title={submitButtonTitle || intl.formatMessage(messages.continue)}
            mobileBig={true}
            type="submit"
          />
        )}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </form>
  );
}
