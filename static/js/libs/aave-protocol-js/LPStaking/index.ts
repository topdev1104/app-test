import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService';
import { LPStaking, Pool, Pool__factory } from './typechain';
import { tEthereumAddress } from '@aave/contract-helpers/dist/cjs/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/cjs/erc20-contract';
import { BigNumber, providers } from 'ethers';
import { LPStaking__factory } from './typechain';

export class LPStakingContract extends BaseService<LPStaking> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, LPStaking__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async totalAllocPoint() {
    const contract: LPStaking = this.getContractInstance(this.contractAddress);
    return await contract.totalAllocPoint();
  }

  public async stargatePerBlock() {
    const contract: LPStaking = this.getContractInstance(this.contractAddress);
    return await contract.stargatePerBlock();
  }

  public async poolInfo(arg: BigNumber) {
    const contract: LPStaking = this.getContractInstance(this.contractAddress);
    return await contract.poolInfo(arg);
  }
}

export class PoolContract extends BaseService<Pool> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, Pool__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async totalLiquidity() {
    const contract: Pool = this.getContractInstance(this.contractAddress);
    return await contract.callStatic.totalLiquidity();
  }
}
