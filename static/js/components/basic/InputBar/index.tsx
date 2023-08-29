import { useCallback } from 'react';
import { Range } from 'react-range';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import Value from '../Value';
import staticStyles from './style';

interface InputBarProps {
  value: number;
  onChange: (amount: string) => void;
  label?: string;
  minAmount: string;
  maxAmount: string;
}

export default function InputBar({ value, label, onChange, minAmount, maxAmount }: InputBarProps) {
  const { currentTheme } = useThemeContext();

  const handleChange = useCallback(
    (value: number[]) => {
      onChange(value[0].toString());
    },
    [onChange]
  );

  return (
    <div className="InputBar">
      <div className="InputBar__top-inner">
        <div className="InputBar__label">
          <p>{label}</p>
          <Value value={value} color="dark" />
        </div>
      </div>

      <div className="InputBar__range-inner">
        <Range
          step={Number(maxAmount) / 100}
          min={Number(minAmount)}
          max={Number(maxAmount)}
          values={[value]}
          onChange={(values) => handleChange(values)}
          renderTrack={({ props, children }) => (
            <div
              className="InputBar__track"
              {...props}
              style={{
                ...props.style,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              className="InputBar__thumb"
              {...props}
              style={{
                ...props.style,
              }}
            />
          )}
        />
      </div>

      <div className="InputBar__container__title">
        <span className="InputBar__title">{minAmount}</span>
        <span className="InputBar__title">{maxAmount}</span>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .InputBar {
          &__label {
            color: ${currentTheme.textDarkBlue.hex};
          }

          .InputBar__thumb {
            background: ${currentTheme.white.hex};
          }
        }
      `}</style>
    </div>
  );
}
