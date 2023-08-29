import { tEthereumAddress } from '@aave/contract-helpers/dist/esm/commons/types';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService';
import { providers } from 'ethers';
import { Helper, Helper__factory } from './typechain';

export class NFTHelper extends BaseService<Helper> {
  public readonly contractAddress: tEthereumAddress;

  constructor(provider: providers.Provider, helperAddress: string) {
    super(provider, Helper__factory);
    this.contractAddress = helperAddress;
  }

  public async fetchAll() {
    const helperContract: Helper = this.getContractInstance(this.contractAddress);
    return await helperContract.callStatic.fetchAllNft();
  }
}
