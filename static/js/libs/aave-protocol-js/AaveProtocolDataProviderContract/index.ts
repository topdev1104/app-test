import { providers } from 'ethers';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService.js';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/esm/erc20-contract';

import { AaveProtocolDataProvider__factory } from './typechain/AaveProtocolDataProvider__factory';
import { AaveProtocolDataProvider } from './typechain/AaveProtocolDataProvider';

export class AaveProtocolDataProviderContract extends BaseService<AaveProtocolDataProvider> {
  readonly erc20Service: IERC20ServiceInterface;
  aaveProtocolDataProvider: string;

  constructor(provider: providers.Provider, aaveProtocolDataProvider: string) {
    super(provider, AaveProtocolDataProvider__factory);

    this.aaveProtocolDataProvider = aaveProtocolDataProvider;
    this.erc20Service = new ERC20Service(provider);
  }

  public async getTokens(): Promise<string[]> {
    const aaveProtocolDataProvider: AaveProtocolDataProvider = this.getContractInstance(
      this.aaveProtocolDataProvider
    );

    const res: string[] = [];

    const tokens = await aaveProtocolDataProvider.getAllReservesTokens();
    for (let i = 0; i < tokens.length; i += 1) {
      const [aToken, , vToken] = await aaveProtocolDataProvider.getReserveTokensAddresses(
        tokens[i].tokenAddress
      );
      // @ts-ignore
      res.push(aToken, vToken);
    }

    return res;
  }

  public async getReserveConfigurationData(asset: string) {
    console.log('asset', asset);
    const aaveProtocolDataProvider: AaveProtocolDataProvider = this.getContractInstance(
      this.aaveProtocolDataProvider
    );

    return aaveProtocolDataProvider.callStatic.getReserveConfigurationData(asset);
  }
}
