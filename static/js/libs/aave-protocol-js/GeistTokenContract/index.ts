import { ContractTransaction, providers } from 'ethers';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService.js';
import { tEthereumAddress } from '@aave/contract-helpers/dist/esm/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/esm/erc20-contract';

import { GeistToken__factory } from './typechain/GeistToken__factory';
import { GeistToken } from './typechain/GeistToken';
import getNumberFromEtherBigNumber from '../getNumberFromEtherBigNumber';

export class GeistTokenContract extends BaseService<GeistToken> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, GeistToken__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async getInfo(
    user: tEthereumAddress
  ): Promise<{ walletBalance: BigNumber; currencySymbol: string; totalSupply: BigNumber }> {
    const { decimalsOf } = this.erc20Service;
    const geistTokenContract: GeistToken = this.getContractInstance(this.contractAddress);

    const [walletBalance, currencySymbol, totalSupply] = await Promise.all([
      geistTokenContract.callStatic.balanceOf(user),
      geistTokenContract.callStatic.symbol(),
      geistTokenContract.callStatic.totalSupply(),
    ]);

    const decimals = await decimalsOf(this.contractAddress);
    const balance = getNumberFromEtherBigNumber(walletBalance, decimals).toString();
    const total = getNumberFromEtherBigNumber(totalSupply, decimals).toString();

    return {
      walletBalance: valueToBigNumber(balance.toString()),
      currencySymbol,
      totalSupply: valueToBigNumber(total.toString()),
    };
  }

  public async totalSupply() {
    const geistTokenContract: GeistToken = this.getContractInstance(this.contractAddress);

    return await geistTokenContract.totalSupply();
  }

  public async balanceOf(address: string) {
    const geistTokenContract: GeistToken = this.getContractInstance(this.contractAddress);

    return await geistTokenContract.balanceOf(address);
  }

  public async mint(user: tEthereumAddress): Promise<ContractTransaction> {
    const geistTokenContract: GeistToken = this.getContractInstance(this.contractAddress);

    return geistTokenContract.mint(user, 100);
  }
}
