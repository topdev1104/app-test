import React, { ChangeEvent, useEffect, useState } from "react";
import classNames from 'classnames';

import { useThemeContext } from '../../../libs/aave-ui-kit';

import staticStyles from './style';

import { useStaticPoolDataContext } from '../../../libs/pool-data-provider';
import { BigNumber } from '@aave/protocol-js';
import { ValidationWrapperComponentProps } from '../../RouteParamsValidationWrapper';
import Value from '../../basic/Value';

interface BasicFieldProps extends Pick<ValidationWrapperComponentProps, 'poolReserve'> {
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  type: string;
  isRequired?: boolean;
  placeholder?: string;
  step?: string;
  min?: number;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  maxAmount?: string | number;
}

export default function BasicField({
  poolReserve,
  value,
  onChange,
  className,
  type,
  isRequired,
  placeholder,
  step,
  min,
  disabled,
  onKeyDown,
  maxAmount,
  ...props
}: BasicFieldProps) {
  const { currentTheme } = useThemeContext();
  const [valueInUSD, setValueInUSD] = useState<string>();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();

  useEffect(() => onHandleValueInUSD(String(value)), [value])

  const onHandleValueInUSD = (val?: string) => {
    if (val && maxAmount) {
      if (BigNumber(val).lt(BigNumber(maxAmount))) {
        const priceInUSD = BigNumber(poolReserve?.priceInMarketReferenceCurrency)
          .multipliedBy(marketRefPriceInUsd)
          .multipliedBy(val)
          .toString();
        setValueInUSD(priceInUSD);
      } else {
        const priceInUSD = BigNumber(poolReserve?.priceInMarketReferenceCurrency)
          .multipliedBy(marketRefPriceInUsd)
          .multipliedBy(maxAmount)
          .toString();
        setValueInUSD(priceInUSD);
      }
    } else {
      setValueInUSD('0');
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fieldValue = event.target.value;
    event.preventDefault();

    onHandleValueInUSD(fieldValue);

    onChange(event.target.value);
  };

  return (
    <div className={classNames('BasicField', className)}>
      <input
        onChange={handleOnChange}
        type={type}
        placeholder={placeholder}
        required={isRequired}
        step={step}
        min={min}
        disabled={disabled}
        onKeyDown={onKeyDown}
        value={value}
        {...props}
      />

      {poolReserve?.priceInMarketReferenceCurrency ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: '14px',
            color: '#A49FDA',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '3px' }}>$</div>
          <Value value={valueInUSD ?? 0} maximumValueDecimals={2} color="wistful" />
        </div>
      ) : (
        <div style={{ height: 24 }}></div>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .BasicField {
          input {
            color: ${currentTheme.textDarkBlue.hex};
            &::placeholder {
              color: ${currentTheme.lightBlue.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
