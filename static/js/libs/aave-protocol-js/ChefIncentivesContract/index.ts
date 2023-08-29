import { providers } from 'ethers';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService.js';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '@aave/contract-helpers/dist/esm/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/esm/erc20-contract';

import { ChefIncentivesController } from './typechain/ChefIncentivesController';
import { ChefIncentivesController__factory } from './typechain/ChefIncentivesController__factory';
import { ChefIncentivesControllerV2 } from './typechain/ChefIncentivesControllerV2';
import { ChefIncentivesControllerV2__factory } from './typechain/ChefIncentivesControllerV2__factory';
import getNumberFromEtherBigNumber from '../getNumberFromEtherBigNumber';

export class ChefIncentivesService extends BaseService<ChefIncentivesController> {
  readonly erc20Service: IERC20ServiceInterface;
  chefIncentivesControllerAddr: string;
  version: string;

  constructor(provider: providers.Provider, chefIncentivesControllerAddr: string) {
    super(provider, ChefIncentivesController__factory);
    this.chefIncentivesControllerAddr = chefIncentivesControllerAddr;
    this.erc20Service = new ERC20Service(provider);
    this.version = window.localStorage.getItem('version') ?? 'v2';
  }

  public _claim(user: tEthereumAddress, tokens: string[]): () => Promise<transactionType> {
    const ChefIncentivesContract: ChefIncentivesController = this.getContractInstance(
      this.chefIncentivesControllerAddr
    );

    return this.generateTxCallback({
      rawTxMethod: () => ChefIncentivesContract.populateTransaction.claim(user, tokens),
      from: user,
    });
  }

  public async claim(
    user: tEthereumAddress,
    tokens: string[]
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const ChefIncentivesContract: ChefIncentivesController = this.getContractInstance(
      this.chefIncentivesControllerAddr
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () => ChefIncentivesContract.populateTransaction.claim(user, tokens),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.REWARD_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  public async claimableRewards(user: tEthereumAddress, tokens: string[]): Promise<number[]> {
    const chefIncentivesContract: ChefIncentivesController | ChefIncentivesControllerV2 =
      this.getContractInstance(this.chefIncentivesControllerAddr);

    const rewards = await chefIncentivesContract.callStatic.claimableReward(user, tokens);

    // TODO: investigate - assuming 18 here?
    return rewards.map((amount, i) => getNumberFromEtherBigNumber(amount, 18));
  }

  public async userBaseClaimable(user: tEthereumAddress): Promise<number> {
    const chefIncentivesContract: ChefIncentivesController = this.getContractInstance(
      this.chefIncentivesControllerAddr
    );

    const _userBaseClaimable = await chefIncentivesContract.callStatic.userBaseClaimable(user);
    // TODO: investigate - assuming 18 here?
    return getNumberFromEtherBigNumber(_userBaseClaimable, 18);
  }
}

export class ChefIncentivesServiceV2 extends BaseService<ChefIncentivesController> {
  readonly erc20Service: IERC20ServiceInterface;
  chefIncentivesControllerAddr: string;

  constructor(provider: providers.Provider, chefIncentivesControllerAddr: string) {
    super(provider, ChefIncentivesControllerV2__factory);
    this.chefIncentivesControllerAddr = chefIncentivesControllerAddr;
    this.erc20Service = new ERC20Service(provider);
  }

  public _claim(user: tEthereumAddress, tokens: string[]): () => Promise<transactionType> {
    const ChefIncentivesContract: ChefIncentivesController = this.getContractInstance(
      this.chefIncentivesControllerAddr
    );

    return this.generateTxCallback({
      rawTxMethod: () => ChefIncentivesContract.populateTransaction.claim(user, tokens),
      from: user,
    });
  }

  public async claim(
    user: tEthereumAddress,
    tokens: string[]
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const ChefIncentivesContract: ChefIncentivesController = this.getContractInstance(
      this.chefIncentivesControllerAddr
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () => ChefIncentivesContract.populateTransaction.claim(user, tokens),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.REWARD_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  public async claimableRewards(user: tEthereumAddress, tokens: string[]): Promise<number[]> {
    const chefIncentivesContract: ChefIncentivesController | ChefIncentivesControllerV2 =
      this.getContractInstance(this.chefIncentivesControllerAddr);

    const rewards = await chefIncentivesContract.callStatic.claimableReward(user, tokens);

    // TODO: investigate - assuming 18 here?
    return rewards.map((amount, i) => getNumberFromEtherBigNumber(amount, 18));
  }

  public async userBaseClaimable(user: tEthereumAddress): Promise<number> {
    const chefIncentivesContract: ChefIncentivesController = this.getContractInstance(
      this.chefIncentivesControllerAddr
    );

    const _userBaseClaimable = await chefIncentivesContract.callStatic.userBaseClaimable(user);
    // TODO: investigate - assuming 18 here?
    return getNumberFromEtherBigNumber(_userBaseClaimable, 18);
  }
}
