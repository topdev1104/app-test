import { useState, useEffect } from 'react';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import { AaveOracle__factory } from '../AaveOracle/typechain/AaveOracle__factory';
import { getProvider } from '../../../helpers/config/markets-and-network-config';
import { networkConfigs } from '../../../ui-config/networks';
import { AaveOracleContract } from '../AaveOracle';
import { ChainId } from '@aave/contract-helpers';
import { mainet } from '../../../ui-config/markets/tokensConfig';
import { UwUUiPriceGetterContract } from '../UwUUiPriceGetterContract';
import { useUwuProviderContext } from '../../uwu-provider/UwuProvider';

const useTotalData = () => {
  const [totalData, setTotalData] = useState<{
    locked?: BigNumber;
    readyToVest?: BigNumber;
    uwuPrice?: BigNumber;
    marketCap?: BigNumber;
    totalPlatformFees?: BigNumber;
  }>({});
  const { provider: uwuProvider } = useUwuProviderContext();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/totalData.json`);
        const data = await response.json();
        const provider = uwuProvider;

        const aaveOracle = new AaveOracleContract(provider, mainet.AaveOracle);

        const uwuUIPriceGetter = new UwUUiPriceGetterContract(
          provider,
          '0x027D9e6F282A6620BF3B44289FcfE444305Dc514'
        );

        const uwuPrice = await uwuUIPriceGetter.getPrice().then((price) => {
          const priceStr = valueToBigNumber(price.toString());
          return priceStr;
        });

        setTotalData({
          locked: data.locked,
          readyToVest: data.readyToVest,
          uwuPrice: valueToBigNumber(uwuPrice.toString()).div(10 ** 8),
          marketCap: data.marketCap,
          totalPlatformFees: data.totalPlatformFees,
        });
      } catch (error) {
        console.log('useTotalData: Error => ', error);
      }
    };

    getData();
    const intervalId = setInterval(getData, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { ...totalData };
};

export default useTotalData;
