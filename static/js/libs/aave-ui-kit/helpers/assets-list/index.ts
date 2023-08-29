import icons from './icons';

export interface Asset {
  name: string;
  symbol: string;
  formattedSymbol?: string;
  color?: string;
  icon?: string;
  symbolFormatted?: string;
  symbolsArray?: string[];
  formattedName?: string;
  shortSymbol?: string;
}

export const assetsList: Asset[] = [
  {
    name: 'SIFUM',
    symbol: 'SIFUM',
    color: '#0e3ca5',
    icon: icons.sifuOld,
  },
  {
    name: 'LUSD',
    symbol: 'LUSD',
    color: '#0e3ca5',
    icon: icons.lusd,
  },
  {
    name: 'WMEMO',
    symbol: 'WMEMO',
    color: '#0e3ca5',
    icon: icons.memo,
  },
  {
    name: 'BLUSD',
    symbol: 'BLUSD',
    color: '#C695F8',
    icon: icons.blusd,
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    color: '#C77DEC',
    icon: icons.dai,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#99ccff',
    icon: icons.eth,
  },
  {
    name: 'USDT Coin',
    symbol: 'USDT',
    color: '#E7987E',
    icon: icons.usdt,
  },
  {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    color: '#9695F8',
    icon: icons.weth,
  },
  {
    name: 'WBTC Coin',
    symbol: 'WBTC',
    color: '#95F8F2',
    icon: icons.wbtc,
  },
  {
    name: 'Frax',
    symbol: 'FRAX',
    color: '#4CADDC',
    icon: icons.frax,
  },
  {
    name: 'Curve DAO Token',
    symbol: 'CRV',
    color: '#ff1e00',
    icon: icons.crv,
  },
  {
    name: 'SIFU',
    symbol: 'SIFU',
    color: '#DEF895',
    icon: icons.sifu,
  },
  {
    name: 'SIFU (old)',
    symbol: 'SIFU_OLD',
    color: '#DEF895',
    icon: icons.sifuOld,
  },
  {
    name: 'UWU',
    symbol: 'UWU',
    color: '#0e3ca5',
    icon: icons.uwu,
  },

  {
    name: 'SSPELL',
    symbol: 'SSPELL',
    color: '#0e3ca5',
    icon: icons.spell,
  },
];

export const getAssetInfoFactory =
  (_assetsList: Asset[]) =>
  (_assetSymbol: string): Asset => {
    const assetSymbol = _assetSymbol.toUpperCase();
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const asset = _assetsList.find((asset: Asset) => asset.symbol === assetSymbol);
    const symbolFormatted = (asset && asset.formattedSymbol) || (asset && asset.symbol);
    const symbolsArray = symbolFormatted?.split('_').filter((e) => String(e).trim());

    const isSymbolsArrayMoreThanOne = !!symbolsArray && symbolsArray.length > 1;
    const formattedName = isSymbolsArrayMoreThanOne ? asset && asset.name : symbolFormatted;

    if (asset) {
      return {
        ...asset,
        symbolFormatted,
        symbolsArray,
        formattedName,
      };
    }

    return {
      name: assetSymbol,
      symbol: assetSymbol,
    };
  };

export const getAssetInfo = getAssetInfoFactory(assetsList);
