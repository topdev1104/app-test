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

interface ClaimableRewardsTableProps {
  rerender?: number;
  tokenPrices: [
    {
      symbol?: string;
      rToken?: string;
      price?: number;
    }
  ];
}

interface ClaimableRewardCell {
  symbol: string;
  icon?: string;
  label: string;
  token: string;
  amount: string;
  usdVal: string;
}

export function ClaimableRewardsTable({
  rerender = 0.01,
  tokenPrices = [{}],
}: ClaimableRewardsTableProps) {
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
  const [claimableRewardsRows, setClaimableRewardsRows] =
    useState<Array<Array<ClaimableRewardCell>>>();
  const [totalFees, setTotalFees] = useState<any>(0);

  if (!user) {
    return null;
  }

  let tokPrices: any = {};
  tokenPrices.map((tok: any) => {
    tokPrices[tok.symbol] = tok.price;
    return null;
  });

  tokPrices['UWU'] = prices.tokenPrice;

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

      const rewards: { tokSymbol?: string; token: string; amount: BigNumber; usdVal: BigNumber }[] =
        [];

      if (tokenPrices.length && tokPrices['UWU']) {
        _rewards.forEach(({ token, amount }, i) => {
          const isUwuToken = token === currentMarketData.addresses.UWU_TOKEN;
          const reserveToken = tokenPrices.find(({ rToken }) => rToken === token);

          let tokSymbol = isUwuToken ? 'UWU' : reserveToken ? reserveToken.symbol : '';

          if (tokSymbol?.toUpperCase() !== 'MIM') {
            if (tokSymbol && tokSymbol === 'UWU') {
              const usdVale = BigNumber(amount)
                .multipliedBy(BigNumber(tokPrices[tokSymbol]))
                .div(10 ** 8);
              rewards.push({
                tokSymbol,
                token,
                amount: BigNumber(amount),
                usdVal: usdVale,
              });
            } else if (tokSymbol) {
              const usdVal = BigNumber(amount).multipliedBy(BigNumber(tokPrices[tokSymbol]));
              rewards.push({
                tokSymbol,
                token,
                amount: BigNumber(amount),
                usdVal: usdVal,
              });
            }
          }
        });

        if (rewards.length > 0) {
          let fees = BigNumber(0);
          for (const tok of rewards) {
            fees = fees.plus(tok.usdVal);
          }

          const rows: Array<Array<ClaimableRewardCell>> = [];
          for (let a = 0; a < rewards.length; a++) {
            const row: Array<ClaimableRewardCell> = [];

            for (let i = 0; i < 5; i++) {
              if (a < rewards.length) {
                const reward = rewards[a];
                let symbol = reward.tokSymbol;
                let symbolLabel = reward.tokSymbol ?? '';

                // SIFU OLD
                if (reward.token === '0x02738ef3f8d8D3161DBBEDbda25574154c560dAe') {
                  symbol = 'SIFU_OLD';
                  symbolLabel = 'SIFU (old)';
                }

                const assetInfo = getAssetInfo(symbol ?? '');

                row.push({
                  symbol: symbolLabel,
                  icon: assetInfo.icon,
                  label: rewards[a].usdVal.toString(),
                  token: rewards[a].token,
                  amount: rewards[a].amount.toString(),
                  usdVal: rewards[a].usdVal.toString(),
                });

                if (i < 4) {
                  a++;
                }
              }
            }

            if (row.length < 5) {
              const emptyItems = 5 - row.length;

              for (let i = 0; i < emptyItems; i++) {
                row.push({
                  symbol: '',
                  icon: '',
                  label: '',
                  token: '',
                  amount: '',
                  usdVal: '',
                });
              }
            }

            rows.push(row);
          }

          setClaimableRewardsRows(rows);
          setClaimableRewards(rewards);
          setTotalFees(fees);
        }
      }
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

  return (
    <>
      <div className="Table Table__ClaimableRewards">
        {claimableRewards.length === 0 ? (
          <div className="spin-content">
            <SpinLoader color="yellow" />
          </div>
        ) : (
          <>
            {totalFees && totalFees.gt(0) ? (
              <>
                <div
                  className="ClaimbelRewardsList__content__list-items"
                  style={{ color: 'white' }}
                >
                  {claimableRewardsRows?.map((row, rowIndex) => {
                    return (
                      <div
                        key={`claim-row-${rowIndex}`}
                        className={`ClaimbelRewardsList__row ${
                          rowIndex === 1 ? 'ClaimbelRewardsList__row-center' : ''
                        }`}
                      >
                        {row.map((cell, cellIndex) => {
                          if (cell.symbol !== '' && Number(cell.usdVal).toFixed(2) !== '0.00') {
                            return (
                              <div
                                key={`claim-row-cell-${rowIndex}-${cellIndex}`}
                                className="ClaimbelRewardsList__row__cell"
                              >
                                <div className="ClaimbelRewardsList__row__cell-symbol">
                                  <img
                                    src={cell.icon}
                                    alt={cell.symbol}
                                    className="ClaimbelRewardsList__row__cell__icon"
                                  />
                                  <div className="ClaimbelRewardsList__row__cell__label">
                                    {cell.symbol.toUpperCase()}
                                  </div>
                                </div>
                                <div className="ClaimbelRewardsList__row__cell-value">
                                  <div className="ClaimbelRewardsList__row__cell-value__amount">
                                    {Number(cell.amount).toFixed(2)}
                                  </div>
                                  <div className="ClaimbelRewardsList__row__cell-value__amount-in-usd">
                                    $ {Number(cell.usdVal).toFixed(2)}
                                  </div>
                                </div>
                                <div className="ClaimbelRewardsList__row__cell-button">
                                  <DefaultButton
                                    className="ClaimbelRewardsList__claim-button"
                                    title={'Claim'}
                                    onClick={async (event) => {
                                      event.stopPropagation();
                                      event.preventDefault();

                                      if (
                                        currentMarketData.addresses.UWU_TOKEN &&
                                        currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
                                      ) {
                                        const multiFeeDistributionService =
                                          new MultiFeeDistributionService(
                                            uwuProvider,
                                            currentMarketData.addresses.UWU_TOKEN,
                                            version === 'v2'
                                              ? currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
                                              : currentMarketData.addresses
                                                  .MULTI_FEE_DISTRIBUTION_V1
                                          );
                                        const txGetter =
                                          await multiFeeDistributionService.getReward(user.id, [
                                            cell.token,
                                          ]);

                                        return sendEthTransaction(
                                          txGetter,
                                          provider,
                                          () => {},
                                          null,
                                          {
                                            onConfirmation: () => {
                                              setStatsRerender(Math.random());
                                            },
                                          }
                                        );
                                      } else {
                                        throw new Error(
                                          'please set UWU_TOKEN and MULTI_FEE_DISTRIBUTION'
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className="ClaimbelRewardsList__footer">
                  {/* total fess  */}
                  <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                    <div className="ClaimbelRewardsList__footer__fees">
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
                      className="ClaimbelRewardsList__footer__buttonClaim"
                      title="Claim All"
                      disabled={!claimableRewards.some(({ amount }) => amount.gt(0))}
                      onClick={async (event) => {
                        event.stopPropagation();
                        event.preventDefault();

                        if (
                          currentMarketData.addresses.UWU_TOKEN &&
                          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
                        ) {
                          const multiFeeDistributionService = new MultiFeeDistributionService(
                            uwuProvider,
                            currentMarketData.addresses.UWU_TOKEN,
                            version === 'v2'
                              ? currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
                              : currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V1
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
            ) : (
              <div></div>
            )}
          </>
        )}
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
