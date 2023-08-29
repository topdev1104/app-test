import { API_ETH_MOCK_ADDRESS } from '@aave/protocol-js';
import { BaseNetworkConfig } from '../helpers/config/types';
import { ChainId } from '@aave/contract-helpers';

//, 'https://mainnet.infura.io/v3/132a2b613dcb4e15bc90cc9cb04ecd58', 'https://rpc.ankr.com/eth'

// https://mainnet.infura.io/v3/132a2b613dcb4e15bc90cc9cb04ecd58
// 'https://mainnet.infura.io/v3/132a2b613dcb4e15bc90cc9cb04ecd58'
export const networkConfigs: Record<string, BaseNetworkConfig> = {
  [ChainId.mainnet]: {
    name: 'Ethereum mainnet',
    publicJsonRPCUrl: [
      'https://mainnet.infura.io/v3/132a2b613dcb4e15bc90cc9cb04ecd58',
      'https://eth-mainnet.g.alchemy.com/v2/dLAKFWe8EgTeNB8T6kBGs5JD7AncorRQ',
      'https://rpc.ankr.com/eth',
    ], // PRIVATE from POKT 'https://polygon-rpc.com'
    // publicJsonRPCWSUrl: 'wss://polygon-rpc.com',
    addresses: {
      walletBalanceProvider: '0x7935330D82c3B2b96B2e6Bdec13e2dFCA1C6addd',
      uiPoolDataProvider: '0x19dd01d5cd88eaE5674A2AB94d654F9413E20ce5',
      // uiIncentiveDataProvider: '0xC5093EDAC52f4DD68b42433eA8754B26eAbb1A48',
    },
    // cachingServerUrl: 'http://localhost:3001/graphql',
    // cachingWSServerUrl: 'ws://localhost:3001/graphql',
    // protocolDataUrl: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2',
    baseAsset: 'ETH',
    baseAssetWrappedAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    // incentives hardcoded information
    rewardTokenSymbol: 'WETH',
    rewardTokenAddress: API_ETH_MOCK_ADDRESS,
    rewardTokenDecimals: 18,
    explorerLink: 'https://etherscan.io',
    rpcOnly: false,
    nftApiUrl: 'https://api-nft.ceant.net/',
  },
} as const;
