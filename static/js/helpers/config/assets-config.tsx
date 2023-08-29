import { getAssetInfoFactory, TokenIcon as DefaultTokenIcon } from '../../libs/aave-ui-kit';
import { TokenIconProps } from '../../libs/aave-ui-kit/components/TokenIcon';

import { assetsList, stableAssets } from '../../ui-config/assets';

export const getAssetInfo = getAssetInfoFactory(assetsList);

export const getAssetColor = (assetSymbol: string) => {
  const asset = getAssetInfo(assetSymbol);
  const assetColor = asset.color;

  return assetColor || '#fff';
};

export const isAssetStable = (assetSymbol: string) => {
  const assetInfo = getAssetInfo(assetSymbol);
  return stableAssets.includes(assetInfo.symbol.toLocaleUpperCase());
};

export const TokenIcon = (props: Omit<TokenIconProps, 'getAssetInfo'>) => {
  return <DefaultTokenIcon {...props} getAssetInfo={getAssetInfo} />;
};
