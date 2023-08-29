import { BaseContract, ContractTransaction, providers } from 'ethers';
import BaseService from '@aave/contract-helpers/dist/cjs/commons/BaseService.js';
import { tEthereumAddress } from '@aave/contract-helpers/dist/cjs/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/cjs/erc20-contract';

import { UwUUiPriceGetter } from './typechain/UwUUiPriceGetter';
import { UwUUiPriceGetter__factory } from './typechain/UwUUiPriceGetter__factory';

export class UwUUiPriceGetterContract extends BaseService<UwUUiPriceGetter> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, UwUUiPriceGetter__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async getPrice() {
    const contract: UwUUiPriceGetter = this.getContractInstance(this.contractAddress);

    return await contract.getPrice();
  }
}
