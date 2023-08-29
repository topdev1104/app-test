import { providers } from 'ethers';
import React, { PropsWithChildren, useContext, useState } from 'react';
import { MarketDataType, NetworkConfig } from '../../helpers/config/types';
import {
  availableMarkets,
  marketsData,
  getNetworkConfig,
  getProvider,
  CustomMarket,
} from '../../helpers/config/markets-and-network-config';
import { useUwuProviderContext } from '../uwu-provider/UwuProvider';

const LS_KEY = 'selectedMarket';

export interface ProtocolContextData {
  currentMarket: CustomMarket;
  setCurrentMarket: (market: CustomMarket) => void;
  currentMarketData: MarketDataType;
  // currently selected one
  chainId: number;
  networkConfig: NetworkConfig;
  jsonRpcProvider: providers.Provider;
}

const PoolDataContext = React.createContext({} as ProtocolContextData);

export function ProtocolDataProvider({ children }: PropsWithChildren<{}>) {
  const [currentMarket, setCurrentMarket] = useState<CustomMarket>(
    availableMarkets[Number(process.env.REACT_APP_MARKET_ID)]
  );
  const { provider: uwuProvider } = useUwuProviderContext();

  const currentMarketData = marketsData[currentMarket];

  const handleSetMarket = (market: CustomMarket) => {
    localStorage.setItem(LS_KEY, market);
    setCurrentMarket(market);
  };

  return (
    <PoolDataContext.Provider
      value={{
        currentMarket,
        chainId: currentMarketData.chainId,
        setCurrentMarket: handleSetMarket,
        currentMarketData: currentMarketData,
        networkConfig: getNetworkConfig(currentMarketData.chainId),
        jsonRpcProvider: uwuProvider,
      }}
    >
      {children}
    </PoolDataContext.Provider>
  );
}

export const useProtocolDataContext = () => useContext(PoolDataContext);
