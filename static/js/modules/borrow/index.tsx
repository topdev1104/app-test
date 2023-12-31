import { Switch, Route, Redirect } from 'react-router-dom';

import BorrowMain from './screens/BorrowMain';
import BorrowCurrency from './screens/BorrowCurrency';
import { CURRENCY_ROUTE_PARAMS } from '../../helpers/router-types';

export default function Borrow() {
  return (
    <Switch>
      <Route exact={true} path="/borrow" component={BorrowMain} />
      {/* нужно удалить следующий роут так как он устарел */}
      <Route path={`/borrow/${CURRENCY_ROUTE_PARAMS}`} component={BorrowCurrency} />

      <Redirect to="/borrow" />
    </Switch>
  );
}
