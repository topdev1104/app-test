import { ReactElement, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { valueToBigNumber, InterestRate, BigNumber } from '@aave/protocol-js';
import { useIncentivesDataContext } from '../../../../libs/pool-data-provider/hooks/use-incentives-data-context';
import {
  ComputedReserveData,
  useDynamicPoolDataContext,
} from '../../../../libs/pool-data-provider';
import { loanActionLinkComposer } from '../../../../helpers/loan-action-link-composer';
import { toggleBorrowRateMode } from '../../../../helpers/toggle-borrow-rate-mode';
import NoDataPanel from '../../../../components/NoDataPanel';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import LTVInfoModal from '../../../../components/LTVInfoModal';
import {
  BorrowModalData,
  CollateralModalData,
  DepositModalData,
  DepositTableItem,
  RepayModalData,
  WithdrawModalData,
} from '../../../deposit/components/DepositDashboardTable/types';
import { BorrowTableItem } from '../../../borrow/components/BorrowDashboardTable/types';
import { getAssetColor } from '../../../../helpers/config/assets-config';
import useRdntLendingPoolRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-lending-pool-rewards';
import DashboardNoData from '../../../dashboard/components/DashboardNoData';
import MainDashboardTable from '../../../dashboard/components/MainDashboardTable';
import DepositModal from '../../../../components/modals/DepositModal';
import WithdrawModal from '../../../../components/modals/WithdrawModal';
import BorrowModal from '../../../../components/modals/BorrowModal';
import RepayModal from '../../../../components/modals/RepayModal';
import { useThemeContext } from '../../../../libs/aave-ui-kit';
import DepositItem from '../DepositItem';

const depositTableHeaders: string[] = ['Your deposit', 'Current balance', 'Collateral'];

export default function ReserveOverviewTableFooter(): ReactElement {
  const { currentTheme, xl, lg, md } = useThemeContext();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { user, reserves } = useDynamicPoolDataContext();
  const { reserveIncentives } = useIncentivesDataContext();
  const [collateralModal, setCollateralModal] = useState<CollateralModalData>();
  const [depositModal, setDepositModal] = useState<DepositModalData | undefined>();
  const [withdrawModal, setWithdrawModal] = useState<WithdrawModalData | undefined>();
  const [borrowModal, setBorrowModal] = useState<BorrowModalData | undefined>();
  const [repayModal, setRepayModal] = useState<RepayModalData | undefined>();

  const [isLTVModalVisible, setLTVModalVisible] = useState(false);
  const [isBorrow, setIsBorrow] = useState(false);
  const { getRewardApr } = useRdntLendingPoolRewards();

  const loanToValue =
    user?.totalCollateralMarketReferenceCurrency === '0'
      ? '0'
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
          .dividedBy(user?.totalCollateralMarketReferenceCurrency || '1')
          .toFixed();

  const depositedPositions: DepositTableItem[] = [];
  const borrowedPositions: BorrowTableItem[] = [];

  const indexOfMIM = user?.userReservesData.findIndex(
    (item) => item.reserve.symbol.toLowerCase() === 'mim'
  );

  if (indexOfMIM !== -1 && typeof indexOfMIM !== 'undefined') {
    user?.userReservesData.splice(indexOfMIM, 1);
  }

  user?.userReservesData.forEach((userReserve) => {
    const reserveJSON: { aTokenAddress: string; variableDebtTokenAddress: string } = JSON.parse(
      JSON.stringify(userReserve.reserve)
    );

    const rdntRewardsDepositApr = getRewardApr(reserveJSON.aTokenAddress);
    const rdntRewardsBorrowApr = getRewardApr(reserveJSON.variableDebtTokenAddress);

    const poolReserve = reserves.find((res: ComputedReserveData) => {
      const IS_SIFU_NEW = res.underlyingAsset === '0x8DD09822E83313adCA54c75696aE80C5429697Ff';
      const reserveSymbol = IS_SIFU_NEW ? 'Sifu' : res.symbol;
      return (
        reserveSymbol.toLowerCase() ===
        (userReserve.reserve.symbol === 'ETH' ? 'WETH' : userReserve.reserve.symbol)?.toLowerCase()
      );
    });

    if (!poolReserve) {
      console.log(userReserve.reserve.symbol);
      throw new Error('data is inconsistent pool reserve is not available');
    }

    const reserveIncentiveData =
      reserveIncentives[userReserve.reserve.underlyingAsset.toLowerCase()];
    if (userReserve.underlyingBalance !== '0' || userReserve.totalBorrows !== '0') {
      const baseListData = {
        uiColor: getAssetColor(userReserve.reserve.symbol),
        isActive: poolReserve.isActive,
        isFrozen: poolReserve.isFrozen,
        stableBorrowRateEnabled: poolReserve.stableBorrowRateEnabled,
        reserve: {
          ...userReserve.reserve,
          liquidityRate: poolReserve.supplyAPY,
        },
      };
      if (userReserve.underlyingBalance !== '0') {
        depositedPositions.push({
          ...baseListData,
          borrowingEnabled: poolReserve.borrowingEnabled,
          avg30DaysLiquidityRate: poolReserve.avg30DaysLiquidityRate,
          usageAsCollateralEnabledOnThePool: poolReserve.usageAsCollateralEnabled,
          usageAsCollateralEnabledOnUser: userReserve.usageAsCollateralEnabledOnUser,
          underlyingBalance: userReserve.underlyingBalance,
          underlyingBalanceUSD: userReserve.underlyingBalanceUSD,
          aincentivesAPR: rdntRewardsDepositApr > 0 ? rdntRewardsDepositApr.toString() : '0',
          collateralModalData: {
            history,
            id: poolReserve.id,
            usageAsCollateralEnabledOnUser: !userReserve.usageAsCollateralEnabledOnUser,
            underlyingAsset: poolReserve.underlyingAsset,
            showModal: false,
            user: user,
            userReserve: userReserve,
            poolReserve: poolReserve,
            asCollateral: true,
          },
          depositModalData: {
            showModal: false,
            currencySymbol: poolReserve.symbol,
            poolReserve: poolReserve,
            history,
          },
          withdrawModalData: {
            showModal: false,
            currencySymbol: poolReserve.symbol,
            poolReserve: poolReserve,
            history,
            userReserve,
            user,
          },
          onToggleSwitch: () =>
            setCollateralModal({
              history,
              id: poolReserve.id,
              usageAsCollateralEnabledOnUser: !userReserve.usageAsCollateralEnabledOnUser,
              underlyingAsset: poolReserve.underlyingAsset,
              showModal: true,
              user: user,
              userReserve: userReserve,
              poolReserve: poolReserve,
              asCollateral: true,
            }),
          onDeposit: () => {
            setDepositModal({
              showModal: true,
              currencySymbol: poolReserve.symbol,
              poolReserve: poolReserve,
              history,
            });
          },
          onWithdraw: () => {
            setWithdrawModal({
              showModal: true,
              currencySymbol: poolReserve.symbol,
              poolReserve: poolReserve,
              history,
              userReserve,
              user,
            });
          },

          // toggleUseAsCollateral(
          //   history,
          //   poolReserve.id,
          //   !userReserve.usageAsCollateralEnabledOnUser,
          //   poolReserve.underlyingAsset
          // ),
        });
      }

      if (userReserve.variableBorrows !== '0') {
        borrowedPositions.push({
          ...baseListData,
          borrowingEnabled: poolReserve.borrowingEnabled,
          currentBorrows: userReserve.variableBorrows,
          currentBorrowsUSD: userReserve.variableBorrowsUSD,
          borrowRateMode: InterestRate.Variable,
          borrowRate: poolReserve.variableBorrowAPY,
          vincentivesAPR: rdntRewardsBorrowApr > 0 ? rdntRewardsBorrowApr.toString() : '0',
          sincentivesAPR: reserveIncentiveData
            ? reserveIncentiveData.sIncentives.incentiveAPR
            : '0',
          avg30DaysVariableRate: poolReserve.avg30DaysVariableBorrowRate,
          repayLink: loanActionLinkComposer(
            'repay',
            poolReserve.id,
            InterestRate.Variable,
            poolReserve.underlyingAsset
          ),
          borrowLink: loanActionLinkComposer(
            'borrow',
            poolReserve.id,
            InterestRate.Variable,
            poolReserve.underlyingAsset
          ),
          onSwitchToggle: () =>
            toggleBorrowRateMode(
              history,
              poolReserve.id,
              InterestRate.Variable,
              poolReserve.underlyingAsset
            ),
          onBorrowClick: () => {
            setBorrowModal({
              showModal: true,
              currencySymbol: poolReserve.symbol,
              poolReserve: poolReserve,
              history,
              user,
              userReserve,
            });
          },
          onRepayClick: () => {
            setRepayModal({
              showModal: true,
              currencySymbol: poolReserve.symbol,
              poolReserve: poolReserve,
              history,
              user,
              userReserve,
              location,
            });
          },
        });
      }
      if (userReserve.stableBorrows !== '0') {
        borrowedPositions.push({
          ...baseListData,
          borrowingEnabled: poolReserve.borrowingEnabled && poolReserve.stableBorrowRateEnabled,
          currentBorrows: userReserve.stableBorrows,
          currentBorrowsUSD: userReserve.stableBorrowsUSD,
          borrowRateMode: InterestRate.Stable,
          borrowRate: userReserve.stableBorrowAPY,
          vincentivesAPR: reserveIncentiveData
            ? reserveIncentiveData.vIncentives.incentiveAPR
            : '0',
          sincentivesAPR: reserveIncentiveData
            ? reserveIncentiveData.sIncentives.incentiveAPR
            : '0',
          repayLink: loanActionLinkComposer(
            'repay',
            poolReserve.id,
            InterestRate.Stable,
            poolReserve.underlyingAsset
          ),
          borrowLink: loanActionLinkComposer(
            'borrow',
            poolReserve.id,
            InterestRate.Stable,
            poolReserve.underlyingAsset
          ),
          onSwitchToggle: () =>
            toggleBorrowRateMode(
              history,
              poolReserve.id,
              InterestRate.Stable,
              poolReserve.underlyingAsset
            ),
          onBorrowClick: () => {
            alert('borrow2');
          },
          onRepayClick: () => {
            alert('repay2');
          },
        });
      }
    }
  });

  return (
    <>
      {user ? (
        <>
          {!!depositedPositions.length ? (
            <MainDashboardTable
              depositTableTemplateColumns={
                'minmax(90px, 100px) minmax(130px, 140px) 72px minmax(185px, 1fr)'
              }
              borrowTableTemplateColumns={
                'minmax(90px, 100px) minmax(100px, 130px) minmax(110px, 130px) minmax(185px, 1fr)'
              }
              depositTableHeaders={depositTableHeaders}
              DepositTableItem={DepositItem}
              borrowedPositions={borrowedPositions}
              depositedPositions={depositedPositions}
              isBorrow={isBorrow}
            />
          ) : (
            <DashboardNoData />
          )}
        </>
      ) : (
        <ContentWrapper withFullHeight={true}>
          <NoDataPanel
            title="Please connect your wallet"
            description={
              'We couldn’t detect a wallet. Please connect a wallet to view your personal information here'
            }
            withConnectButton={true}
          />
        </ContentWrapper>
      )}

      {loanToValue !== '0' && (
        <LTVInfoModal visible={isLTVModalVisible} setVisible={setLTVModalVisible} />
      )}

      {depositModal && (
        <DepositModal
          showModal={depositModal.showModal}
          onBackdropPress={() => setDepositModal({ ...depositModal, showModal: false })}
          currencySymbol={depositModal.currencySymbol}
          poolReserve={depositModal.poolReserve}
          history={depositModal.history}
        />
      )}

      {withdrawModal && (
        <WithdrawModal
          showModal={withdrawModal.showModal}
          onBackdropPress={() => setWithdrawModal({ ...withdrawModal, showModal: false })}
          currencySymbol={withdrawModal.currencySymbol}
          poolReserve={withdrawModal.poolReserve}
          history={withdrawModal.history}
          userReserve={withdrawModal.userReserve}
          user={withdrawModal.user}
        />
      )}

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

      {repayModal && (
        <RepayModal
          showModal={repayModal.showModal}
          onBackdropPress={() => setRepayModal({ ...repayModal, showModal: false })}
          currencySymbol={repayModal.currencySymbol}
          poolReserve={repayModal.poolReserve}
          userReserve={repayModal.userReserve}
          user={repayModal.user}
          walletBalance={BigNumber('0')}
          history={repayModal.history}
          location={location}
        />
      )}
    </>
  );
}
