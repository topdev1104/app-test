import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { valueToBigNumber, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../../../libs/aave-ui-kit';
import {
  ComputedReserveData,
  useDynamicPoolDataContext,
  useStaticPoolDataContext,
} from '../../../../libs/pool-data-provider';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import NoDataPanel from '../../../../components/NoDataPanel';
import AssetsFilterPanel from '../../../../components/AssetsFilterPanel';
import BorrowAssetTable from '../../components/BorrowAssetTable';
import BorrowMobileCard from '../../components/BorrowAssetTable/BorrowMobileCard';
import BorrowMainWrapper from '../../../../components/wrappers/BorrowMainWrapper';
import Card from '../../../../components/wrappers/BorrowMainWrapper/components/Card';

import defaultMessages from '../../../../defaultMessages';
import messages from './messages';

import { BorrowTableItem } from '../../components/BorrowAssetTable/types';
import { isAssetStable } from '../../../../helpers/config/assets-config';
import { useIncentivesDataContext } from '../../../../libs/pool-data-provider/hooks/use-incentives-data-context';
import useRdntLendingPoolRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-lending-pool-rewards';
import BorrowModal from '../../../../components/modals/BorrowModal';
import { BorrowModalData } from '../../../deposit/components/DepositDashboardTable/types';
import { useHistory } from 'react-router-dom';

export default function BorrowMain() {
  const intl = useIntl();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const { reserves, user } = useDynamicPoolDataContext();
  const { reserveIncentives } = useIncentivesDataContext();
  const { sm } = useThemeContext();
  const [borrowModal, setBorrowModal] = useState<BorrowModalData | undefined>();
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyStableCoins, setShowOnlyStableCoins] = useState(false);

  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const { getRewardApr } = useRdntLendingPoolRewards();

  const availableBorrowsMarketReferenceCurrency = valueToBigNumber(
    user?.availableBorrowsMarketReferenceCurrency || 0
  );

  const filteredReserves = reserves.filter(
    ({ symbol, borrowingEnabled, isActive }) =>
      symbol.toLowerCase().includes(searchValue.toLowerCase()) &&
      borrowingEnabled &&
      isActive &&
      (!showOnlyStableCoins || isAssetStable(symbol))
  );

  const listData = (withFilter: boolean) => {
    const data = (reserves: ComputedReserveData[]) =>
      reserves
        .filter((r: ComputedReserveData) => r.isActive && !r.isFrozen)
        .map<BorrowTableItem>((reserve: ComputedReserveData) => {
          const availableBorrows = availableBorrowsMarketReferenceCurrency.gt(0)
            ? BigNumber.min(
                // one percent margin to don't fail tx
                availableBorrowsMarketReferenceCurrency
                  .div(reserve.priceInMarketReferenceCurrency)
                  .multipliedBy(
                    user && user.totalBorrowsMarketReferenceCurrency !== '0' ? '0.99' : '1'
                  ),
                reserve.availableLiquidity
              ).toNumber()
            : 0;
          const availableBorrowsInUSD = valueToBigNumber(availableBorrows)
            .multipliedBy(reserve.priceInMarketReferenceCurrency)
            .multipliedBy(marketRefPriceInUsd)
            .toString();

          const reserveIncentiveData = reserveIncentives[reserve.underlyingAsset.toLowerCase()];
          const userReserve = user?.userReservesData.find((userReserve) => {
            return userReserve.reserve.symbol === reserve.symbol;
          });

          return {
            ...reserve,
            currentBorrows:
              user?.userReservesData.find((userReserve) => userReserve.reserve.id === reserve.id)
                ?.totalBorrows || '0',
            currentBorrowsInUSD:
              user?.userReservesData.find((userReserve) => userReserve.reserve.id === reserve.id)
                ?.totalBorrowsUSD || '0',
            availableBorrows,
            availableBorrowsInUSD,
            stableBorrowRate:
              reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
                ? Number(reserve.stableBorrowAPY)
                : -1,
            variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowAPY) : -1,
            avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
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
            rdntRewardsBorrowApr: getRewardApr(reserve.variableDebtTokenAddress),
            onClick: () => {
              setBorrowModal({
                showModal: true,
                currencySymbol: reserve.symbol,
                poolReserve: reserve,
                history,
                user,
                userReserve,
              });
            },
          };
        });

    if (withFilter) {
      if (sortDesc) {
        // @ts-ignore
        return data(filteredReserves).sort((a, b) => a[sortName] - b[sortName]);
      } else {
        // @ts-ignore
        return data(filteredReserves).sort((a, b) => b[sortName] - a[sortName]);
      }
    } else {
      return data(reserves);
    }
  };

  const isShowRightPanel = listData(false).some((item) => item.currentBorrows.toString() > '0');

  return (
    <>
      <ScreenWrapper
        pageTitle={intl.formatMessage(defaultMessages.borrow)}
        subTitle="Available to borrow"
        isTitleOnDesktop={true}
        withMobileGrayBg={true}
      >
        <AssetsFilterPanel
          optionTitleLeft={intl.formatMessage(messages.optionTitleLeft)}
          optionTitleRight={intl.formatMessage(messages.optionTitleRight)}
          switchOnToggle={setShowOnlyStableCoins}
          switchValue={showOnlyStableCoins}
          searchValue={searchValue}
          searchOnChange={setSearchValue}
        />

        <BorrowMainWrapper
          contentTitle={intl.formatMessage(messages.availableToBorrow)}
          itemsTitle={intl.formatMessage(messages.myBorrows)}
          items={listData(false).map((item, index) => (
            <React.Fragment key={index}>
              {item.currentBorrows.toString() > '0' && (
                <Card
                  symbol={item.symbol}
                  id={item.id}
                  value={item.currentBorrows.toString()}
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
          totalValue={listData(false).reduce((a, b) => a + (+b['currentBorrowsInUSD'] || 0), 0)}
        >
          {!!listData(true).length ? (
            <>
              {!sm ? (
                <BorrowAssetTable
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
                    <BorrowMobileCard userId={user?.id} {...item} key={index} />
                  ))}
                </>
              )}
            </>
          ) : (
            <NoDataPanel title={intl.formatMessage(messages.noDataText)} />
          )}
        </BorrowMainWrapper>
      </ScreenWrapper>
      {borrowModal && (
        <BorrowModal
          showModal={borrowModal.showModal}
          onBackdropPress={() => setBorrowModal({ ...borrowModal, showModal: false })}
          currencySymbol={borrowModal.currencySymbol}
          poolReserve={borrowModal.poolReserve}
          history={borrowModal.history}
          userReserve={borrowModal.userReserve}
          user={borrowModal.user}
        />
      )}
    </>
  );
}
