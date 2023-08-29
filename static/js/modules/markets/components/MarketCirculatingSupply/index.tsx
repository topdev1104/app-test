import { useEffect, useState } from 'react';
import staticStyles from './style';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import SystemIcon from '../../../../components/SystemIcon/SystemIcon';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

interface MarketCirculatingSupplyProps {
  uwuPrice: BigNumber;
}

export default function MarketCirculatingSupply({ uwuPrice }: MarketCirculatingSupplyProps) {
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
    <div className="MarketCirculatingSupply">
      {sm && <SystemIcon image="jarCoin" size="50" border={false} />}
      {!sm && <SystemIcon image="jarCoin" size="72" border={false} />}

      <div className="MarketCirculatingSupply__values">
        <div className="MarketCirculatingSupply__title">Circulating supply</div>
        <div className="MarketCirculatingSupply__size">
          {marketCap.toString() === '0'
            ? 'Fetching...'
            : `$${marketCap.decimalPlaces(2).toString()}`}{' '}
          {moneySuffix}
        </div>
      </div>
      <div className="MarketCirculatingSupply__button"></div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
