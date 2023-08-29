import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { valueToBigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../../../libs/aave-ui-kit';
import { PERMISSION } from '@aave/contract-helpers';

import {
  ComputedReserveData,
  useDynamicPoolDataContext,
  useStaticPoolDataContext,
} from '../../../../libs/pool-data-provider';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import Preloader from '../../../../components/basic/Preloader';
import AssetsFilterPanel from '../../../../components/AssetsFilterPanel';
import NoDataPanel from '../../../../components/NoDataPanel';
import DepositAssetsTable from '../../components/DepositAssetsTable';
import DepositMobileCard from '../../components/DepositAssetsTable/DepositMobileCard';
import DepositBorrowMainWrapper from '../../../../components/wrappers/DepositBorrowMainWrapper';
import Card from '../../../../components/wrappers/BorrowMainWrapper/components/Card';

import defaultMessages from '../../../../defaultMessages';
import messages from './messages';

import { DepositTableItem } from '../../components/DepositAssetsTable/types';
import { useWalletBalanceProviderContext } from '../../../../libs/wallet-balance-provider/WalletBalanceProvider';
import { isAssetStable } from '../../../../helpers/config/assets-config';
import { useIncentivesDataContext } from '../../../../libs/pool-data-provider/hooks/use-incentives-data-context';
import useRdntLendingPoolRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-lending-pool-rewards';
import { DepositModalData } from '../../components/DepositDashboardTable/types';
import DepositModal from '../../../../components/modals/DepositModal';
import { useHistory } from 'react-router-dom';

export default function DepositsMain() {
  const intl = useIntl();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const { reserves, user } = useDynamicPoolDataContext();
  const { reserveIncentives } = useIncentivesDataContext();
  const { sm } = useThemeContext();
  const [depositModal, setDepositModal] = useState<DepositModalData | undefined>();
  const history = useHistory();

  const [searchValue, setSearchValue] = useState('');
  const [showOnlyStableCoins, setShowOnlyStableCoins] = useState(false);

  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  const { walletData } = useWalletBalanceProviderContext();
  const { getRewardApr } = useRdntLendingPoolRewards();

  if (!walletData) {
    return <Preloader withText={true} />;
  }

  const filteredReserves = reserves.filter(
    (reserve) =>
      reserve.symbol.toLowerCase().includes(searchValue.toLowerCase()) &&
      reserve.isActive &&
      (!showOnlyStableCoins || isAssetStable(reserve.symbol))
  );

  if (sortDesc) {
    // @ts-ignore
    filteredReserves.sort((a, b) => a[sortName] - b[sortName]);
  } else {
    // @ts-ignore
    filteredReserves.sort((a, b) => b[sortName] - a[sortName]);
  }

  const listData = (withFilter: boolean) => {
    const data = (reserves: ComputedReserveData[]) =>
      reserves
        .filter((r: ComputedReserveData) => r.isActive && !r.isFrozen)
        .map<DepositTableItem>((reserve: ComputedReserveData) => {
          const userReserve = user?.userReservesData.find(
            (userRes) => userRes.reserve.symbol === reserve.symbol
          );
          const walletBalance =
            walletData[reserve.underlyingAsset] === '0'
              ? valueToBigNumber('0')
              : valueToBigNumber(walletData[reserve.underlyingAsset] || '0').dividedBy(
                  valueToBigNumber('10').pow(reserve.decimals)
                );
          const walletBalanceInUSD = walletBalance
            .multipliedBy(reserve.priceInMarketReferenceCurrency)
            .multipliedBy(marketRefPriceInUsd)
            .toString();

          const reserveIncentiveData = reserveIncentives[reserve.underlyingAsset.toLowerCase()];
          return {
            ...reserve,
            walletBalance,
            walletBalanceInUSD,
            underlyingBalance: userReserve ? userReserve.underlyingBalance : '0',
            underlyingBalanceInUSD: userReserve ? userReserve.underlyingBalanceUSD : '0',
            liquidityRate: reserve.supplyAPY,
            avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
            rdntRewardsDepositApr: getRewardApr(reserve.aTokenAddress),
            borrowingEnabled: reserve.borrowingEnabled,
            interestHistory: [],
            aincentivesAPR: reserveIncentiveData
              ? reserveIncentiveData.aIncentives.incentiveAPR
              : '0',
            vincentivesAPR: reserveIncentiveData
              ? reserveIncentiveData.vIncentives.incentiveAPR
              : '0',
            sincentivesAPR: reserveIncentiveData
              ? reserveIncentiveData.sIncentives.incentiveAPR
              : '0',
            onClick: () => {
              setDepositModal({
                showModal: true,
                currencySymbol: reserve.symbol,
                poolReserve: reserve,
                history,
              });
            },
          };
        });

    if (withFilter) {
      if (sortDesc) {
        return (
          data(filteredReserves)
            .sort((a, b) => +b.walletBalanceInUSD - +a.walletBalanceInUSD)
            // @ts-ignore
            .sort((a, b) => a[sortName] - b[sortName])
        );
      } else {
        return (
          data(filteredReserves)
            .sort((a, b) => +b.walletBalanceInUSD - +a.walletBalanceInUSD)
            // @ts-ignore
            .sort((a, b) => b[sortName] - a[sortName])
        );
      }
    } else {
      return data(reserves);
    }
  };

  const isShowRightPanel = listData(false).some((item) => item.underlyingBalance.toString() > '0');

  return (
    <>
      <ScreenWrapper
        pageTitle={intl.formatMessage(defaultMessages.deposit)}
        subTitle="Available to deposit"
        isTitleOnDesktop={true}
        withMobileGrayBg={true}
      >
        <AssetsFilterPanel
          optionTitleLeft={intl.formatMessage(messages.optionTitleLeft)}
          optionTitleRight={intl.formatMessage(messages.optionTitleRight)}
          switchValue={showOnlyStableCoins}
          switchOnToggle={setShowOnlyStableCoins}
          searchValue={searchValue}
          searchOnChange={setSearchValue}
          darkOnDarkMode={true}
        />

        <DepositBorrowMainWrapper
          contentTitle="Available to deposit"
          itemsTitle="My deposits"
          items={listData(false).map((item, index) => (
            <React.Fragment key={index}>
              {item.underlyingBalance.toString() > '0' && (
                <Card
                  symbol={item.symbol}
                  id={item.id}
                  value={item.underlyingBalance.toString()}
                  underlyingAsset={item.underlyingAsset}
                  walletBalanceInUSD={''}
                />
              )}
            </React.Fragment>
          ))}
          isShowRightPanel={isShowRightPanel}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          showOnlyStableCoins={showOnlyStableCoins}
          setShowOnlyStableCoins={setShowOnlyStableCoins}
          withSwitchMarket={true}
          totalValue={listData(false).reduce((a, b) => a + (+b['underlyingBalanceInUSD'] || 0), 0)}
        >
          {!!listData(true).length ? (
            <>
              {!sm ? (
                <DepositAssetsTable
                  listData={listData(true)}
                  userId={user?.id}
                  sortName={sortName}
                  setSortName={setSortName}
                  sortDesc={sortDesc}
                  setSortDesc={setSortDesc}
                />
              ) : (
                <>
                  {listData(true).map((item, index) => (
                    <DepositMobileCard userId={user?.id} {...item} key={index} />
                  ))}
                </>
              )}
            </>
          ) : (
            <NoDataPanel title={intl.formatMessage(messages.noDataTitle)} />
          )}
        </DepositBorrowMainWrapper>
      </ScreenWrapper>

      {depositModal && (
        <DepositModal
          showModal={depositModal.showModal}
          onBackdropPress={() => setDepositModal({ ...depositModal, showModal: false })}
          currencySymbol={depositModal.currencySymbol}
          poolReserve={depositModal.poolReserve}
          history={depositModal.history}
        />
      )}
    </>
  );
}
