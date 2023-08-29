import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService';
import { YoSifuStargateVault__factory, YoSifuStargateVaultWrapper__factory } from './typechain';

import { tEthereumAddress } from '@aave/contract-helpers/dist/cjs/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/cjs/erc20-contract';
import { BigNumberish, providers } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  transactionType,
} from '@aave/contract-helpers/dist/esm/commons/types';
import { YoSifuStargateVault, YoSifuStargateVaultWrapper } from './typechain/contracts';
import { BigNumber } from '@aave/protocol-js';

export class YoSifuStargateVaultContract extends BaseService<YoSifuStargateVault> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, YoSifuStargateVault__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async allowance(user: tEthereumAddress, spender: string) {
    const YoSifuStargateVault: YoSifuStargateVault = this.getContractInstance(this.contractAddress);
    return await YoSifuStargateVault.allowance(user, spender);
  }

  public approve(
    user: tEthereumAddress,
    spender: string,
    amount: BigNumberish
  ): () => Promise<transactionType> {
    const YoSifuStargateVault: YoSifuStargateVault = this.getContractInstance(this.contractAddress);

    // console.log('YoSifuStargateVault.provider', YoSifuStargateVault.provider)
    //
    // console.log({
    //   contractAddress: this.contractAddress,
    //   provider: this.provider
    // })

    // const a = await YoSifuStargateVault.asset()
    // console.log('aaa', a)
    // const t = await YoSifuStargateVault.populateTransaction.approve(spender, amount)
    // t.from = user

    return this.generateTxCallback({
      rawTxMethod: () => YoSifuStargateVault.populateTransaction.approve(spender, amount),
      from: user,
    });
    // console.log('a', t)
    // const txCallback: () => Promise<transactionType> = this.generateTxCallback({
    //   rawTxMethod: () => YoSifuStargateVault.populateTransaction.approve(spender, amount),
    //   from: user,
    // });
    //
    // txs.push({
    //   tx: txCallback,
    //   txType: eEthereumTxType.STAKE_ACTION,
    //   gas: this.generateTxPriceEstimation(txs, txCallback),
    // });
    //
    // console.log(txs);
    // return txs;
  }

  public async deposit(
    user: tEthereumAddress,
    assets: BigNumberish,
    receiver: string
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const YoSifuStargateVault: YoSifuStargateVault = this.getContractInstance(this.contractAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () => YoSifuStargateVault.populateTransaction.deposit(assets, receiver),
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  /**
   * get balance.
   * @param user
   */
  public async balanceOf(user: tEthereumAddress) {
    const YoSifuStargateVault: YoSifuStargateVault = this.getContractInstance(this.contractAddress);
    return YoSifuStargateVault.balanceOf(user);
  }

  /**
   *
   */
  public async fee() {
    const contract: YoSifuStargateVault = this.getContractInstance(this.contractAddress);
    return await contract.callStatic.fee();
  }

  /**
   *
   */
  public async totalSupply() {
    const contract: YoSifuStargateVault = this.getContractInstance(this.contractAddress);
    return await contract.callStatic.totalSupply();
  }
}

export class YoSifuStargateVaultWrapperContract extends BaseService<YoSifuStargateVaultWrapper> {
  public readonly contractAddress: tEthereumAddress;

  readonly erc20Service: IERC20ServiceInterface;

  constructor(provider: providers.Provider, contractAddress: string) {
    super(provider, YoSifuStargateVaultWrapper__factory);

    this.contractAddress = contractAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  public async approveToVault(user: tEthereumAddress, address: string) {
    const YoSifuStargateVaultWrapper: YoSifuStargateVaultWrapper = this.getContractInstance(
      this.contractAddress
    );

    return this.generateTxCallback({
      rawTxMethod: () => YoSifuStargateVaultWrapper.populateTransaction.approveToVault([address]),
      from: user,
    });
  }

  /**
   *
   * @param user
   * @param vault
   * @param minOut
   * @param assets
   * @param receiver
   */
  public async depositToVault(
    receiver: tEthereumAddress,
    vault: string,
    minOut: BigNumberish,
    assets: BigNumberish,
    value?: string
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const YoSifuStargateVaultWrapper: YoSifuStargateVaultWrapper = this.getContractInstance(
      this.contractAddress
    );

    if (!value) {
      const txCallback: () => Promise<transactionType> = this.generateTxCallback({
        rawTxMethod: () =>
          YoSifuStargateVaultWrapper.populateTransaction.depositToVault(
            vault,
            minOut,
            assets,
            receiver
          ),
        from: receiver,
      });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation(txs, txCallback),
      });
    } else {
      const txCallback: () => Promise<transactionType> = this.generateTxCallback({
        rawTxMethod: () =>
          YoSifuStargateVaultWrapper.populateTransaction.depositToVault(
            vault,
            minOut,
            assets,
            receiver
          ),
        from: receiver,
        value: value,
      });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation(txs, txCallback),
      });
    }

    return txs;
  }

  /**
   *
   * @param user
   * @param vault
   * @param minOut
   * @param assets
   * @param value
   */
  public async depositUnderlyingToVault(
    user: tEthereumAddress,
    vault: string,
    minOut: BigNumberish,
    assets: BigNumberish,
    value?: string
  ) {
    const txs: EthereumTransactionTypeExtended[] = [];

    const YoSifuStargateVaultWrapper: YoSifuStargateVaultWrapper = this.getContractInstance(
      this.contractAddress
    );

    if (!vault) {
      const txCallback: () => Promise<transactionType> = this.generateTxCallback({
        rawTxMethod: () =>
          YoSifuStargateVaultWrapper.populateTransaction.depositUnderlyingToVault(
            vault,
            minOut,
            assets,
            user
          ),
        from: user,
      });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation(txs, txCallback),
      });
    } else {
      const txCallback: () => Promise<transactionType> = this.generateTxCallback({
        rawTxMethod: () =>
          YoSifuStargateVaultWrapper.populateTransaction.depositUnderlyingToVault(
            vault,
            minOut,
            assets,
            user
          ),
        from: user,
        value: value,
      });

      txs.push({
        tx: txCallback,
        txType: eEthereumTxType.STAKE_ACTION,
        gas: this.generateTxPriceEstimation(txs, txCallback),
      });
    }

    return txs;
  }

  /**
   *
   * @param receiver
   * @param vault
   * @param minOut
   * @param shares
   */
  public async withdrawFromVault(
    receiver: tEthereumAddress,
    vault: string,
    minOut: BigNumberish,
    shares: BigNumberish
  ) {
    const txs: EthereumTransactionTypeExtended[] = [];

    const YoSifuStargateVaultWrapper: YoSifuStargateVaultWrapper = this.getContractInstance(
      this.contractAddress
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () =>
        YoSifuStargateVaultWrapper.populateTransaction.withdrawFromVault(
          vault,
          minOut,
          shares,
          receiver
        ),
      from: receiver,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  /**
   *
   * @param receiver
   * @param vault
   * @param minOut
   * @param shares
   */
  public async withdrawUnderlyingFromVault(
    receiver: tEthereumAddress,
    vault: string,
    minOut: BigNumberish,
    shares: BigNumberish
  ) {
    const txs: EthereumTransactionTypeExtended[] = [];

    const YoSifuStargateVaultWrapper: YoSifuStargateVaultWrapper = this.getContractInstance(
      this.contractAddress
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: () =>
        YoSifuStargateVaultWrapper.populateTransaction.withdrawUnderlyingFromVault(
          vault,
          minOut,
          shares,
          receiver
        ),
      from: receiver,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.STAKE_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback),
    });

    return txs;
  }

  /**
   *
   * @param vault
   * @param amountAssets
   */
  public async previewDepositUnderlyingToVault(vault: string, amountAssets: BigNumberish) {
    const contract: YoSifuStargateVaultWrapper = this.getContractInstance(this.contractAddress);
    return await contract.previewDepositUnderlyingToVault(vault, amountAssets);
  }

  public async previewDeposit(vault: string, amountAssets: BigNumberish) {
    const contract: YoSifuStargateVaultWrapper = this.getContractInstance(this.contractAddress);
    return await contract.callStatic.previewDeposit(vault, amountAssets);
  }

  /**
   *
   * @param vault
   * @param amountAssets
   */
  public async previewWithdraw(vault: string, amountAssets: BigNumberish) {
    const contract: YoSifuStargateVaultWrapper = this.getContractInstance(this.contractAddress);
    return await contract.previewWithdraw(vault, amountAssets);
  }

  public async previewWithdrawUnderlyingFromVault(vault: string, amountAssets: BigNumberish) {
    const contract: YoSifuStargateVaultWrapper = this.getContractInstance(this.contractAddress);
    return await contract.previewWithdrawUnderlyingFromVault(vault, amountAssets);
  }
}
