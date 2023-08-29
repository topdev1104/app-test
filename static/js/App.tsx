import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import css from 'styled-jsx/css';
import { useThemeContext } from './libs/aave-ui-kit';

import { useStaticPoolDataContext } from './libs/pool-data-provider';
import { useMenuContext } from './libs/menu';
import { CURRENCY_ROUTE_PARAMS } from './helpers/router-types';
import ScreensWrapper from './components/wrappers/ScreensWrapper';
import { mainnet } from 'wagmi/chains';

import { Markets, ReserveOverview, Deposit, Withdraw, Borrow, Repay, Dashboard } from './modules';
import SwapBorrowRateModeConfirmation from './modules/swap/SwapBorrowRateModeConfirmation';
import { RewardConfirm } from './modules/reward/screens/RewardConfirm';
import Loop from './modules/loop/screens/LoopMain';
import IncorrectNetworkAlert from './components/IncorrectNetworkAlert';
import ManageRadiantMain from './modules/manage-uwu/screens/ManageRadiantMain';
import Vault from './modules/vault';
import NFT from './modules/nft';

const staticStyles = css.global`
  .App {
    display: flex;
    flex-direction: column;
    flex: auto;
    overflow: hidden;
    height: 1px;

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      position: relative;
    }
  }
`;

const chains = [mainnet];
const projectId = '00e7d54feb9698fc49a8a4482f8dc9cd';

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, chains }),
//   publicClient
// })
// const ethereumClient = new EthereumClient(wagmiConfig, chains)

function ModulesWithMenu() {
  const { isUserHasDeposits } = useStaticPoolDataContext();
  return (
    <ScreensWrapper>
      <Switch>
        <Route path="/markets" component={Markets} />
        <Route path="/dashboard" component={Dashboard} />

        <Route path="/loop" component={Loop} />

        <Route path="/deposit" component={Deposit} />
        <Route path={`/withdraw/${CURRENCY_ROUTE_PARAMS}`} component={Withdraw} />

        <Route path="/borrow" component={Borrow} />
        <Route path={`/repay/${CURRENCY_ROUTE_PARAMS}`} component={Repay} />

        <Route
          exact={true}
          path={`/interest-swap/${CURRENCY_ROUTE_PARAMS}/confirmation`}
          component={SwapBorrowRateModeConfirmation}
        />

        <Route
          exact={true}
          path={`/reserve-overview/${CURRENCY_ROUTE_PARAMS}`}
          component={ReserveOverview}
        />

        <Route path="/manage-uwu" component={ManageRadiantMain} key="Manage UwU" />
        <Route path="/vault" component={Vault} key="Vault" />
        <Route path="/nft" component={NFT} key="NFT" />
        <Route
          path="/rewards/confirm/:incentivesControllerAddress"
          component={RewardConfirm}
          key="Reward confirm"
        />

        <Redirect to={isUserHasDeposits ? '/dashboard' : '/markets'} />
      </Switch>
    </ScreensWrapper>
  );
}

const App: React.FC = () => {
  const { md } = useThemeContext();
  const { openMobileMenu } = useMenuContext();

  const handlers = useSwipeable({
    onSwipedLeft: () => (md ? openMobileMenu() : null),
  });

  return (
    <div className="App">
      {/* <WagmiConfig config={wagmiConfig}> */}
      <IncorrectNetworkAlert />
      <div
        {...handlers}
        className="App__content"
        // style={{ background: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
        style={{ background: '#070428' }}
      >
        <Switch>
          <Route component={ModulesWithMenu} />
        </Switch>
      </div>
      {/* </WagmiConfig> */}
      {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
};

export default App;
