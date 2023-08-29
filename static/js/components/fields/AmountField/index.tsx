import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { rgba, useThemeContext } from '../../../libs/aave-ui-kit';
import BasicField from '../BasicField';
import Value from '../../basic/Value';
import Preloader from '../../basic/Preloader';
import { TokenIcon } from '../../../helpers/config/assets-config';

import messages from './messages';
import staticStyles from './style';
import { ValidationWrapperComponentProps } from '../../RouteParamsValidationWrapper';

interface AmountFieldProps extends Pick<ValidationWrapperComponentProps, 'poolReserve'> {
  symbol: string;
  value: string;
  onChange: (value: string) => void;
  onMaxButtonClick?: () => void;
  error?: string;
  title?: string;
  maxAmount?: number | string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  maxDecimals?: number;
  topDecimals?: number;
  balanceTitle?: string;
  maxButtonValue?: string | number;
}

export default function AmountField({
  poolReserve,
  symbol,
  value,
  onChange,
  error,
  title,
  maxAmount,
  className,
  disabled,
  loading,
  maxDecimals = 18,
  onMaxButtonClick,
  topDecimals,
  balanceTitle,
  maxButtonValue = maxAmount,
}: AmountFieldProps) {
  const intl = useIntl();
  const { currentTheme, lg, md } = useThemeContext();
  const [onFocus, setFocus] = useState(false);

  const blockInvalidChar = (event: React.KeyboardEvent<HTMLInputElement>) =>
    ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault();

  // remove leading zeroes before meaningful digit
  const integerPart = (value.split('.')[0] || '').replace(/^0[0-9]/, '0');
  // remove decimal places which does not make sense
  const decimalPart = (value.split('.')[1] || '').substring(0, maxDecimals);
  // merge
  const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;

  const background = rgba(`${currentTheme.textDarkBlue.rgb}, 0.05`);

  return (
    <div
      className={classNames(
        'AmountField',
        {
          AmountField__focus: onFocus,
          AmountField__error: error,
          AmountField__disabled: disabled || loading,
        },
        className
      )}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <div className="AmountField__wrapper">
        <BasicField
          value={formattedValue}
          onChange={onChange}
          placeholder={intl.formatMessage(messages.placeholder)}
          min={0}
          type="number"
          step="any"
          className="AmountField__input"
          disabled={disabled || loading}
          onKeyDown={blockInvalidChar}
          data-cy={'amountInput'}
          poolReserve={poolReserve}
          maxAmount={maxAmount}
        />

        {maxAmount && !loading && !!onMaxButtonClick && (
          <div
            className="AmountField__right-inner"
            style={{
              width: '230px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <TokenIcon width={24} height={24} tokenSymbol={symbol} tokenFullName={symbol} />
            <div
              className="AmountField__right-iner__value"
              onClick={() => onChange(String(maxAmount))}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ marginRight: '3px' }}>{balanceTitle ?? 'Balance'}:</div>
              <Value
                value={maxButtonValue ?? 0}
                maximumValueDecimals={topDecimals ? topDecimals : 2}
                minimumValueDecimals={topDecimals}
                color="wistful"
              />
            </div>
          </div>
        )}

        {loading && <Preloader />}
      </div>

      <p className="AmountField__error-text"></p>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .AmountField {
          &:hover,
          &__focus,
          &__error {
            .AmountField__wrapper {
              background-color: ${background};
            }
          }

          &__error {
            .AmountField__wrapper {
              border: 1px solid ${currentTheme.red.hex};
            }
          }

          &__wrapper {
            border: 1px solid #493fb5;
            background: #1c165b;
            padding: 8px;
          }
          &__maxButton {
            color: #a49fda;
            text-transform: lowercase;
          }

          &__error-text {
            color: ${currentTheme.red.hex};
          }

          &__disabled {
            &:hover {
              .AmountField__wrapper {
                background-color: transparent;
              }
            }
          }

          &__smallerThanMinSymbol {
            color: ${currentTheme.textDarkBlue.hex};
            margin-right: 3px;
          }
        }
      `}</style>
    </div>
  );
}
