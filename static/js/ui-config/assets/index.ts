import {
  assetsList as assetsListFromKit,
  assetsOrder as assetsOrderFromKit,
  STABLE_ASSETS as stableAssetsFromKit,
} from '../../libs/aave-ui-kit';
import { Asset } from '../../libs/aave-ui-kit/helpers/assets-list';

export const assetsList: Asset[] = assetsListFromKit;

export const assetsOrder: string[] = assetsOrderFromKit;
export const stableAssets: string[] = stableAssetsFromKit;
