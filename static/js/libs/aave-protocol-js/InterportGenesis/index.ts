import { transactionType } from '@aave/contract-helpers/dist/cjs/commons/types';
import {
  ERC20Service,
  IERC20ServiceInterface,
} from '@aave/contract-helpers/dist/cjs/erc20-contract';
import BaseService from '@aave/contract-helpers/dist/esm/commons/BaseService';
import { BigNumber, providers } from 'ethers';
import { InterportGenesis } from './typechain/contracts';
import { NFTBuyer } from './typechain/contracts';
import { InterportGenesis__factory, NFTBuyer__factory } from './typechain/factories/contracts';

export class InterportGenesisService extends BaseService<InterportGenesis> {
  readonly erc20Service: IERC20ServiceInterface;

  interportGenesisAddress: string;

  constructor(provider: providers.Provider, interportGenesisAddress: string) {
    super(provider, InterportGenesis__factory);
    this.interportGenesisAddress = interportGenesisAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  /**
   * Approve
   *
   * @param user
   * @param address
   * @param tokenId
   * @returns
   */
  public approve(
    user: string,
    address: string,
    tokenId: BigNumber
  ): () => Promise<transactionType> {
    const contract: InterportGenesis = this.getContractInstance(this.interportGenesisAddress);

    return this.generateTxCallback({
      rawTxMethod: () => contract.populateTransaction.approve(address, tokenId),
      from: user,
    });
  }

  /**
   * Get approved
   *
   * @param tokenId
   * @returns
   */
  public async getApproved(tokenId: BigNumber): Promise<string> {
    const contract: InterportGenesis = this.getContractInstance(this.interportGenesisAddress);
    const approved = await contract.getApproved(tokenId);

    return approved;
  }
}

/**
 * NFT Buyer
 */
export class NFTBuyerService extends BaseService<NFTBuyer> {
  readonly erc20Service: IERC20ServiceInterface;

  nftBuyerAddress: string;

  constructor(provider: providers.Provider, nftBuyerAddress: string) {
    super(provider, NFTBuyer__factory);
    this.nftBuyerAddress = nftBuyerAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  /**
   * Redeem tokens
   *
   * @param user
   * @param collectionAddress
   * @param tokenIds
   * @returns
   */
  public redeem(
    user: string,
    collectionAddress: string,
    tokenIds: BigNumber[]
  ): () => Promise<transactionType> {
    const contract: NFTBuyer = this.getContractInstance(this.nftBuyerAddress);

    return this.generateTxCallback({
      rawTxMethod: () => contract.populateTransaction.redeem(collectionAddress, tokenIds),
      from: user,
    });
  }
}
