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
import {
  BaseDebtToken,
  BaseDebtTokenInterface,
} from '@aave/contract-helpers/dist/esm/baseDebtToken-contract';
import { DEFAULT_APPROVE_AMOUNT, valueToWei } from '@aave/contract-helpers/dist/esm/commons/utils';

import { Leverager__factory } from './typechain/Leverager__factory';
import { Leverager } from './typechain/Leverager';

export class LeveragerContract extends BaseService<Leverager> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;
  readonly baseDebtToken: BaseDebtTokenInterface;

  constructor(provider: providers.Provider, leveragerAddr: string) {
    super(provider, Leverager__factory);

    this.contractAddress = leveragerAddr;
    const erc20Service = new ERC20Service(provider);
    this.erc20Service = erc20Service;
    this.baseDebtToken = new BaseDebtToken(provider, erc20Service);
  }

  public async getVDebtToken(asset: string) {
    const leveragerContract: Leverager = this.getContractInstance(this.contractAddress);
    const debtTokenAddress = await leveragerContract.callStatic.getVDebtToken(asset);
    return debtTokenAddress;
  }

  public async loop(
    user: tEthereumAddress,
    asset: string,
    debtTokenAddress: string,
    amount: string,
    interestRateMode: string,
    borrowRatio: string,
    loopCount: string
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { decimalsOf, isApproved, approve } = this.erc20Service;

    borrowRatio = Math.floor(parseFloat(borrowRatio) * 10000).toString();

    console.log(`executing`);
    console.log(amount);
    console.log(borrowRatio);
    console.log(loopCount);

    const approved = await isApproved({
      token: asset,
      user,
      spender: this.contractAddress,
      amount,
    });
    if (!approved) {
      const approveTx = approve({
        user,
        token: asset,
        spender: this.contractAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const delegationApproved = await this.baseDebtToken.isDelegationApproved({
      debtTokenAddress,
      allowanceGiver: user,
      allowanceReceiver: this.contractAddress,
      amount,
    });
    if (!delegationApproved) {
      const approveTx = this.baseDebtToken.approveDelegation({
        user,
        delegatee: this.contractAddress,
        debtTokenAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const leveragerContract: Leverager = this.getContractInstance(this.contractAddress);
    const convertedAmount: string = valueToWei(amount, await decimalsOf(asset));
    console.log('Loop params', {
      asset,
      convertedAmount,
      interestRateMode,
      borrowRatio,
      loopCount,
    });
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () =>
        leveragerContract.populateTransaction.loop(
          asset,
          convertedAmount,
          interestRateMode,
          borrowRatio,
          loopCount
        ),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });
    return txs;
  }
}
