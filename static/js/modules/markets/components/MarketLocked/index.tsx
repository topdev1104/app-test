import { useEffect, useState } from 'react';
import staticStyles from './style';
import { Link } from 'react-router-dom';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import { getProvider } from '../../../../helpers/config/markets-and-network-config';
import { ChainId } from '@aave/contract-helpers';
import { AaveOracleContract } from '../../../../libs/aave-protocol-js/AaveOracle';
import { mainet } from '../../../../ui-config/markets/tokensConfig';

import NetBook from '../../../../images/netbook-bg.svg';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';
import { useIntl } from 'react-intl';
interface MarketLockedProps {
  value: BigNumber;
  uwuPrice: BigNumber;
}
export default function MarketLocked({ value }: MarketLockedProps) {
  const intl = useIntl();
  const [uwuETHLPPrice, setUwUETHLPPrice] = useState('0');
  const { provider: uwuProvider } = useUwuProviderContext();
  useEffect(() => {
    const provider = uwuProvider;
    const aaveOracle = new AaveOracleContract(provider, mainet.AaveOracle);

    aaveOracle.getAssetPrice(mainet.UwUETHLP).then((price) => {
      const priceStr = valueToBigNumber(price.toString())
        .div(10 ** 8)
        .decimalPlaces(2)
        .toString();
      setUwUETHLPPrice(priceStr);
    });
  }, []);

  const marketLockSizeLabel = value.isZero()
    ? 'Fetching...'
    : intl.formatNumber(valueToBigNumber(value).toNumber(), { maximumFractionDigits: 2 });

  const marketLockSizeValue = value.isZero()
    ? 'Fetching...'
    : `$${intl.formatNumber(valueToBigNumber(value).multipliedBy(uwuETHLPPrice).toNumber(), {
        maximumFractionDigits: 2,
      })} USD`;

  return (
    <div className="MarketLock">
      <div className="MarketLock__values">
        <img src={NetBook} alt="wallet" className="MarketLock__values__icon" />
        <div>
          <div className="MarketLock__title">Locked</div>
          <div className="MarketLock__size">{marketLockSizeLabel}</div>
          <div className="MarketLock__value">{marketLockSizeValue}</div>
        </div>
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
