import { useEffect, useState } from 'react';
import staticStyles from './style';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import SystemIcon from '../../../../components/SystemIcon/SystemIcon';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

interface MarketCapProps {
  uwuPrice: BigNumber;
}

export default function MarketCap({ uwuPrice }: MarketCapProps) {
  const [marketCap, setMarketCap] = useState<BigNumber>(valueToBigNumber(0));
  const [moneySuffix, setMoneySuffix] = useState<string>('');
  const { sm } = useThemeContext();

  useEffect(() => {
    fetch('https://api.uwu.team/v1/token/circulatingSupply')
      .then((response) => {
        return response.json();
      })
      .then((circulatingSupply) => {
        const marketCap = valueToBigNumber(circulatingSupply).multipliedBy(uwuPrice);

        if (marketCap.isGreaterThan(1000000000)) {
          setMoneySuffix('B');
          setMarketCap(marketCap.div(1000000000));
        } else if (marketCap.isGreaterThan(1000000)) {
          setMoneySuffix('M');
          setMarketCap(marketCap.div(1000000));
        } else if (marketCap.isGreaterThan(1000)) {
          setMoneySuffix('K');
          setMarketCap(marketCap.div(1000));
        }
      })
      .catch((err) => {
        console.log('Cant fetch circulatingSupply');
      });
  }, [uwuPrice]);

  return (
    <div className="MarketCap">
      {sm && <SystemIcon image="safeCoin" size="50" border={false} />}
      {!sm && <SystemIcon image="safeCoin" size="72" border={false} />}

      <div className="MarketCap__values">
        <div className="MarketCap__title">Market Cap</div>
        <div className="MarketCap__size">
          {marketCap.toString() === '0'
            ? 'Fetching...'
            : `$${marketCap.decimalPlaces(2).toString()}`}{' '}
          {moneySuffix}
        </div>
      </div>
      <div className="MarketCap__button"></div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
