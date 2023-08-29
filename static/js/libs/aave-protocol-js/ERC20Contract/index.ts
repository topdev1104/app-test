import { BigNumberish, ContractTransaction, providers } from 'ethers';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService.js';
import { tEthereumAddress, transactionType } from '@aave/contract-helpers/dist/esm/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/esm/erc20-contract';

import { ERC20TokenToken__factory } from './typechain/ERC20TokenToken__factory';
import { ERC20Token } from './typechain/ERC20Token';
import getNumberFromEtherBigNumber from '../getNumberFromEtherBigNumber';

export class ERC20Contract extends BaseService<ERC20Token> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, ERC20TokenToken__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async allowance(user: tEthereumAddress, spender: string) {
    const contract: ERC20Token = this.getContractInstance(this.contractAddress);
    return await contract.allowance(user, spender);
  }

  public async getInfo(
    user: tEthereumAddress
  ): Promise<{ walletBalance: BigNumber; currencySymbol: string; totalSupply: BigNumber }> {
    const { decimalsOf } = this.erc20Service;
    const geistTokenContract: ERC20Token = this.getContractInstance(this.contractAddress);

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
    const geistTokenContract: ERC20Token = this.getContractInstance(this.contractAddress);

    return await geistTokenContract.totalSupply();
  }

  public async balanceOf(address: string) {
    const geistTokenContract: ERC20Token = this.getContractInstance(this.contractAddress);

    return await geistTokenContract.balanceOf(address);
  }

  public async mint(user: tEthereumAddress): Promise<ContractTransaction> {
    const geistTokenContract: ERC20Token = this.getContractInstance(this.contractAddress);

    return geistTokenContract.mint(user, 100);
  }

  public approve(
    user: tEthereumAddress,
    spender: string,
    amount: BigNumberish
  ): () => Promise<transactionType> {
    const erc20TokenContract: ERC20Token = this.getContractInstance(this.contractAddress);

    return this.generateTxCallback({
      rawTxMethod: () => erc20TokenContract.populateTransaction.approve(spender, amount),
      from: user,
    });
  }
}
