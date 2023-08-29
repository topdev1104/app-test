import { useEffect, useState, useCallback, ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import {
  FeeAmount,
  Pool,
  SqrtPriceMath,
  TickMath,
  encodeSqrtRatioX96,
  Position,
} from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import depositConfirmationMessages from '../../../../modules/deposit/screens/DepositConfirmation/messages';
import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import useRdntTokenStats from '../../../../libs/aave-protocol-js/hooks/use-rdnt-token-stats';
import { GeistTokenContract } from '../../../../libs/aave-protocol-js/GeistTokenContract';
import useRdntTokenStakingRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-token-staking-rewards';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { MultiFeeDistributionService } from '../../../../libs/aave-protocol-js/MulteFeeDistributionContract';
import { useRdntBalanceContext } from '../../../../libs/wallet-balance-provider/RdntBalanceProvider';
import useUwuPrices from '../../../../libs/aave-protocol-js/hooks/use-uwu-prices';
import useVestHandler from '../../../../modules/dashboard/components/RdntTableItem/useVestHandler';
import Value from '../../../../components/basic/Value';
import ButtonTabs from '../../../../components/basic/ButtonTabs';
import NoDataPanel from '../../../../components/NoDataPanel';
import GradientLine from '../../../../components/basic/GradientLine';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import DefaultButton from '../../../../components/basic/DefaultButton';
import { CompactNumber } from '../../../../components/basic/CompactNumber';
import ContentWrapperWithTopLine from '../../../../components/wrappers/ContentWrapperWithTopLine';
import { Table } from '../../components/Table';
import { TopStats } from '../../components/TopStats';
import ContentItemLock from '../../components/ContentItemLock';
import ContentItemAllLock from '../../components/ContentItemAllLock';
import { ClaimableRewardsTable } from '../../components/ClaimableRewardsTable';
import ContentItem from '../../components/ContentItem';
import { sendEthTransaction } from '../../../../helpers/send-ethereum-tx';
import messages from './messages';
import staticStyles from './style';
import { MultiFeeDistributionV2Service } from '../../../../libs/aave-protocol-js/MulteFeeDistributionV2Contract';

import { ValidationWrapperComponentProps } from '../../../../components/RouteParamsValidationWrapper';
import AccordionFooterLockAndVesting from '../../components/AccordionFooterLockandVesting';
import Accordion from '../../../../components/Accordion';
import VersionSwitcher from '../../../../components/VersionSwitcher';
import SystemIcon from '../../../../components/SystemIcon/SystemIcon';
import { MobileClaimableRewardsTable } from '../../components/MobileClaimableRewardsTable';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';
import { Avatar, Button, List } from 'antd';
import {
  NonfungiblePositionManager,
  NonfungiblePositionManager__factory,
  PoolInitializer,
  PoolInitializer__factory,
} from '../../../../libs/aave-protocol-js/V3Periphery/typechain';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import { MultiFeeDistributionUNIV3POS__factory } from '../../../../libs/aave-protocol-js/MultiFeeDistributionV3Contract/typechain/MultiFeeDistributionUNIV3POS__factory';
import { MultiFeeDistributionUNIV3POS } from '../../../../libs/aave-protocol-js/MultiFeeDistributionV3Contract/typechain/MultiFeeDistributionUNIV3POS';

const claimableRewardRerender = Math.random();
const priceInMarketReferenceCurrency = 0;

const VEST_TABS = ['Ready to Vest', 'Current Vesting', 'Vested'];

export function ManageUwuMain({ poolReserve }: ValidationWrapperComponentProps) {
  const intl = useIntl();
  const version = window.localStorage.getItem('version') ?? 'v2';

  const { currentAccount } = useUserWalletDataContext();

  const { chainId, currentMarketData } = useProtocolDataContext();
  const { user } = useDynamicPoolDataContext();
  const { provider: uwuProvider } = useUwuProviderContext();

  if (!user) {
    return (
      <NoDataPanel
        title={intl.formatMessage(depositConfirmationMessages.connectWallet)}
        description={intl.formatMessage(depositConfirmationMessages.connectWalletDescription)}
        withConnectButton={true}
      />
    );
  }

  const { lockingApr, platformStats, tokenPrices, projectedFeesPerYear } =
    useRdntTokenStakingRewards();
  const { tokenStats } = useRdntTokenStats();
  const { prices } = useUwuPrices();
  const vestHandler = useVestHandler();
  const { availableForVesting } = useRdntBalanceContext();

  const [tokenInfo, setTokenInfo] = useState<{
    walletBalance: BigNumber;
    currencySymbol: string;
    totalSupply: BigNumber;
  }>({
    walletBalance: valueToBigNumber(0),
    currencySymbol: 'SLP',
    totalSupply: valueToBigNumber(0),
  });
  const [locked, setLocked] = useState<BigNumber>(valueToBigNumber(0));
  const [lockedBalancesUserV2, setLockedBalancesUserV2] = useState<any>(valueToBigNumber(0));
  const [lockedSupply, setLockedSupply] = useState<any>(valueToBigNumber(0));
  const [lockedSupplyV2, setLockedSupplyV2] = useState<any>(valueToBigNumber(0));
  const [unlockable, setUnlockable] = useState<BigNumber>(valueToBigNumber(0));
  const [penalty, setPenalty] = useState<BigNumber>(valueToBigNumber(0));
  const [staked, setStaked] = useState<BigNumber>(valueToBigNumber(0));
  const [total, setTotal] = useState<BigNumber>(valueToBigNumber(0));
  const [earned, setEarned] = useState<BigNumber>(valueToBigNumber(0));
  const [lockedTable, setLockedTable] = useState<{ amount: string; expiryDate: Date }[]>([]);
  const [earnedTable, setEarnedTable] = useState<{ amount: string; expiryDate: Date }[]>([]);
  const [userShares, setUserShares] = useState<{ locking: number; staking: number }>({
    locking: 0,
    staking: 0,
  });
  const [userRevenue, setUserRevenue] =
    useState<{ total: number; platform: number; penalty: number }>();
  const [statsRerender, setStatsRerender] = useState<Number>(0);
  const [vestTab, setVestTab] = useState<string>(VEST_TABS[0]);
  const [nfts, setNfts] = useState<any>([]);
  const [nftsLock, setNftsLock] = useState<any>([]);
  const [depositLoading, setDepositLoading] = useState<boolean>(false);

  useEffect(() => {
    const nonfungiblePosition = NonfungiblePositionManager__factory.connect(
      currentMarketData.addresses.NONFUNGIBLE_POSITION_MANAGER,
      uwuProvider
    );

    const fetchData = async () => {
      const balance = (await nonfungiblePosition.balanceOf(currentAccount)).toNumber();
      const nftIds = [];
      const fee = FeeAmount.MEDIUM;

      for (let i = 0; i < balance; i++) {
        const nftId = (await nonfungiblePosition.tokenOfOwnerByIndex(currentAccount, i)).toNumber();
        const positions = await nonfungiblePosition.positions(nftId);
        const tokenURI = await nonfungiblePosition.tokenURI(nftId);
        const amount0 = SqrtPriceMath.getAmount0Delta(
          TickMath.getSqrtRatioAtTick(positions.tickLower),
          TickMath.getSqrtRatioAtTick(positions.tickUpper),
          JSBI.BigInt(positions.liquidity.toString()),
          false
        );

        const base64Data = tokenURI.split(',')[1];
        const decodeData = atob(base64Data);

        const approved = await nonfungiblePosition.getApproved(nftId);

        nftIds.push({
          id: nftId,
          amount0: amount0.toString(),
          amount1: amount0.toString(),
          uri: tokenURI.toString(),
          meta: JSON.parse(decodeData),
          selected: false,
          approved: approved == currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3,
        });
      }

      setNfts(nftIds);
    };

    const fetchLockData = async () => {
      const multiFeeDistribution: MultiFeeDistributionUNIV3POS =
        MultiFeeDistributionUNIV3POS__factory.connect(
          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3,
          uwuProvider.getSigner()
        );
      const accountLockedNFTs = await multiFeeDistribution.accountLockedNFTs(currentAccount);

      const nftIds = [];
      for (let i = 0; i < accountLockedNFTs.length; i++) {
        const nftId = accountLockedNFTs[i][0].toString();
        const positions = await nonfungiblePosition.positions(nftId);
        const tokenURI = await nonfungiblePosition.tokenURI(nftId);
        const amount0 = SqrtPriceMath.getAmount0Delta(
          TickMath.getSqrtRatioAtTick(positions.tickLower),
          TickMath.getSqrtRatioAtTick(positions.tickUpper),
          JSBI.BigInt(positions.liquidity.toString()),
          false
        );

        const base64Data = tokenURI.split(',')[1];
        const decodeData = atob(base64Data);

        const approved = await nonfungiblePosition.getApproved(nftId);

        nftIds.push({
          id: nftId,
          amount0: amount0.toString(),
          amount1: amount0.toString(),
          uri: tokenURI.toString(),
          meta: JSON.parse(decodeData),
          selected: false,
        });
      }

      setNftsLock(nftIds);
    };

    fetchData();
    fetchLockData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
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

          const multiFeeDistributionService = new MultiFeeDistributionService(
            uwuProvider,
            currentMarketData.addresses.UWU_TOKEN,
            multiFeeDistributionAddress
          );

          const [lockedTable, earnedTable] = await Promise.all([
            multiFeeDistributionService.getLockedBalances(user.id),
            multiFeeDistributionService.getEarnedBalances(user.id),
          ]);

          setLockedTable(lockedTable);
          setEarnedTable(earnedTable);
        } else {
          throw new Error('Need set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [statsRerender]);

  useEffect(() => {
    (async () => {
      const lockingShareV2 = lockedBalancesUserV2.div(lockedSupplyV2);
      const stakingShareV2 = lockedBalancesUserV2.div(lockedSupplyV2);

      setUserShares({
        locking: lockingShareV2 * 100,
        staking: stakingShareV2 * 100,
      });
    })();
  }, [lockedSupplyV2]);

  useEffect(() => {
    (async () => {
      const dailyPenFees = (platformStats.penaltyFeesPerSecondUSD || 0) * 86400;
      const userDailyPenFees = dailyPenFees * ((userShares?.locking || 0) / 100);

      const userPlatFeesPerSec =
        (platformStats.platformFeesPerSecondUSD || 0) * ((userShares?.locking || 0) / 100);
      const userDailyPlatFees = userPlatFeesPerSec * 86400;

      const userTotalDailyRevenue = userDailyPlatFees + userDailyPenFees;

      const userRevPerDay = {
        total: userTotalDailyRevenue,
        platform: userDailyPlatFees,
        penalty: userDailyPenFees,
      };

      setUserRevenue(userRevPerDay);
    })();
  }, [platformStats, tokenStats, userShares, locked, earned, staked]);

  const queryTokenInfo = useCallback(async () => {
    try {
      if (currentMarketData.addresses.UWU_ETH_LP_TOKEN) {
        const contract = new GeistTokenContract(
          uwuProvider,
          currentMarketData.addresses.UWU_ETH_LP_TOKEN
        );
        const rdntInfo = await contract.getInfo(user.id);
        setTokenInfo(rdntInfo);
      } else {
        throw new Error('Need set UWU_TOKEN');
      }
    } catch (error) {
      console.log('queryTokenInfo: Error => ', error);
    }
  }, [user, chainId, currentMarketData, setTokenInfo]);

  const queryBalances = useCallback(async () => {
    try {
      if (
        currentMarketData.addresses.UWU_TOKEN &&
        currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
      ) {
        const version = window.localStorage.getItem('version') ?? 'v2';
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

        const multiFeeDistributionService = new MultiFeeDistributionService(
          uwuProvider,
          currentMarketData.addresses.UWU_TOKEN,
          multiFeeDistributionAddress
        );
        const multiFeeDistributionServiceV2 = new MultiFeeDistributionV2Service(
          uwuProvider,
          currentMarketData.addresses.UWU_TOKEN,
          currentMarketData.addresses.MULTI_FEE_DISTRIBUTION
        );

        if (version === 'v2') {
          const [
            lockedBal,
            unlockableBal,
            stakedBal,
            earnedBal,
            withdrawableBal,
            penaltyBal,
            totalBal,
          ] = await multiFeeDistributionServiceV2.getBalances(user.id);
          setLockedBalancesUserV2(valueToBigNumber(lockedBal.multipliedBy(10 ** 18).toString()));
          setTotal(totalBal);
          setLocked(lockedBal);
          // setLockedV2(lockedBalV2);
          setStaked(withdrawableBal.minus(penaltyBal));
          // setStakedV2(withdrawableBalV2.minus(penaltyBalV2));
          setUnlockable(unlockableBal);
          setPenalty(penaltyBal);
          // setPenaltyV2(penaltyBalV2);
          setEarned(earnedBal);

          setLockedSupply(
            valueToBigNumber(
              (await multiFeeDistributionServiceV2.getTotalLockedSupply()).toString()
            )
          );
          setLockedSupplyV2(
            valueToBigNumber(
              (await multiFeeDistributionServiceV2.getTotalLockedSupply()).toString()
            )
          );
        } else {
          const [
            lockedBal,
            unlockableBal,
            staledBalV2,
            earnedBal,
            withdrawableBal,
            penaltyBal,
            totalBal,
          ] = await multiFeeDistributionService.getBalances(user.id);
          setLockedBalancesUserV2(valueToBigNumber(lockedBal.multipliedBy(10 ** 18).toString()));
          setTotal(totalBal);
          setLocked(lockedBal);
          // setLockedV2(lockedBalV2);
          setStaked(withdrawableBal.minus(penaltyBal));
          // setStakedV2(withdrawableBalV2.minus(penaltyBalV2));
          setUnlockable(unlockableBal);
          setPenalty(penaltyBal);
          // setPenaltyV2(penaltyBalV2);
          setEarned(earnedBal);

          setLockedSupply(
            valueToBigNumber((await multiFeeDistributionService.getLockedSupply()).toString())
          );
          setLockedSupplyV2(
            valueToBigNumber(
              (await multiFeeDistributionServiceV2.getTotalLockedSupply()).toString()
            )
          );
        }

        // setEarnedV2(earnedBalV2);
      } else {
        throw new Error('Need set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    chainId,
    currentMarketData,
    setTotal,
    setLocked,
    setStaked,
    setUnlockable,
    setPenalty,
    setEarned,
  ]);

  useEffect(() => {
    queryTokenInfo();
    queryBalances();
  }, [statsRerender]);

  const unlockHandler = useCallback(async () => {
    const msg = `You are about to withdraw your LPs`;
    if (window.confirm(msg) === true) {
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

        const multiFeeDistributionService = new MultiFeeDistributionService(
          uwuProvider,
          currentMarketData.addresses.UWU_TOKEN,
          multiFeeDistributionAddress
        );

        const actionTx = await multiFeeDistributionService.withdrawExpiredLocks(user.id);
        return sendEthTransaction(actionTx, uwuProvider, () => {}, null, {
          onConfirmation: () => {
            setStatsRerender(Math.random());
          },
        });
      } else {
        throw new Error('Need set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
      }
    }
  }, [user, chainId, currentMarketData, uwuProvider, setStatsRerender]);

  const exitVestHandler = useCallback(async () => {
    const msg = `WARNING: You will take a ${Math.floor(Number(penalty))} UwU penalty.`;
    if (window.confirm(msg) === true) {
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

        const multiFeeDistributionService = new MultiFeeDistributionService(
          uwuProvider,
          currentMarketData.addresses.UWU_TOKEN,
          multiFeeDistributionAddress
        );

        const actionTx = await multiFeeDistributionService.exit(user.id);
        return sendEthTransaction(actionTx, uwuProvider, () => {}, null, {
          onConfirmation: () => {
            setStatsRerender(Math.random());
          },
        });
      } else {
        throw new Error('Need set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
      }
    }
  }, [user, chainId, currentMarketData, uwuProvider, setStatsRerender]);

  const withdrawVestHandler = useCallback(async () => {
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

      const multiFeeDistributionService = new MultiFeeDistributionService(
        uwuProvider,
        currentMarketData.addresses.UWU_TOKEN,
        multiFeeDistributionAddress
      );

      const actionTx = await multiFeeDistributionService.withdraw(user.id, staked.toString());
      const approveTxData = {
        txType: actionTx[0].txType,
        unsignedData: actionTx[0].tx,
        gas: actionTx[0].gas,
      };

      return sendEthTransaction(approveTxData.unsignedData, uwuProvider, () => {}, null, {
        onConfirmation: () => {
          setStatsRerender(Math.random());
        },
      });
    } else {
      throw new Error('Need set UWU_TOKEN and MULTI_FEE_DISTRIBUTION');
    }
  }, [user, chainId, currentMarketData, uwuProvider, staked, setStatsRerender]);

  const vestButtonHandler = useCallback(
    async (event) => {
      await vestHandler(event);
      setStatsRerender(Math.random());
    },
    [vestHandler]
  );

  const handleSelectNft = (id: any) => {
    const selectNftIndex = nfts.findIndex((item: any) => item.id == id);
    const _nfts = [...nfts];
    _nfts[selectNftIndex].selected = !_nfts[selectNftIndex].selected;

    setNfts(_nfts);
  };

  const loading = (nftId: number, loading: boolean) => {
    const nftIndex = nfts.findIndex((item: any) => item.id == nftId);
    const _nfts = [...nfts];
    _nfts[nftIndex].loading = loading;
    setNfts(_nfts);
  };

  const handleApproveNFT = async (nftId: number) => {
    const nonfungiblePosition = NonfungiblePositionManager__factory.connect(
      currentMarketData.addresses.NONFUNGIBLE_POSITION_MANAGER,
      uwuProvider.getSigner()
    );

    loading(nftId, true);

    await nonfungiblePosition
      .approve(currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3, nftId)
      .catch((err) => {
        loading(nftId, false);
      });
    loading(nftId, false);
  };

  const handleNftDeposit = async () => {
    const multiFeeDistribution: MultiFeeDistributionUNIV3POS =
      MultiFeeDistributionUNIV3POS__factory.connect(
        currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3,
        uwuProvider.getSigner()
      );

    const selectedNft = nfts.filter((nft: any) => nft.selected);

    const nftIds = selectedNft.map((nft: any) => Number(nft.id));
    //528665
    const gasLimit = await multiFeeDistribution.estimateGas.lock(nftIds);

    // await nonfungiblePosition.getApproved(Number(nft.id))
    await multiFeeDistribution.lock(nftIds, { gasLimit: gasLimit });
  };

  const totalVesting: number = prices.tokenPrice
    ? Number(earned) *
      valueToBigNumber(prices.tokenPrice)
        .div(10 ** 8)
        .toNumber()
    : 0;

  return (
    <>
      <ScreenWrapper isTitleOnDesktop={true} withMobileGrayBg={true}>
        <div className="ManageUwu">
          <div className="ManageUwu__left-container">
            <ContentWrapperWithTopLine
              title=""
              className={[
                'ManageUwuMain__top-revenue',
                version === 'v1' ? 'ManageUwuMain__top-revenue-first' : '',
              ].join(' ')}
            >
              <div className="ManageUwuMain__revenue-item">
                <h3 className="ManageUwuMain__revenue-item__main-title">Stats</h3>
                <TopStats
                  value={0}
                  dollarPrefix={false}
                  tooltipPlace="bottom"
                  // subValue={prices.tokenPrice ? Number(total) * prices.tokenPrice : undefined}
                >
                  <div className="data-grid">
                    <div className="data-grid__grid">
                      <SystemIcon image="cloudSafe" size="72" />
                      Locked LPs
                      <span>
                        <CompactNumber value={locked.toString()} />
                      </span>
                    </div>
                    <div className="data-grid__grid">
                      <SystemIcon image="papersTwo" size="72" />
                      Vesting UwU
                      <span>
                        <CompactNumber value={earned.toString()} />
                      </span>
                    </div>
                  </div>
                </TopStats>
              </div>

              {version != 'v1' && (
                <div className="ManageUwuMain__revenue-item">
                  <div className="ManageUwuMain__revenue-item__container">
                    <div className="ManageUwuMain__revenue-item__header">
                      <div style={{ marginRight: 8 }}>
                        <SystemIcon image="papers" size="44" />
                      </div>
                      <TopStats
                        title={`Daily Platform Fees (Global)`}
                        value={platformStats.dailyPlatformFee || 0}
                        dollarPrefix={true}
                      />
                    </div>
                    <div className="data-grid">
                      <div className="data-grid__grid-row">
                        <SystemIcon image="jarCoin" size="32" border={false} />
                        <div className="data-grid__grid-row__title">
                          Your Penalty Share
                          <span>
                            {!isNaN(Number(userShares?.locking))
                              ? `${Number(userShares?.locking).toFixed(2)}%`
                              : 'Fetch...'}
                          </span>
                        </div>
                      </div>
                      <div className="data-grid__grid-row">
                        <SystemIcon image="laptop" size="32" />
                        <div className="data-grid__grid-row__title">
                          Your Platform Share
                          <span>
                            {!isNaN(Number(userShares?.staking))
                              ? `${Number(userShares?.staking).toFixed(2)}%`
                              : 'Fetch...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {version != 'v1' && (
                <div className="ManageUwuMain__revenue-item green">
                  <div className="ManageUwuMain__revenue-item__container">
                    <div className="ManageUwuMain__revenue-item__header">
                      <div style={{ marginRight: 8 }}>
                        <SystemIcon image="box" size="44" />
                      </div>
                      <TopStats
                        title={`Your Daily Revenue`}
                        infoText={intl.formatMessage(messages.helpIconDailyRevenue)}
                        value={userRevenue?.total || 0}
                        dollarPrefix={true}
                        showFullNum={true}
                      />
                    </div>
                    <div className="data-grid">
                      <div className="data-grid__grid-row">
                        <SystemIcon image="gift" size="32" />
                        <div className="data-grid__grid-row__title">
                          Penalty Fees:
                          <span>
                            $
                            <CompactNumber
                              value={userRevenue?.penalty || 0}
                              minimumFractionDigits={2}
                            />
                          </span>
                        </div>
                      </div>

                      <div className="data-grid__grid-row">
                        <SystemIcon image="monitor" size="32" />
                        <div className="data-grid__grid-row__title">
                          Platform Fees:
                          <span>
                            $
                            <CompactNumber
                              value={userRevenue?.platform || 0}
                              minimumFractionDigits={2}
                            />
                          </span>
                          <p className="data-grid__grid-row__desc">(paid over the next 7 days)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ContentWrapperWithTopLine>

            <div className="ManageUwu__left-container__informStringAndSwitch">
              <SystemIcon image="catStake" size="90" border={false} />
              <div className="ManageUwu__left-container__informStringAndSwitch__textInfo">
                <span className="ManageUwu__left-container__informStringAndSwitch__textInfo__span">
                  Unlocked SLP tokens must be migrated to v2 to continue receiving rewards.
                </span>
                <br />
                Your Daily Revenue and Daily Platform Fees are accounted only for V2. As V1 is not
                generating any fees. <br />
                Locked LPs at V1 will receive fees from V2, however any unlocked LPs should be
                migrated to V2.
              </div>
              <SystemIcon image="coinsStake" size="45" border={false} />
              <div className="ManageUwu__left-container__informStringAndSwitch__blockSwitch">
                <VersionSwitcher />
                <div className="ManageUwu__left-container__informStringAndSwitch__blockSwitch__switchInfo">
                  Please use the v1/v2 toggle on the staking page to withdraw and re lock.
                </div>
              </div>
            </div>

            <div className="ManageUwuRewards">
              <ClaimableRewardsTable rerender={claimableRewardRerender} tokenPrices={tokenPrices} />
            </div>

            <div className="MobileManageUwuRewards">
              <MobileClaimableRewardsTable
                rerender={claimableRewardRerender}
                tokenPrices={tokenPrices}
              />
            </div>

            <div className="ManageUwu__card">
              <h3 className="ManageUwu__card-title">Manage Locks and Vestings</h3>
              <div className="ManageUwu__card-container">
                <ContentItem
                  className="ManageUwu__content-lock"
                  title="Lock UwU"
                  apr={`${valueToBigNumber(projectedFeesPerYear)
                    .div(
                      valueToBigNumber(lockedSupply)
                        .div(10 ** 18)
                        .multipliedBy(
                          valueToBigNumber(
                            prices && prices.lpTokenPrice
                              ? valueToBigNumber(prices.lpTokenPrice)
                                  .div(10 ** 8)
                                  .toString()
                              : '0'
                          )
                        )
                    )
                    .multipliedBy(100)
                    .toFixed(2)}%`}
                >
                  {/*{version === 'v2' && Number(tokenInfo.walletBalance) > 0.1 ? (
                   <ContentItemAllLock
                   apr={lockingApr}
                   maxAmount={tokenInfo.walletBalance.toString()}
                   walletBalance={tokenInfo.walletBalance}
                   onMainTxConfirmed={() => {
                   setStatsRerender(Math.random());
                   }}
                   />
                   ) : null}*/}

                  <ContentItemLock
                    maxAmount={tokenInfo.walletBalance.toString()}
                    currencySymbol={tokenInfo.currencySymbol}
                    depositBalance={locked}
                    walletBalance={tokenInfo.walletBalance}
                    priceInMarketReferenceCurrency={priceInMarketReferenceCurrency.toString(10)}
                    onMainTxConfirmed={() => {
                      setStatsRerender(Math.random());
                    }}
                    poolReserve={poolReserve}
                  />

                  {(version === 'v1' || version === 'v2') && (
                    <Accordion
                      open
                      toggleable={false}
                      title="Locked LPs are subject to 8 weeks lock (56 days) and will continue to earn fees after the locks expire if you do not withdraw."
                      displayArrowIcon={lockedTable.length > 0}
                    >
                      <AccordionFooterLockAndVesting
                        unlockableValue={unlockable.toString()}
                        unlockHandler={unlockHandler}
                        table={lockedTable}
                      />
                    </Accordion>
                  )}

                  {version === 'v3' && (
                    <div>
                      <List
                        itemLayout="horizontal"
                        dataSource={nfts}
                        renderItem={(item: any, index) => (
                          <List.Item onClick={() => handleSelectNft(item.id)}>
                            <div className={item.selected ? 'selected nft-list' : 'nft-list'}>
                              <img
                                style={{ width: '36px', marginRight: '15px' }}
                                src={item.meta.image}
                                alt=""
                              />
                              <List.Item.Meta style={{ color: 'white' }} title={item.meta.name} />

                              {!item.approved && (
                                <Button
                                  type="primary"
                                  style={{
                                    background: 'linear-gradient(90deg,#493fb5 0%,#312893 100%)',
                                  }}
                                  onClick={() => handleApproveNFT(Number(item.id))}
                                  loading={item.loading ?? false}
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </List.Item>
                        )}
                      />

                      <div style={{ textAlign: 'center' }}>
                        <Button
                          className="DepositButton"
                          type="primary"
                          style={{ background: 'linear-gradient(90deg,#493fb5 0%,#312893 100%)' }}
                          onClick={handleNftDeposit}
                          disabled={
                            !(() => {
                              return nfts.find((item: any) => item.selected === true);
                            })()
                          }
                        >
                          Deposit
                        </Button>
                      </div>
                      <List
                        itemLayout="horizontal"
                        dataSource={nftsLock}
                        renderItem={(item: any, index) => (
                          <List.Item>
                            <div className={'ntf-list-lock'}>
                              <img
                                style={{ width: '36px', marginRight: '15px' }}
                                src={item.meta.image}
                                alt=""
                              />
                              <List.Item.Meta style={{ color: 'white' }} title={item.meta.name} />
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </ContentItem>

                <div className="ManageUwu__content-item">
                  <h2>Vesting</h2>

                  <div className="vestIntro">
                    {vestTab === VEST_TABS[0] &&
                      'UwU earned from lending and borrowing must vest for 28 days.'}
                    {vestTab === VEST_TABS[1] && 'Please wait until vesting end date.'}
                    {vestTab === VEST_TABS[2] &&
                      'UwU that has completed the 28 day vesting period.'}
                  </div>

                  <div className="ButtonTabs__container">
                    <ButtonTabs
                      tabs={VEST_TABS}
                      selectedTab={vestTab}
                      setSelectedTab={setVestTab}
                    />
                  </div>
                  {vestTab === VEST_TABS[0] && (
                    <div className="container">
                      {version === 'v2' && (
                        <>
                          <div className="child">
                            <TopStats
                              value={Number(availableForVesting)}
                              dollarPrefix={false}
                              subValue={
                                prices.tokenPrice
                                  ? Number(availableForVesting) *
                                    valueToBigNumber(prices.tokenPrice)
                                      .div(10 ** 8)
                                      .toNumber()
                                  : undefined
                              }
                            />
                          </div>
                          <div className="child">
                            <DefaultButton
                              color="secondary"
                              onClick={vestButtonHandler}
                              disabled={!availableForVesting}
                              title="Start Vesting"
                            />
                          </div>
                        </>
                      )}

                      {version === 'v1' && <div>Please use v2 for UwU vesting</div>}
                    </div>
                  )}

                  {vestTab === VEST_TABS[1] && (
                    <>
                      <div className="container">
                        <div className="child">
                          <TopStats
                            value={Number(earned)}
                            dollarPrefix={false}
                            subValue={totalVesting || undefined}
                          />
                          {totalVesting === 0 && <p className="description">Penalty: 0 UwU</p>}
                          {totalVesting !== 0 && (
                            <>
                              <p className="description">
                                Penalty:
                                <span>
                                  {intl.formatNumber(Number(penalty), { maximumFractionDigits: 2 })}
                                  UwU
                                </span>
                              </p>
                            </>
                          )}
                        </div>

                        {version === 'v2' && (
                          <div className="child">
                            <div className="child__penalty">
                              <DefaultButton
                                color="secondary"
                                onClick={exitVestHandler}
                                title="Exit Early"
                                disabled={totalVesting === 0}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {!!totalVesting && (
                        <div>
                          {earnedTable.map(
                            ({ expiryDate, amount }, index: number): ReactElement => {
                              return (
                                <div
                                  key={index}
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    padding: '10px 0',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                  }}
                                >
                                  <div>
                                    <CompactNumber
                                      value={amount}
                                      currency="UwU"
                                      maximumFractionDigits={2}
                                      minimumFractionDigits={2}
                                    />
                                    &nbsp;UwU
                                  </div>
                                  <div>{expiryDate.toLocaleString()}</div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                      {/* <Accordion title="Some text or heading here (see more) ">
                       <AccordionFooterLockAndVesting
                       title="Vestes"
                       value={earned.toString()}
                       table={earnedTable}
                       />

                       </Accordion>*/}
                      {/*<Table title="Vests" value={earned.toString()} table={earnedTable} />*/}
                    </>
                  )}

                  {vestTab === VEST_TABS[2] && (
                    <div className="container">
                      <div className="child">
                        <TopStats
                          value={Number(staked)}
                          dollarPrefix={false}
                          subValue={
                            prices.tokenPrice
                              ? Number(staked) *
                                valueToBigNumber(prices.tokenPrice)
                                  .div(10 ** 8)
                                  .toNumber()
                              : undefined
                          }
                        />
                      </div>
                      <div className="child">
                        <DefaultButton
                          color="secondary"
                          onClick={withdrawVestHandler}
                          title="Withdraw"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScreenWrapper>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}

export default ManageUwuMain;
