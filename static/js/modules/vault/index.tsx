import { Switch, Route } from 'react-router-dom';

import VaultMain from './screens/VaultMain';

import { VAULT_ROUTE_PARAMS } from '../../helpers/router-types';
import VaultCurrency from './screens/VaultCurrency';
export interface VaultReserve {
  symbol: string;
  asset: string;
  decimals: number;
  strikeReserve: {
    symbol: string;
    asset: string;
    decimals: number;
  };
  vault: string;
}

export default function Vault() {
  return (
    <Switch>
      <Route exact={true} path="/vault" component={VaultMain} />
      <Route exact={true} path={`/vault/${VAULT_ROUTE_PARAMS}`} component={VaultCurrency} />
    </Switch>
  );
}
