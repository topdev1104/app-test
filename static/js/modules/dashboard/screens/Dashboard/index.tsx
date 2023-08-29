import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { valueToBigNumber, InterestRate, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../../../libs/aave-ui-kit';
import classNames from 'classnames';

import { useIncentivesDataContext } from '../../../../libs/pool-data-provider/hooks/use-incentives-data-context';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import {
  ComputedReserveData,
  useDynamicPoolDataContext,
} from '../../../../libs/pool-data-provider';
import { loanActionLinkComposer } from '../../../../helpers/loan-action-link-composer';
import { toggleBorrowRateMode } from '../../../../helpers/toggle-borrow-rate-mode';
import LabeledSwitcher from '../../../../components/basic/LabeledSwitcher';
import NoDataPanel from '../../../../components/NoDataPanel';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import Row from '../../../../components/basic/Row';
import Value from '../../../../components/basic/Value';
import MaxLTVHelpModal from '../../../../components/HelpModal/MaxLTVHelpModal';
import ValuePercent from '../../../../components/basic/ValuePercent';
import HealthFactor from '../../../../components/HealthFactor';
import DefaultButton from '../../../../components/basic/DefaultButton';
import NoData from '../../../../components/basic/NoData';
import CollateralCompositionBar from '../../../../components/compositionBars/CollateralCompositionBar';
import BorrowCompositionBar from '../../../../components/compositionBars/BorrowCompositionBar';
import LTVInfoModal from '../../../../components/LTVInfoModal';
import MainDashboardTable from '../../components/MainDashboardTable';
import MobileTopPanelWrapper from '../../components/MobileTopPanelWrapper';
import DepositBorrowTopPanel from '../../../../components/DepositBorrowTopPanel';
import IncentiveWrapper from '../../../../components/wrappers/IncentiveWrapper';
import DashboardNoData from '../../components/DashboardNoData';

import {
  BorrowModalData,
  CollateralModalData,
  DepositModalData,
  DepositTableItem,
  RepayModalData,
  WithdrawModalData,
} from '../../../deposit/components/DepositDashboardTable/types';
import CollateralModal from '../../../../components/modals/CollateralModal';
import DepositModal from '../../../../components/modals/DepositModal';
import WithdrawModal from '../../../../components/modals/WithdrawModal';

import { BorrowTableItem } from '../../../borrow/components/BorrowDashboardTable/types';
import { DashboardLeftTopLine } from '../../../../ui-config';
import { getAssetColor } from '../../../../helpers/config/assets-config';

import messages from './messages';
import staticStyles from './style';
import { ChainId } from '@aave/contract-helpers';
import PageHeader from '../../../../components/PageHeader';
import useRdntLendingPoolRewards from '../../../../libs/aave-protocol-js/hooks/use-rdnt-lending-pool-rewards';
import SystemIcon from '../../../../components/SystemIcon/SystemIcon';
import BorrowModal from '../../../../components/modals/BorrowModal';
import RepayModal from '../../../../components/modals/RepayModal';

export default function Dashboard() {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { chainId } = useProtocolDataContext();
  const { user, reserves } = useDynamicPoolDataContext();
  const { reserveIncentives } = useIncentivesDataContext();
  const { currentTheme, sm } = useThemeContext();

  const [isLTVModalVisible, setLTVModalVisible] = useState(false);
  const [collateralModal, setCollateralModal] = useState<CollateralModalData | undefined>();
  const [depositModal, setDepositModal] = useState<DepositModalData | undefined>();
  const [withdrawModal, setWithdrawModal] = useState<WithdrawModalData | undefined>();
  const [borrowModal, setBorrowModal] = useState<BorrowModalData | undefined>();
  const [repayModal, setRepayModal] = useState<RepayModalData | undefined>();

  const [isBorrow, setIsBorrow] = useState(false);
  const [isDepositMobileInfoVisible, setDepositMobileInfoVisible] = useState(false);
  const [isBorrowMobileInfoVisible, setBorrowMobileInfoVisible] = useState(false);
  const { getRewardApr } = useRdntLendingPoolRewards();

  const maxBorrowAmount = valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0').plus(
    user?.availableBorrowsMarketReferenceCurrency || '0'
  );
  const collateralUsagePercent = maxBorrowAmount.eq(0)
    ? '1'
    : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
        .div(maxBorrowAmount)
        .toFixed();

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

    const poolReserve = reserves.find((res) => {
      if (userReserve.reserve.underlyingAsset === '0x29127fe04ffa4c32acac0ffe17280abd74eac313') {
        return res.symbol === 'SIFU_OLD';
      }
      return (
        res.symbol === (userReserve.reserve.symbol === 'ETH' ? 'WETH' : userReserve.reserve.symbol)
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
          depositAPY: poolReserve.borrowingEnabled ? Number(poolReserve.supplyAPY) : -1,
          onToggleSwitch: () => {
            setCollateralModal({
              history,
              id: poolReserve.id,
              usageAsCollateralEnabledOnUser: !userReserve.usageAsCollateralEnabledOnUser,
              underlyingAsset: poolReserve.underlyingAsset,
              showModal: true,
              user: user,
              userReserve: userReserve,
              poolReserve: poolReserve,
              asCollateral: !userReserve.usageAsCollateralEnabledOnUser,
            });
          },
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
          apy: poolReserve.borrowingEnabled ? Number(poolReserve.variableBorrowAPY) : -1,
          rdntRewardsBorrowApr: getRewardApr(poolReserve.variableDebtTokenAddress),
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
    }
  });

  return (
    <div className="Dashboard">
      <PageHeader text="Dashboard" />
      <div className="Dashboard__healthFactor">
        <div className="Dashboard__healthFactor--table">
          <div className="Dashboard__healthFactor--item">
            <SystemIcon image={'wallet'} size={'32px'} border margin={'0 10px 0 0'} />
            <HealthFactor
              value={user?.healthFactor || '-1'}
              isColumn={true}
              titleColor="white"
              titleLightWeight={true}
              withHALLink={true}
            />
          </div>
          <div className="Dashboard__healthFactor--item">
            <SystemIcon image={'safeCoin'} size={'32px'} border margin={'0 10px 0 0'} />
            <Row title="Borrowing Power Used" color="white" weight="light" isColumn={true}>
              {user && collateralUsagePercent !== '0' ? (
                <ValuePercent value={collateralUsagePercent} color="white" />
              ) : (
                <NoData />
              )}
            </Row>
          </div>
          <div className="Dashboard__healthFactor--item">
            <SystemIcon image={'jarCoin'} size={'32px'} border margin={'0 10px 0 0'} />
            <Row
              title={<MaxLTVHelpModal text="Current LTV" color="white" lightWeight={true} />}
              color="white"
              weight="light"
              isColumn={true}
            >
              {user && loanToValue !== '0' ? (
                <ValuePercent value={loanToValue} color="white" />
              ) : (
                <NoData />
              )}
            </Row>
          </div>
        </div>
        {loanToValue !== '0' && (
          <DefaultButton
            className="Dashboard__healthFactor--btn"
            title="Details"
            color="inherit"
            transparent={true}
            size="big"
            onClick={() => setLTVModalVisible(true)}
          />
        )}
      </div>

      <div
        className={classNames('Dashboard__mobileMigrate--inner', {
          Dashboard__mobileMigrateWithoutContent:
            chainId !== ChainId.mainnet && !depositedPositions.length,
        })}
      >
        <DashboardLeftTopLine intl={intl} chainId={chainId} onMobile={true} />
      </div>

      {user && !!depositedPositions.length && (
        <div className="Dashboard__switcher-inner">
          <LabeledSwitcher
            rightOption={intl.formatMessage(messages.switchRightOption)}
            leftOption={intl.formatMessage(messages.switchLeftOption)}
            value={isBorrow}
            onToggle={() => {
              setIsBorrow(!isBorrow);
              setDepositMobileInfoVisible(false);
              setBorrowMobileInfoVisible(false);
            }}
            className="Dashboard__switcher"
          />
        </div>
      )}

      <DepositBorrowTopPanel isBorrow={isBorrow} />

      {user && !!borrowedPositions.length && isBorrow && (
        <MobileTopPanelWrapper
          visible={isBorrowMobileInfoVisible}
          setVisible={setBorrowMobileInfoVisible}
          buttonComponent={
            <>
              <Row
                title={intl.formatMessage(messages.youBorrowed)}
                color="white"
                weight="light"
                withMargin={!isBorrowMobileInfoVisible}
              >
                {user && user.totalBorrowsUSD !== '0' ? (
                  <Value
                    value={user.totalBorrowsUSD}
                    symbol="USD"
                    tokenIcon={true}
                    minimumValueDecimals={2}
                    maximumValueDecimals={2}
                    subValue={user.totalBorrowsMarketReferenceCurrency}
                    subSymbol="ETH"
                    color="white"
                  />
                ) : (
                  <NoData />
                )}
              </Row>
              {!isBorrowMobileInfoVisible && (
                <HealthFactor
                  value={user?.healthFactor || '-1'}
                  titleColor="white"
                  titleLightWeight={true}
                  withHALLink={true}
                />
              )}
            </>
          }
        >
          <Row
            title={intl.formatMessage(messages.yourCollateral)}
            color="white"
            weight="light"
            withMargin={true}
          >
            {user && user.totalCollateralUSD !== '0' ? (
              <Value
                value={user.totalCollateralUSD}
                symbol="USD"
                tokenIcon={true}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                subValue={user.totalCollateralMarketReferenceCurrency}
                subSymbol="ETH"
                color="white"
              />
            ) : (
              <NoData />
            )}
          </Row>

          <HealthFactor
            value={user?.healthFactor || '-1'}
            titleColor="white"
            titleLightWeight={true}
            withHALLink={true}
          />

          <Row
            title={
              <MaxLTVHelpModal
                text={intl.formatMessage(messages.currentLTV)}
                color="white"
                lightWeight={true}
              />
            }
            color="white"
            weight="light"
            withMargin={true}
            className="Dashboard__mobileRow-center"
          >
            {user && loanToValue !== '0' ? (
              <div className="Dashboard__mobileRow-content">
                <ValuePercent value={loanToValue} color="white" />
                <DefaultButton
                  title={intl.formatMessage(messages.details)}
                  color="white"
                  transparent={true}
                  className="Dashboard__mobileButton"
                  size="small"
                  onClick={() => setLTVModalVisible(true)}
                />
              </div>
            ) : (
              <NoData />
            )}
          </Row>

          <Row
            title={intl.formatMessage(messages.borrowingPowerUsed)}
            color="white"
            weight="light"
            withMargin={true}
          >
            {user && collateralUsagePercent !== '0' ? (
              <ValuePercent value={collateralUsagePercent} color="white" />
            ) : (
              <NoData />
            )}
          </Row>

          <BorrowCompositionBar />
          <CollateralCompositionBar />
        </MobileTopPanelWrapper>
      )}

      {sm && <IncentiveWrapper />}

      {user ? (
        <>
          {!!depositedPositions.length ? (
            <MainDashboardTable
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

      {collateralModal && (
        <CollateralModal
          showModal={collateralModal.showModal}
          onBackdropPress={() => setCollateralModal({ ...collateralModal, showModal: false })}
          history={history}
          id={collateralModal.id}
          usageAsCollateralEnabledOnUser={collateralModal.usageAsCollateralEnabledOnUser}
          underlyingAsset={collateralModal.underlyingAsset}
          user={user}
          userReserve={collateralModal.userReserve}
          poolReserve={collateralModal.poolReserve}
          asCollateral={collateralModal.asCollateral}
        ></CollateralModal>
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
        ></WithdrawModal>
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
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
