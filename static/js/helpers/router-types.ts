export interface CurrencyRouteParamsInterface {
  underlyingAsset: string;
  id?: string;
}
export const CURRENCY_ROUTE_PARAMS = ':underlyingAsset([A-Z0-9x]+)(-?):id?';
export const VAULT_ROUTE_PARAMS = ':asset([A-Z0-9x]+)(-?):action?';
