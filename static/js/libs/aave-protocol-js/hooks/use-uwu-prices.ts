import { useState, useEffect } from 'react';

// @ts-ignore
import { AaveOracleContract } from '../AaveOracle';
import { valueToBigNumber } from '@aave/protocol-js';
import { mainet } from '../../../ui-config/markets/tokensConfig';
import { GeistTokenContract } from '../GeistTokenContract';
import { UwUUiPriceGetterContract } from '../UwUUiPriceGetterContract';
import { useUwuProviderContext } from '../../uwu-provider/UwuProvider';

const useUwuPrices = () => {
  const [prices, setPrices] = useState<{
    tokenPrice?: number;
    lpTokenPrice?: number;
    nativePrice?: number;
  }>({});
  const { provider: uwuProvider } = useUwuProviderContext();

  useEffect(() => {
    const getTokensPrices = async () => {
      const provider = uwuProvider;
      const aaveOracle = new AaveOracleContract(provider, mainet.AaveOracle);
      const contract = new GeistTokenContract(
        provider,
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
      );
      const uwuETHLPContract = new GeistTokenContract(
        provider,
        '0x3E04863DBa602713Bb5d0edbf7DB7C3A9A2B6027'
      );
      const uwuUIPriceGetter = new UwUUiPriceGetterContract(
        provider,
        '0x027D9e6F282A6620BF3B44289FcfE444305Dc514'
      );
      const balanceOf = valueToBigNumber(
        (await contract.balanceOf('0x3E04863DBa602713Bb5d0edbf7DB7C3A9A2B6027')).toString()
      );
      const ethPrice = valueToBigNumber(
        (await aaveOracle.getAssetPrice('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')).toString()
      );
      const totalSupply = valueToBigNumber((await uwuETHLPContract.totalSupply()).toString());

      const lpPrice = balanceOf
        .multipliedBy(2)
        .div(10 ** 18)
        .multipliedBy(ethPrice)
        .div(totalSupply.div(10 ** 18));

      const uwuPrice = valueToBigNumber(
        (await uwuUIPriceGetter.getPrice()).toString()
      ).decimalPlaces(2);

      setPrices({
        tokenPrice: uwuPrice.toNumber(),
        lpTokenPrice: lpPrice.toNumber(),
      });
    };

    getTokensPrices();
    const intervalId = setInterval(getTokensPrices, 30 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    prices,
  };
};

export default useUwuPrices;
