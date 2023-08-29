import { providers } from 'ethers';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService.js';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '@aave/contract-helpers/dist/esm/commons/types';
import { DEFAULT_APPROVE_AMOUNT, valueToWei } from '@aave/contract-helpers/dist/esm/commons/utils';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/esm/erc20-contract';

import { MultiFeeDistributionV2 } from './typechain/MultiFeeDistributionV2';
import { MultiFeeDistributionV2__factory } from './typechain/MultiFeeDistributionV2__factory';
import getNumberFromEtherBigNumber from '../getNumberFromEtherBigNumber';

export class MultiFeeDistributionV2Service extends BaseService<MultiFeeDistributionV2> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;
  rdntTokenAddress: string;

  constructor(
    provider: providers.Provider,
    rdntTokenAddress: string,
    multiFeeDistribution: string
  ) {
    super(provider, MultiFeeDistributionV2__factory);

    this.contractAddress = multiFeeDistribution;
    this.rdntTokenAddress = rdntTokenAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  // @StakingValidator
  public async getBalances(
    // @isEthAddress() user: tEthereumAddress,
    // @isPositiveAmount() amount: string,
    // @isEthAddress() onBehalfOf?: tEthereumAddress,
    user: tEthereumAddress
  ): Promise<BigNumber[]> {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    const [amount, penaltyAmount, amountWithoutPenalty] =
      await multiFeeDistributionContract.withdrawableBalance(user);
    const [totalEarned, earningsData] = await multiFeeDistributionContract.earnedBalances(user);
    const totalBalance = valueToBigNumber(amountWithoutPenalty.toString()).plus(
      valueToBigNumber(totalEarned.toString())
    );
    const unlockedBalance = amountWithoutPenalty;

    // todo:pavlik check what should be second argument (precision) of getNumberFromEtherBigNumber
    const balance = totalBalance;
    const unlocked = unlockedBalance;
    const earned = new BigNumber(totalEarned._hex);
    let locks = await this.getLockedBalances(user);

    let locked = 0;
    locks.map((lock) => {
      locked += parseFloat(lock.amount);
      return null;
    });

    let staked = new BigNumber(unlocked._hex);
    let total = new BigNumber(balance);
    const withdrawableBalance = await multiFeeDistributionContract.withdrawableBalance(user);
    const lockedBalances = await multiFeeDistributionContract.lockedBalances(user);
    const withdrawable = new BigNumber(withdrawableBalance[0]._hex);
    const penalty = new BigNumber(withdrawableBalance[1]._hex);

    const unlockable = new BigNumber(lockedBalances.unlockable._hex);

    return [
      new BigNumber(locked).plus(unlockable.div(new BigNumber(10 ** 18))),
      unlockable.div(new BigNumber(10 ** 18)),
      staked.div(new BigNumber(10 ** 18)),
      earned.div(new BigNumber(10 ** 18)),
      withdrawable.div(new BigNumber(10 ** 18)),
      penalty.div(new BigNumber(10 ** 18)),
      total.div(new BigNumber(10 ** 18)),
    ];
  }

  public async getLockedBalancesUser(user: tEthereumAddress) {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );
    const { total, unlockable, locked, lockData } =
      await multiFeeDistributionContract.lockedBalances(user);

    return locked;
  }

  public async getLockedSupply() {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );
    return await multiFeeDistributionContract.lockedSupply();
  }

  public async getTotalLockedSupply() {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );
    return await multiFeeDistributionContract.totalLockedSupply();
  }

  public async getLockedBalances(
    user: tEthereumAddress
  ): Promise<{ amount: string; expiryDate: Date }[]> {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    const lockedBalances = await multiFeeDistributionContract.callStatic.lockedBalances(user);

    return lockedBalances.lockData.map(({ amount, unlockTime }) => {
      return {
        // todo:pavlik check what should be second argument (precision) of getNumberFromEtherBigNumber
        amount: getNumberFromEtherBigNumber(amount).toString(),
        expiryDate: new Date(+unlockTime.mul(1000).toString()),
      };
    });
  }

  public async getEarnedBalances(
    user: tEthereumAddress
  ): Promise<{ amount: string; expiryDate: Date }[]> {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );
    const earnedBalances = await multiFeeDistributionContract.callStatic.earnedBalances(user);
    return earnedBalances.earningsData.map(({ amount, unlockTime }) => {
      return {
        // todo:pavlik check what should be second argument (precision) of getNumberFromEtherBigNumber
        amount: getNumberFromEtherBigNumber(amount).toString(),
        expiryDate: new Date(+unlockTime.mul(1000).toString()),
      };
    });
  }

  public async withdraw(user: tEthereumAddress, amount: string) {
    const txs: EthereumTransactionTypeExtended[] = [];

    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );
    // eslint-disable-next-line new-cap
    const convertedAmount: string = valueToWei(amount, 18); // todo:pavlik HARDCODE 18, should be from settings

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () => multiFeeDistributionContract.populateTransaction.withdraw(),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  public async exit(user: tEthereumAddress) {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    return this.generateTxCallback({
      rawTxMethod: () => multiFeeDistributionContract.populateTransaction.exitEarly(user),
      from: user,
    });
  }

  public async withdrawExpiredLocks(user: tEthereumAddress) {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    return this.generateTxCallback({
      rawTxMethod: () => multiFeeDistributionContract.populateTransaction.withdrawExpiredLocks(),
      from: user,
    });
  }

  // @StakingValidator
  public async stake(
    // @isEthAddress() user: tEthereumAddress,
    // @isPositiveAmount() amount: string,
    // @isEthAddress() onBehalfOf?: tEthereumAddress,
    user: tEthereumAddress,
    amount: string,
    isLock: boolean
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { isApproved, approve } = this.erc20Service;

    const approved = await isApproved({
      token: this.rdntTokenAddress,
      user,
      spender: this.contractAddress,
      amount,
    });
    if (!approved) {
      const approveTx = approve({
        user,
        token: this.rdntTokenAddress,
        spender: this.contractAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );
    // eslint-disable-next-line new-cap
    const convertedAmount: string = valueToWei(amount, 18); // todo:pavlik HARDCODE 18, should be from settings

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () =>
        multiFeeDistributionContract.populateTransaction.lock(convertedAmount, user),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  public async claimableRewards(user: tEthereumAddress) {
    const { decimalsOf } = this.erc20Service;
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    const rewards = await multiFeeDistributionContract.callStatic.claimableRewards(user);
    const decimals = await Promise.all(rewards.map(({ token }) => decimalsOf(token)));

    return rewards.map(({ token, amount }, i) => ({
      token,
      amount: getNumberFromEtherBigNumber(amount, decimals[i]),
    }));
  }

  public async getReward(user: tEthereumAddress, tokens: string[]) {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    return this.generateTxCallback({
      rawTxMethod: () => multiFeeDistributionContract.populateTransaction.getReward(tokens),
      from: user,
    });
  }

  public async delegateExit(user: tEthereumAddress, delegatee: string) {
    const multiFeeDistributionContract: MultiFeeDistributionV2 = this.getContractInstance(
      this.contractAddress
    );

    const exitDelegatee = await multiFeeDistributionContract.callStatic.exitDelegatee(user);
    if (exitDelegatee.toLowerCase() === delegatee.toLowerCase()) {
      return null;
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        multiFeeDistributionContract.populateTransaction.delegateExit(delegatee),
      from: user,
    });

    return {
      tx: txCallback,
      txType: eEthereumTxType.ERC20_APPROVAL,
      gas: this.generateTxPriceEstimation([], txCallback),
    };
  }
}
