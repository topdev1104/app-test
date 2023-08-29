import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { SpinLoader, getAssetInfo } from '../../../../libs/aave-ui-kit';
import { sendEthTransaction } from '../../../../helpers/send-ethereum-tx';
import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import useUwuPrices from '../../../../libs/aave-protocol-js/hooks/use-uwu-prices';
import { MultiFeeDistributionService } from '../../../../libs/aave-protocol-js/MulteFeeDistributionContract';
import { useRdntBalanceContext } from '../../../../libs/wallet-balance-provider/RdntBalanceProvider';
import DefaultButton from '../../../../components/basic/DefaultButton';
import staticStyles from './style';
import BigNumber from 'bignumber.js';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

interface TokenPrice {
  symbol: string;
  rToken: string;
  price: string;
  decimals: string;
}

interface MobileClaimableRewardsTableProps {
  rerender?: number;
  tokenPrices: TokenPrice[];
}

interface ClaimableRewardCell {
  symbol: string;
  icon: string;
  label: string;
  token: string;
  amount: string;
  usdVal: string;
}

export function MobileClaimableRewardsTable({
  rerender = 0.01,
  tokenPrices = [],
}: MobileClaimableRewardsTableProps) {
  const intl = useIntl();
  const { chainId, currentMarketData } = useProtocolDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { user } = useDynamicPoolDataContext();
  const { prices } = useUwuPrices();
  const { refetch } = useRdntBalanceContext();
  const { provider: uwuProvider } = useUwuProviderContext();
  const version = window.localStorage.getItem('version') ?? 'v2';

  const [statsRerender, setStatsRerender] = useState<Number>(0);
  const [claimableRewards, setClaimableRewards] = useState<
    {
      [x: string]: any;
      tokSymbol?: string;
      token: string;
      amount: BigNumber;
      usdVal: BigNumber;
    }[]
  >([]);
  const [claimableRewardCells, setClaimableRewardCells] = useState<ClaimableRewardCell[]>([]);
  const [totalFees, setTotalFees] = useState<any>(0);

  if (!user) {
    return null;
  }

  //console.log('tok price', tokPrices);
  // tokPrices['UWU'] = prices.tokenPrice;

  // console.log('prices.tokenPrice', prices.tokenPrice);

  BigNumber.config({ EXPONENTIAL_AT: 40 });
  const queryClaimableRewards = useCallback(async () => {
    if (
      currentMarketData.addresses.UWU_TOKEN &&
      currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
    ) {
      let multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;

      switch (version) {
        case 'v1':
          multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V1;
          break;
        case 'v2':
          multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;
          break;
        case 'v3':
          multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3;
          break;
      }

      const multiFeeDistribution = new MultiFeeDistributionService(
        uwuProvider,
        currentMarketData.addresses.UWU_TOKEN,
        multiFeeDistributionAddress
      );
      const _rewards = await multiFeeDistribution.claimableRewards(user.id);

      let _totalFees = BigNumber(0);
      const claimableRewardCells: ClaimableRewardCell[] = tokenPrices.map((item) => {
        const _rewardIndex = _rewards.findIndex(
          (_reward) => _reward.token.toLowerCase() === item.rToken?.toLowerCase()
        );
        const _amount = BigNumber(_rewards[_rewardIndex]?.amount ?? 0);
        const _price = BigNumber(item.price);
        const assetInfo = getAssetInfo(item.symbol);

        const usdVal = _price.multipliedBy(_amount).toNumber();
        _totalFees = _totalFees.plus(usdVal);
        return {
          symbol: item.symbol,
          icon: assetInfo.icon ?? '',
          label: _price.multipliedBy(_amount).toString(),
          token: _rewards[_rewardIndex]?.token,
          amount: _amount.toString(),
          usdVal: usdVal.toFixed(2).toString(),
        };
      });

      setClaimableRewardCells(claimableRewardCells);
      setTotalFees(_totalFees);
    } else {
      throw new Error('please set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
    }

    if (refetch) {
      refetch();
    }
  }, [tokenPrices, prices, refetch]);

  useEffect(() => {
    queryClaimableRewards();
  }, [statsRerender, tokenPrices, prices]);

  // console.log('claimableRewards', claimableRewards)

  return (
    <>
      <div className="Table Table__MobileClaimableRewards">
        <h3 className="MobileClaimbelRewardsList__title">Your Platform Revenue</h3>

        {claimableRewardCells.length === 0 ? (
          <div className="spin-content">
            <SpinLoader color="yellow" />
          </div>
        ) : (
          <>
            {totalFees && totalFees.gt(0) && (
              <>
                <div
                  className="MobileClaimbelRewardsList__content__list-items"
                  style={{ color: 'white' }}
                >
                  {claimableRewardCells?.map((cell, cellIndex) => {
                    if (cell.symbol !== '' && Number(cell.usdVal).toFixed(2) !== '0.00') {
                      return (
                        <div
                          key={`claim-row-cell-${cellIndex}`}
                          className="MobileClaimbelRewardsList__row"
                        >
                          <div className="MobileClaimbelRewardsList__row__cell">
                            <div className="MobileClaimbelRewardsList__row__cell-symbol">
                              <img
                                src={cell.icon}
                                alt={cell.symbol}
                                className="MobileClaimbelRewardsList__row__cell__icon"
                              />
                              <div className="MobileClaimbelRewardsList__row__cell__label">
                                {cell.symbol.toUpperCase()}
                              </div>
                            </div>
                            <div className="MobileClaimbelRewardsList__row__cell-value">
                              <div className="MobileClaimbelRewardsList__row__cell-value__amount">
                                {Number(cell.amount).toFixed(2)}
                              </div>
                              <div className="MobileClaimbelRewardsList__row__cell-value__amount-in-usd">
                                $ {Number(cell.usdVal).toFixed(2)}
                              </div>
                            </div>
                            <div className="MobileClaimbelRewardsList__row__cell-button">
                              <DefaultButton
                                className="MobileClaimbelRewardsList__claim-button"
                                title={'Claim'}
                                onClick={async (event) => {
                                  event.stopPropagation();
                                  event.preventDefault();

                                  if (
                                    currentMarketData.addresses.UWU_TOKEN &&
                                    currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
                                  ) {
                                    let multiFeeDistributionAddress =
                                      currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;

                                    switch (version) {
                                      case 'v1':
                                        multiFeeDistributionAddress =
                                          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V1;
                                        break;
                                      case 'v2':
                                        multiFeeDistributionAddress =
                                          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;
                                        break;
                                      case 'v3':
                                        multiFeeDistributionAddress =
                                          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3;
                                        break;
                                    }

                                    const multiFeeDistributionService =
                                      new MultiFeeDistributionService(
                                        uwuProvider,
                                        currentMarketData.addresses.UWU_TOKEN,
                                        multiFeeDistributionAddress
                                      );
                                    const txGetter = await multiFeeDistributionService.getReward(
                                      user.id,
                                      [cell.token]
                                    );

                                    return sendEthTransaction(txGetter, provider, () => {}, null, {
                                      onConfirmation: () => {
                                        setStatsRerender(Math.random());
                                      },
                                    });
                                  } else {
                                    throw new Error(
                                      'please set UWU_TOKEN and MULTI_FEE_DISTRIBUTION'
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="MobileClaimbelRewardsList__footer">
                  {/* total fess  */}
                  <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                    <div className="MobileClaimbelRewardsList__footer__fees">
                      Total Fees
                      <span>
                        $
                        {intl.formatNumber(totalFees, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <DefaultButton
                      className="MobileClaimbelRewardsList__footer__buttonClaim"
                      title="Claim All"
                      disabled={totalFees ? !totalFees.gt(0) : true}
                      onClick={async (event) => {
                        event.stopPropagation();
                        event.preventDefault();

                        if (
                          currentMarketData.addresses.UWU_TOKEN &&
                          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
                        ) {
                          let multiFeeDistributionAddress =
                            currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;

                          switch (version) {
                            case 'v1':
                              multiFeeDistributionAddress =
                                currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V1;
                              break;
                            case 'v2':
                              multiFeeDistributionAddress =
                                currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;
                              break;
                            case 'v3':
                              multiFeeDistributionAddress =
                                currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3;
                              break;
                          }

                          const multiFeeDistributionService = new MultiFeeDistributionService(
                            uwuProvider,
                            currentMarketData.addresses.UWU_TOKEN,
                            multiFeeDistributionAddress
                          );
                          const txGetter = await multiFeeDistributionService.getReward(
                            user.id,
                            claimableRewards.map(({ token }) => token)
                          );

                          return sendEthTransaction(txGetter, provider, () => {}, null, {
                            onConfirmation: () => {
                              setStatsRerender(Math.random());
                            },
                          });
                        } else {
                          throw new Error('please set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
                        }
                      }}
                      size={'small'}
                    />
                  </div>
                </div>
              </>
            )}

            {totalFees && totalFees.eq(0) && <div>No fees yet</div>}
          </>
        )}
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
