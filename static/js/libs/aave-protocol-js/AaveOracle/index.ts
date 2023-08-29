import { BaseContract, ContractTransaction, providers } from 'ethers';
import BaseService from '@aave/contract-helpers/dist/cjs/commons/BaseService.js';
import { tEthereumAddress } from '@aave/contract-helpers/dist/cjs/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/cjs/erc20-contract';

import { AaveOracle } from './typechain/AaveOracle';
import { AaveOracle__factory } from './typechain/AaveOracle__factory';

export class AaveOracleContract extends BaseService<AaveOracle> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, AaveOracle__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async getAssetPrice(asset: string) {
    const geistTokenContract: AaveOracle = this.getContractInstance(this.contractAddress);

    return await geistTokenContract.getAssetPrice(asset);
  }
}
