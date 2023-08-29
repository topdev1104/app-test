import { useEffect, useState } from 'react';
import staticStyles from './style';
import { BigNumber } from 'ethers';
import {
  getDefaultChainId,
  getSupportedChainIds,
} from '../../helpers/config/markets-and-network-config';
import { InjectedConnector } from '@web3-react/injected-connector';

export default function IncorrectNetworkAlert() {
  const [provider, setProvider] = useState<any>(null);
  const [chainId, setChainId] = useState<any>(null);
  let neededChainId = getDefaultChainId();
  const connector = new InjectedConnector({ supportedChainIds: getSupportedChainIds() });

  useEffect(() => {
    connector.getProvider().then((provider) => setProvider(provider));
    connector.getChainId().then((chainId) => {
      setChainId(BigNumber.from(chainId).toNumber());
    });
  }, []);

  return (
    <div
      className="IncorrectNetworkAlert"
      style={{ display: chainId === neededChainId ? 'none' : 'flex' }}
    >
      <div className="IncorrectNetworkAlert__content">
        <div className="IncorrectNetworkAlert__content__titles">
          <div className="IncorrectNetworkAlert__content__titles__title">
            Connected to wrong network
          </div>
          <div className="IncorrectNetworkAlert__content__titles__sub-title">
            Switch to Ethereum network
          </div>
        </div>
        <div className="IncorrectNetworkAlert__content__button">
          <button
            onClick={async () => {
              if (provider) {
                try {
                  await provider.request!({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${neededChainId.toString(16)}` }],
                  });
                  window.location.reload();
                } catch (switchError) {
                  console.log(switchError);
                  // if (switchError.code === 4902) {
                  //   try {
                  //     await library.provider.request!({
                  //       method: 'wallet_addEthereumChain',
                  //       params: [
                  //         {
                  //           chainId: `0x${neededChainId.toString(16)}`,
                  //           chainName: config.name,
                  //           nativeCurrency: config.nativeCurrency,
                  //           rpcUrls: [...publicJsonRPCUrl, publicJsonRPCWSUrl],
                  //           blockExplorerUrls: config.explorerUrls,
                  //         },
                  //       ],
                  //     });
                  //   } catch (addError) {
                  //     console.log(addError);
                  //     // TODO: handle error somehow
                  //   }
                  // }
                }
              }
            }}
          >
            Switch to Ethereum
          </button>
        </div>
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
