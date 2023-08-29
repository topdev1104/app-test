import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers/lib.esm/ethers';
import React, { useContext } from 'react';
import { getProvider } from '../../helpers/config/markets-and-network-config';
import { useProtocolDataContext } from '../protocol-data-provider';

type UwuProviderContext = {
  provider: providers.Web3Provider;
  account: string | null | undefined;
};

const Context = React.createContext<UwuProviderContext>({} as UwuProviderContext);

export const UwuProvider: React.FC = ({ children }) => {
  const chainId = 1; // mainet
  const { library, account } = useWeb3React();
  const provider = library ?? getProvider(chainId);

  return <Context.Provider value={{ provider, account }}>{children}</Context.Provider>;
};

export const useUwuProviderContext = () => useContext(Context);
