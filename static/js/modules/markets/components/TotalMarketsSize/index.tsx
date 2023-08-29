import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

import messages from './messages';
import staticStyles from './style';
import { useEffect, useState } from 'react';
import { BigNumber } from '@aave/protocol-js';

interface TotalMarketsSizeProps {
  value: BigNumber;
}

export default function TotalMarketsSize({ value }: TotalMarketsSizeProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  const [totalMarket, setTotalMarket] = useState<string>('');

  useEffect(() => {
    if (value.isGreaterThan(1000000000)) {
      setTotalMarket(
        value
          .div(10 ** 9)
          .decimalPlaces(2)
          .toString() + ' B'
      );
    } else if (value.isGreaterThan(1000000)) {
      setTotalMarket(
        value
          .div(10 ** 6)
          .decimalPlaces(2)
          .toString() + ' M'
      );
    } else if (value.isGreaterThan(1000000)) {
      setTotalMarket(
        value
          .div(10 ** 3)
          .decimalPlaces(2)
          .toString() + ' K'
      );
    } else {
      setTotalMarket(value.decimalPlaces(2).toString());
    }
  }, [value]);

  return (
    <div className="TotalMarketsSize">
      <p>{intl.formatMessage(messages.title)}</p>
      <h2>{totalMarket === '0' ? 'Fetching...' : `$ ${totalMarket}`}</h2>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .TotalMarketsSize {
          color: ${currentTheme.white.hex};
          margin-right: 50px;
        }
      `}</style>
    </div>
  );
}
