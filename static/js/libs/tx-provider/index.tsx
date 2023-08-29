import React, { PropsWithChildren, useContext } from 'react';
import { LendingPool, FaucetService } from '@aave/contract-helpers';

import { useProtocolDataContext } from '../protocol-data-provider';
import { getProvider } from '../../helpers/config/markets-and-network-config';
import { useUwuProviderContext } from '../uwu-provider/UwuProvider';

export interface TxBuilderContextInterface {
  lendingPool: LendingPool;
  faucetService: FaucetService;
}

const TxBuilderContext = React.createContext({} as TxBuilderContextInterface);

export function TxBuilderProvider({ children }: PropsWithChildren<{}>) {
  const { chainId: currentChainId, currentMarketData } = useProtocolDataContext();
  const { provider: uwuProvider } = useUwuProviderContext();

  const lendingPool = new LendingPool(uwuProvider, {
    LENDING_POOL: currentMarketData.addresses.LENDING_POOL,
    REPAY_WITH_COLLATERAL_ADAPTER: currentMarketData.addresses.REPAY_WITH_COLLATERAL_ADAPTER,
    SWAP_COLLATERAL_ADAPTER: currentMarketData.addresses.SWAP_COLLATERAL_ADAPTER,
    WETH_GATEWAY: currentMarketData.addresses.WETH_GATEWAY,
  });

  const faucetService = new FaucetService(uwuProvider, currentMarketData.addresses.FAUCET);

  return (
    <TxBuilderContext.Provider value={{ lendingPool, faucetService }}>
      {children}
    </TxBuilderContext.Provider>
  );
}

export const useTxBuilderContext = () => useContext(TxBuilderContext);
