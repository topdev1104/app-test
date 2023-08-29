import React, { useEffect, useState } from 'react';
import SelectField from '../../components/fields/SelectField';
import staticStyles from './style';
import checkboxDone from '../../images/checkboxDone.svg';
import checkbox from '../../images/checkbox.svg';
import arrow from '../../images/back-arrow.svg';
import tokenUwu from '../../images/tokenUwu.svg';
import arrowDropDown from '../../images/arrowDropDown.svg';
import ethCurrency from '../../images/nft/ethCurrency.svg';
import { useUserWalletDataContext } from '../../libs/web3-data-provider';
import { mainet } from '../../ui-config/markets/tokensConfig';
import { networkConfigs } from '../../ui-config/networks';
import { ChainId } from '@aave/contract-helpers';
import { useProtocolDataContext } from '../../libs/protocol-data-provider';
import { BigNumber, ethers, providers } from 'ethers';
import { InterportGenesis__factory } from '../../libs/aave-protocol-js/InterportGenesis/typechain/factories/contracts';
import { getProvider } from '../../helpers/config/markets-and-network-config';
import {
  InterportGenesisService,
  NFTBuyerService,
} from '../../libs/aave-protocol-js/InterportGenesis';
import { EthTransactionData, sendEthTransaction } from '../../helpers/send-ethereum-tx';
import { useWeb3React } from '@web3-react/core';
import { NFTHelper } from '../../libs/aave-protocol-js/NFT';
import { resolve } from 'path';
import { useUwuProviderContext } from '../../libs/uwu-provider/UwuProvider';

interface NFTItem {
  img: string;
  name: string;
  price: number;
  tokenId: number;
  ownerOf: string;
  approved: string;
}

interface Collection {
  name: string;
  address: string;
  price: string;
  items: Array<NFTItem>;
}

export default function NFT() {
  const { chainId: currentChainId, currentMarketData } = useProtocolDataContext();

  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectCollection, setSelectCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>();
  const [selectedItems, setSelectedItems] = useState<Array<NFTItem>>([]);
  const {
    currentAccount,
    disconnectWallet,
    displaySwitchAccountModal,
    currentProviderName,
    availableAccounts,
  } = useUserWalletDataContext();
  const [disabledApprove, setDisabledApprove] = useState(false);
  const [disabledRedeem, setDisabledRedeem] = useState(false);
  const [startedApprove, setStartedApprove] = useState(false);
  const [startedRedeem, setStartedRedeem] = useState(false);
  const [txData, setTxData] = useState({} as EthTransactionData);
  const { provider: uwuProvider } = useUwuProviderContext();

  useEffect(() => {
    const promise = new Promise((resolve: any, reject: any) => {
      const contract = new NFTHelper(uwuProvider, '0x508179E11D9e655318353AddA8103702e886B795');
      contract.fetchAll().then((res) => {
        resolve(res);
      });
    });
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setDisabledRedeem(false);
    } else {
      setDisabledRedeem(true);
    }
  }, [selectedItems]);

  // useEffect(() => {

  // }, [selectCollection?.items])

  useEffect(() => {
    console.log('txData', txData);
    if (!txData.txStatus || (txData.txStatus && txData.txStatus === 'confirmed')) {
      const fetchAllNft = async () => {
        const contract = new NFTHelper(uwuProvider, '0x508179E11D9e655318353AddA8103702e886B795');
        return await contract.fetchAll();
      };

      fetchAllNft().then((nftItems) => {
        fetch(`${networkConfigs[currentChainId].nftApiUrl}collections`)
          .then((response) => {
            return response.json();
          })
          .then((data: string[]) => {
            const _collections: Collection[] = data.map((item: any, index) => {
              const nftOwnerItems = nftItems.filter((item: any) => item.ownerOf === currentAccount);

              const ownerItems = nftOwnerItems.map((nftOwnerItem) => {
                const tokenId = nftOwnerItem.tokenId.toString();
                const nftItem: NFTItem = item.items.find((item: any) => item.tokenId == tokenId);

                nftItem.approved = nftOwnerItem.approved;
                nftItem.ownerOf = nftOwnerItem.ownerOf;

                return nftItem;
              });

              const _collection = mainet.NFTCollections.find(
                (collection) => collection.token === item.address
              );

              return {
                name: _collection ? _collection.name : '-',
                address: item.address,
                price: item.price,
                items: [...ownerItems],
              };
            });

            setCollections(_collections);
            setSelectCollection(_collections[0]);
          })
          .catch((err) => console.log('err', err));
      });
    }
  }, [txData]);

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleHideOptions = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  const handleSelectCollection = (item: Collection | null) => {
    setShowOptions(!showOptions);
    setSelectCollection(item);
  };

  const toggleSelectItem = async (e: any, tokenId: number, approved: string) => {
    console.log('tokenId', tokenId);

    if (approved !== '0x0000000000000000000000000000000000000000' && approved !== 'wait token') {
      const selectItem = selectCollection?.items.find((item) => item.tokenId === tokenId);

      if (
        !e.currentTarget.classList.contains('NFTContainer__list-cards__row__card-selected') &&
        selectCollection
      ) {
        e.currentTarget.classList.add('NFTContainer__list-cards__row__card-selected');
        const _selectedItems = [...selectedItems];
        if (selectItem) {
          _selectedItems.push(selectItem);
          setSelectedItems(_selectedItems);
          // selectItem.tokenId
        }
      } else {
        e.currentTarget.classList.remove('NFTContainer__list-cards__row__card-selected');
        if (selectCollection) {
          const _selectedItems = [...selectedItems];
          const index = _selectedItems.findIndex((item) => item.tokenId === tokenId);

          if (index !== -1) {
            _selectedItems.splice(index, 1);
            setSelectedItems(_selectedItems);
          }
        }
      }
    }
    //checkApprove()
  };

  const handleApprove = async (tokenId: number, approved: string) => {
    if (selectCollection && approved === '0x0000000000000000000000000000000000000000') {
      const nftService = new InterportGenesisService(uwuProvider, selectCollection?.address);

      const tx = await nftService.approve(currentAccount, mainet.NFTBuyer, BigNumber.from(tokenId));

      sendEthTransaction(tx, provider, setTxData, null, {
        onConfirmation: () => {
          console.log('success approve transaction');
          // fetch('http://localhost:3001/approve', {
          //   method: 'POST',
          //   headers: {
          //     'Accept': 'application/json',
          //     'Content-Type': 'application/json'
          //   },
          //   body: {}
          // })
        },
        onExecution: (txHash) => {
          console.log('execution');
          console.log('txHash', txHash);
        },
      });
    }
  };

  const handleRedeem = async () => {
    if (selectCollection && !disabledRedeem) {
      setDisabledRedeem(true);
      setStartedRedeem(true);
      const selectedTokens = selectedItems.map((item) => BigNumber.from(item.tokenId));

      console.log('selectedTokens', selectedTokens);
      const nftBuyerService = new NFTBuyerService(uwuProvider, mainet.NFTBuyer);
      const tx = await nftBuyerService.redeem(
        currentAccount,
        selectCollection?.address,
        selectedTokens
      );

      sendEthTransaction(tx, provider, setTxData, null, {
        onConfirmation: () => {
          console.log('success');
          setDisabledRedeem(false);
          setStartedRedeem(false);
        },
      });
    }
  };

  return (
    <div onClick={handleHideOptions}>
      <div>
        <h1
          style={{
            fontWeight: 600,
            fontSize: 39,
            color: 'white',
            padding: '0px 40px',
          }}
        >
          NFT collections
        </h1>
      </div>
      <div className="NFTContainer">
        <div className="NFTContainer__list">
          <div>
            <div className="NFTContainer__select-collection">
              {/* <div className="NFTContainer__select-collection__label">Select Collection:</div> */}
              <div className="dropdown">
                <button className="dropdown__button" type="button" onClick={handleShowOptions}>
                  {selectCollection ? selectCollection?.name : 'Select collection'}{' '}
                  <img src={arrowDropDown} alt="arrowDropDown" />
                </button>
                <ul
                  className="dropdown__list"
                  style={{
                    visibility: showOptions ? 'visible' : 'hidden',
                    opacity: showOptions ? 1 : 0,
                  }}
                >
                  <li className="dropdown__list-item">Select collection</li>
                  {collections &&
                    collections.map((item, index) => {
                      return (
                        <li
                          key={`collection-${index}`}
                          className="dropdown__list-item"
                          onClick={() => handleSelectCollection(item)}
                        >
                          {item.name}
                        </li>
                      );
                    })}
                </ul>
                <input className="dropdown__input_hidden" type="text" name="select-category" />
              </div>
            </div>
          </div>
          <div>
            <div className="NFTContainer__collection-name">
              <h2>Collection Name</h2>
              <p>
                Selected {selectedItems?.length} of {selectCollection?.items.length}
              </p>
            </div>
            <div className="NFTContainer__list-cards">
              <div className="NFTContainer__list-cards__row">
                {selectCollection?.items.map((item, index) => {
                  return (
                    <div
                      key={`image-nft-${index}`}
                      className={['NFTContainer__list-cards__row__card'].join(' ')}
                      onClick={(e) => toggleSelectItem(e, item.tokenId, item.approved)}
                    >
                      <div className="NFTContainer__list-cards__row__card__image">
                        <img
                          src={`${networkConfigs[currentChainId].nftApiUrl}preview/${selectCollection?.address}/${item.tokenId}`}
                        ></img>
                      </div>
                      <div className="NFTContainer__list-cards__row__card__description">
                        <div className="NFTContainer__list-cards__row__card__collectionName">
                          {selectCollection?.name}
                        </div>
                        <div className="NFTContainer__list-cards__row__card__title">
                          {item.name}
                        </div>
                        <div className="NFTContainer__list-cards__row__card__container">
                          <div className="NFTContainer__list-cards__row__card__container-left">
                            <div className="NFTContainer__list-cards__row__card__container-left__tokenIcon">
                              <img src={tokenUwu} alt="tokenUwu" />
                            </div>
                            <div className="NFTContainer__list-cards__row__card__container-left__price">
                              {selectCollection.price}
                            </div>
                            <div>UwU</div>
                          </div>
                          <div
                            className="NFTContainer__list-cards__row__card__container-left__button"
                            onClick={(e) => toggleSelectItem(e, item.tokenId, item.approved)}
                          ></div>
                        </div>
                        <div
                          className={[
                            'NFTButtons__approve',
                            item.approved !== '0x0000000000000000000000000000000000000000' &&
                              'NFTButtons__disabled',
                            txData.loading && 'NFTButtons__disabled',
                          ].join(' ')}
                          onClick={() => handleApprove(item.tokenId, item.approved)}
                        >
                          Approve
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="NFTContainer__total">
          <p style={{ marginBottom: 16, fontSize: 23, fontWeight: 600, textAlign: 'center' }}>
            Redeem
          </p>
          <p
            style={{
              marginBottom: 32,
              fontSize: 16,
              fontWeight: 400,
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            You can reedem UwU tokens for your NFTs
          </p>
          <div className="NFTContainer__total__uwuGet">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={tokenUwu} alt="tokenUwu" />
              <p style={{ marginLeft: 8, fontSize: '16px', fontWeight: 400 }}>UwU you get</p>
            </div>
            <p style={{ fontSize: '18px', fontWeight: 400 }}>
              {selectCollection &&
                ethers.BigNumber.from(selectCollection.price).mul(selectedItems.length).toString()}
            </p>
          </div>

          <div className="NFTContainer__total__nfts">
            <div>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <p style={{ fontSize: '14px', fontWeight: 400 }}>Total NTFs to redeem</p>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>{selectedItems.length}</p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 16,
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 400 }}>Price per NFT</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={tokenUwu} alt="tokenUwu" />
                <p style={{ marginLeft: 8, fontSize: '14px', fontWeight: 400 }}>
                  {selectCollection?.price} UwU
                </p>
              </div>
            </div>
          </div>

          <div className="NFTButtons">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {startedRedeem && <span className="NFTButtons__loader"></span>}
              <div
                className={['NFTButtons__redeem', disabledRedeem && 'NFTButtons__disabled'].join(
                  ' '
                )}
                onClick={handleRedeem}
              >
                Redeem
              </div>
            </div>
          </div>
        </div>
        <style jsx={true} global={true}>
          {staticStyles}
        </style>
      </div>
    </div>
  );
}
