import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { BigNumberValue } from '@aave/protocol-js';

import { useThemeContext } from '../../../libs/aave-ui-kit';

import staticStyles from './style';

interface ValuePercentProps {
  value: BigNumberValue;
  percentSymbol?: boolean;
  maximumDecimals?: number;
  minimumDecimals?: number;
  updateCondition?: boolean;
  color?: 'dark' | 'primary' | 'secondary' | 'green' | 'red' | 'darkOrange' | 'white' | 'lightBlue';
  percentColor?: string;
  className?: string;
  valueColor?: string;
  onWhiteBackground?: boolean;
}

export default function ValuePercent({
  value,
  percentSymbol = true,
  maximumDecimals,
  minimumDecimals,
  updateCondition,
  color = 'dark',
  percentColor,
  className,
  valueColor,
  onWhiteBackground,
}: ValuePercentProps) {
  const { currentTheme } = useThemeContext();
  const intl = useIntl();

  const [newValue, setNewValue] = useState(value);
  const [suffixFormat, setSuffixFormat] = useState('');
  const updateValue = updateCondition ? undefined : value;
  useEffect(() => {
    if (percentSymbol) {
      if (Number(value) * 100 >= 1000000) {
        setNewValue((Number(value) * 100) / 10 ** 6);
        setSuffixFormat(' M');
      } else if (Number(value) * 100 >= 1000) {
        setNewValue((Number(value) * 100) / 10 ** 3);
        setSuffixFormat(' K');
      } else {
        setNewValue(Number(value) * 100);
      }
    } else {
      setNewValue(value);
    }

    // setNewValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateValue]);

  return (
    <div className={classNames('ValuePercent', `ValuePercent__${color}`, className)}>
      <p className="ValuePercent__value" style={{ color: 'white' }}>
        {intl.formatNumber(percentSymbol ? Number(newValue) : Number(newValue), {
          maximumFractionDigits: maximumDecimals || 2,
          minimumFractionDigits: minimumDecimals ? minimumDecimals : undefined,
        })}
        {percentSymbol && suffixFormat}
        {percentSymbol && <span style={{ color: 'white' }}>%</span>}
      </p>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        @import 'src/_mixins/vars';
        @import 'src/_mixins/screen-size';

        .ValuePercent__dark {
          .ValuePercent__value {
            color: ${onWhiteBackground ? currentTheme.darkBlue.hex : currentTheme.textDarkBlue.hex};
            font-size: 16px;
            font-weight: 500;
            line-height: 19px; /* 118.75% */
            letter-spacing: 0.16px;
            @include respond-to(sm) {
              font-size: 14px;
            }
          }
        }
        .ValuePercent__primary {
          .ValuePercent__value {
            color: ${currentTheme.primary.hex};
          }
        }
        .ValuePercent__secondary {
          .ValuePercent__value {
            color: ${currentTheme.secondary.hex};
          }
        }
        .ValuePercent__green {
          .ValuePercent__value {
            color: ${currentTheme.green.hex};
          }
        }
        .ValuePercent__red {
          .ValuePercent__value {
            color: ${currentTheme.red.hex};
          }
        }
        .ValuePercent {
          .ValuePercent__value {
            span {
              color: ${onWhiteBackground
                ? currentTheme.darkBlue.hex
                : currentTheme.textDarkBlue.hex};
            }
          }
        }
        .ValuePercent__darkOrange {
          .ValuePercent__value {
            color: ${currentTheme.darkOrange.hex};
          }
        }
        .ValuePercent__white {
          .ValuePercent__value {
            color: ${currentTheme.white.hex};
            span {
              color: ${currentTheme.white.hex};
            }
          }
        }
        .ValuePercent__lightBlue {
          .ValuePercent__value {
            color: ${currentTheme.lightBlue.hex};
            span {
              color: ${currentTheme.lightBlue.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
