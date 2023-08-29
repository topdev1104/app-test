import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import TagManager from 'react-gtm-module';

import * as serviceWorker from './serviceWorker';

import initSentry from './libs/sentry';
import { ThemeProvider } from './libs/aave-ui-kit';
import { LanguageProvider } from './libs/language-provider';
import { Web3Provider } from './libs/web3-data-provider';
import { ReferralHandler } from './libs/referral-handler';
import { MenuProvider } from './libs/menu';
import { ProtocolDataProvider } from './libs/protocol-data-provider';
import { TxBuilderProvider } from './libs/tx-provider';

import App from './App';
import StaticPoolDataProviderWrapper from './components/PoolDataProviderWrapper';
import ErrorBoundary from './components/ErrorBoundary';

import globalStyle from './globalStyle';
import { WalletBalanceProvider } from './libs/wallet-balance-provider/WalletBalanceProvider';
import { IPFS_MODE } from './helpers/config/misc-config';
import {
  getDefaultChainId,
  getSupportedChainIds,
} from './helpers/config/markets-and-network-config';
import { UnlockWalletPreloader } from './components/UnlockWalletPreloader';
import ConnectWalletModal from './components/ConnectWalletModal';
import { DynamicPoolDataProvider } from './libs/pool-data-provider';
import { ConnectionStatusProvider } from './libs/connection-status-provider';
import { IncentivesDataProvider } from './libs/pool-data-provider/hooks/use-incentives-data-context';
import { RdntBalanceProvider } from './libs/wallet-balance-provider/RdntBalanceProvider';
import { Helmet } from 'react-helmet';
import { UwuProvider } from './libs/uwu-provider/UwuProvider';
import { mainnet } from 'wagmi/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

initSentry();
Modal.setAppElement('#root');

const GTM_ID = process.env.REACT_APP_GTM_ID;
if (GTM_ID) {
  TagManager.initialize({ gtmId: GTM_ID });
}

function getWeb3Library(provider: any): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(provider);
}

const Router = ({ children }: React.PropsWithChildren<{}>) =>
  IPFS_MODE ? <HashRouter>{children}</HashRouter> : <BrowserRouter>{children}</BrowserRouter>;

const chains = [mainnet];
const projectId = '00e7d54feb9698fc49a8a4482f8dc9cd';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

ReactDOM.render(
  <div className="Main">
    <Helmet>
      {/* <meta
        http-equiv="Content-Security-Policy"
        content="img-src 'self' data: 'unsafe-inline' fonts.gstatic.com fonts.googleapis.com cloudflare-eth.com api.lend.ceant.net api.thegraph.com data:"
      /> */}
    </Helmet>
    <WagmiConfig config={wagmiConfig}>
      <Router>
        <ReferralHandler>
          <LanguageProvider>
            <ThemeProvider>
              <ProtocolDataProvider>
                <ConnectionStatusProvider>
                  <MenuProvider>
                    <Web3ReactProvider getLibrary={getWeb3Library}>
                      <ErrorBoundary>
                        <Web3Provider
                          defaultChainId={getDefaultChainId()}
                          supportedChainIds={getSupportedChainIds()}
                          preloader={UnlockWalletPreloader}
                          connectWalletModal={ConnectWalletModal}
                        >
                          <UwuProvider>
                            <WalletBalanceProvider>
                              <StaticPoolDataProviderWrapper>
                                <RdntBalanceProvider>
                                  <DynamicPoolDataProvider>
                                    <IncentivesDataProvider>
                                      <TxBuilderProvider>
                                        <App />
                                      </TxBuilderProvider>
                                    </IncentivesDataProvider>
                                  </DynamicPoolDataProvider>
                                </RdntBalanceProvider>
                              </StaticPoolDataProviderWrapper>
                            </WalletBalanceProvider>
                          </UwuProvider>
                        </Web3Provider>
                      </ErrorBoundary>
                    </Web3ReactProvider>
                  </MenuProvider>
                </ConnectionStatusProvider>
              </ProtocolDataProvider>
            </ThemeProvider>
          </LanguageProvider>
        </ReferralHandler>
      </Router>
    </WagmiConfig>

    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

    <style jsx={true} global={true}>
      {globalStyle}
    </style>
  </div>,
  document.getElementById('root')
);

serviceWorker.unregister();
