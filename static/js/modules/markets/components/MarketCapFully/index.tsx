import { useEffect, useState } from 'react';
import staticStyles from './style';
import { BigNumber } from '@aave/protocol-js';
import SystemIcon from '../../../../components/SystemIcon/SystemIcon';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

interface MarketCapFullyProps {
  value: BigNumber;
}

export default function MarketCapFully({ value }: MarketCapFullyProps) {
  const [formatPrice, setFormatPrice] = useState<string>('');
  const { sm } = useThemeContext();

  useEffect(() => {
    if (value.isGreaterThan(1000000000)) {
      setFormatPrice(
        value
          .div(10 ** 9)
          .decimalPlaces(2)
          .toString() + ' B'
      );
    } else if (value.isGreaterThan(1000000)) {
      setFormatPrice(
        value
          .div(10 ** 6)
          .decimalPlaces(2)
          .toString() + ' M'
      );
    } else if (value.isGreaterThan(1000000)) {
      setFormatPrice(
        value
          .div(10 ** 3)
          .decimalPlaces(2)
          .toString() + ' K'
      );
    } else {
      setFormatPrice(value.decimalPlaces(2).toString());
    }
  }, [value]);

  return (
    <div className="MarketCap">
      {sm && <SystemIcon image="wallet" size="50" border={false} />}
      {!sm && <SystemIcon image="wallet" size="72" border={false} />}
      <div className="MarketCap__values">
        <div className="MarketCap__title">Fully diluted market Cap</div>
        <div className="MarketCap__size">
          {formatPrice === '0' ? 'Fetching...' : `$ ${formatPrice}`}
        </div>
      </div>
      <div className="MarketCap__button"></div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
