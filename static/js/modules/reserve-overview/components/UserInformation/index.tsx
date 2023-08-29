import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { valueToBigNumber, BigNumber } from '@aave/protocol-js';

import { useThemeContext } from '../../../../libs/aave-ui-kit';
import { toggleUseAsCollateral } from '../../../../helpers/toggle-use-as-collateral';
import Row from '../../../../components/basic/Row';
import DefaultButton from '../../../../components/basic/DefaultButton';
import Value from '../../../../components/basic/Value';
import ValuePercent from '../../../../components/basic/ValuePercent';
import CustomSwitch from '../../../../components/basic/CustomSwitch';
import GradientPlusButton from '../../../../components/basic/GradientPlusButton';
import HealthFactor from '../../../../components/HealthFactor';
import CollateralHelpModal from '../../../../components/HelpModal/CollateralHelpModal';

import messages from './messages';
import staticStyles from './style';
import { ComputedReserveData, UserSummary } from '../../../../libs/pool-data-provider';
import { ComputedUserReserve } from '@aave/math-utils';
import {
  BorrowModalData,
  DepositModalData,
  WithdrawModalData,
} from '../../../deposit/components/DepositDashboardTable/types';
import DepositModal from '../../../../components/modals/DepositModal';
import WithdrawModal from '../../../../components/modals/WithdrawModal';
import BorrowModal from '../../../../components/modals/BorrowModal';

interface UserInformationProps {
  user?: UserSummary;
  poolReserve: ComputedReserveData;
  userReserve?: ComputedUserReserve;
  symbol: string;
  walletBalance: BigNumber;
}

export default function UserInformation({
  user,
  userReserve,
  poolReserve,
  symbol,
  walletBalance,
}: UserInformationProps) {
  const intl = useIntl();
  const { currentTheme, xl, sm } = useThemeContext();
  const history = useHistory();

  const [contentVisible, setContentVisibility] = useState(false);
  const [depositModal, setDepositModal] = useState<DepositModalData | undefined>();
  const [withdrawModal, setWithdrawModal] = useState<WithdrawModalData | undefined>();
  const [borrowModal, setBorrowModal] = useState<BorrowModalData | undefined>();

  useEffect(() => {
    if (contentVisible && !sm) {
      setContentVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sm]);

  const totalBorrows = valueToBigNumber(userReserve?.totalBorrows || '0').toNumber();
  const underlyingBalance = valueToBigNumber(userReserve?.underlyingBalance || '0').toNumber();

  const availableBorrowsMarketReferenceCurrency = valueToBigNumber(
    user?.availableBorrowsMarketReferenceCurrency || 0
  );
  const availableBorrows = availableBorrowsMarketReferenceCurrency.gt(0)
    ? BigNumber.min(
        availableBorrowsMarketReferenceCurrency
          .div(poolReserve.priceInMarketReferenceCurrency)
          .multipliedBy(user && user.totalBorrowsMarketReferenceCurrency !== '0' ? '0.99' : '1'),
        poolReserve.availableLiquidity
      ).toNumber()
    : 0;

  const switcherHeight = xl && !sm ? 16 : sm ? 26 : 20;
  const switcherWidth = xl && !sm ? 30 : sm ? 50 : 40;
  const rowWeight = sm ? 'light' : 'normal';
  const elementsColor = sm ? 'white' : 'dark';

  return (
    <div className="UserInformation">
      <div
        className={classNames('UserInformation__content-wrapper', {
          UserInformation__contentWrapperVisible: contentVisible,
        })}
      >
        <div className="UserInformation__content-inner">
          <div className="UserInformation__info-wrapper">
            <h3>
              <span>Deposits</span>
            </h3>

            <div className="UserInformation__info-inner">
              <Row
                title={intl.formatMessage(messages.yourWalletBalance)}
                withMargin={true}
                weight={rowWeight}
                color={elementsColor}
              >
                <Value
                  value={walletBalance.toString()}
                  symbol={symbol}
                  minimumValueDecimals={2}
                  maximumValueDecimals={2}
                  color={elementsColor}
                />
              </Row>
              <div className="gorizontalDiv"></div>
              <Row
                title={intl.formatMessage(messages.youAlreadyDeposited)}
                withMargin={!!underlyingBalance}
                weight={rowWeight}
                color={elementsColor}
              >
                <Value
                  value={underlyingBalance}
                  symbol={symbol}
                  minimumValueDecimals={2}
                  maximumValueDecimals={2}
                  color={elementsColor}
                />
              </Row>
              <div className="gorizontalDiv"></div>
              {!!underlyingBalance && (
                <div className="UserInformation__row">
                  <CollateralHelpModal
                    text={intl.formatMessage(messages.collateral)}
                    color={elementsColor}
                    lightWeight={sm}
                  />
                  <CustomSwitch
                    value={
                      userReserve?.usageAsCollateralEnabledOnUser &&
                      poolReserve.usageAsCollateralEnabled
                    }
                    offLabel={intl.formatMessage(messages.depositOffLabel)}
                    onLabel={intl.formatMessage(messages.depositOnLabel)}
                    onColor={currentTheme.green.hex}
                    offColor={currentTheme.red.hex}
                    onSwitch={() =>
                      toggleUseAsCollateral(
                        history,
                        poolReserve.id,
                        !userReserve?.usageAsCollateralEnabledOnUser,
                        poolReserve.underlyingAsset
                      )
                    }
                    disabled={!poolReserve.usageAsCollateralEnabled}
                    swiperHeight={switcherHeight}
                    swiperWidth={switcherWidth}
                    onDarkBackground={sm}
                  />
                </div>
              )}
            </div>
            <div className="UserInformation__caption-buttons">
              <DefaultButton
                className="UserInformation__button"
                title="Deposit"
                color={elementsColor}
                disabled={poolReserve.isFrozen}
                onClick={() => {
                  setDepositModal({
                    showModal: true,
                    currencySymbol: poolReserve.symbol,
                    poolReserve: poolReserve,
                    history,
                  });
                }}
              />

              <DefaultButton
                className="UserInformation__button"
                title="Withdraw"
                color={elementsColor}
                disabled={poolReserve.isFrozen}
                onClick={() => {
                  setWithdrawModal({
                    showModal: true,
                    currencySymbol: poolReserve.symbol,
                    poolReserve: poolReserve,
                    history,
                    userReserve,
                    user,
                  });
                }}
              />
            </div>
          </div>

          <div className="UserInformation__info-wrapper">
            <h3>
              <span>{intl.formatMessage(messages.borrows)}</span>{' '}
            </h3>
            <div className="UserInformation__info-inner">
              <Row
                title={intl.formatMessage(messages.borrowed)}
                withMargin={true}
                weight={rowWeight}
                color={elementsColor}
              >
                {poolReserve.borrowingEnabled ? (
                  <Value
                    value={totalBorrows || 0}
                    symbol={symbol}
                    minimumValueDecimals={2}
                    maximumValueDecimals={2}
                    color={elementsColor}
                  />
                ) : (
                  <span className="UserInformation__noData">—</span>
                )}
              </Row>
              <div className="gorizontalDiv"></div>
              <HealthFactor
                value={user?.healthFactor || '-1'}
                titleColor={elementsColor}
                titleLightWeight={sm}
                withHALLink={true}
              />
              <div className="gorizontalDiv"></div>
              <Row
                title={intl.formatMessage(messages.loanToValue)}
                withMargin={true}
                weight={rowWeight}
                color={elementsColor}
              >
                <ValuePercent value={user?.currentLoanToValue || 0} color={elementsColor} />
              </Row>
              <div className="gorizontalDiv"></div>
              <Row
                title={intl.formatMessage(messages.availableToYou)}
                weight={rowWeight}
                color={elementsColor}
              >
                {poolReserve.borrowingEnabled ? (
                  <Value
                    value={availableBorrows}
                    symbol={symbol}
                    minimumValueDecimals={2}
                    maximumValueDecimals={2}
                    color={elementsColor}
                  />
                ) : (
                  <span className="UserInformation__noData">—</span>
                )}
              </Row>
            </div>
            {!totalBorrows && (
              <div className="UserInformation__caption-buttons UserInformation__caption-buttons-borrow">
                <DefaultButton
                  className="UserInformation__button__borrow"
                  title="Borrow"
                  color={elementsColor}
                  disabled={
                    !availableBorrows || !poolReserve.borrowingEnabled || poolReserve.isFrozen
                  }
                  onClick={() => {
                    setBorrowModal({
                      showModal: true,
                      currencySymbol: poolReserve.symbol,
                      poolReserve: poolReserve,
                      history,
                      user,
                      userReserve,
                    });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {sm && !contentVisible && (
        <GradientPlusButton
          active={!contentVisible}
          positionVertical="bottom"
          positionHorizontal="right"
          onClick={() => setContentVisibility(!contentVisible)}
        />
      )}

      {depositModal && (
        <DepositModal
          showModal={depositModal.showModal}
          onBackdropPress={() => setDepositModal({ ...depositModal, showModal: false })}
          currencySymbol={depositModal.currencySymbol}
          poolReserve={depositModal.poolReserve}
          history={depositModal.history}
        ></DepositModal>
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
        ></BorrowModal>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .UserInformation {
          @import 'src/_mixins/screen-size';

          @include respond-to(sm) {
            border-radius: 8px;
          }

          &__mobile-caption {
            h2 {
              color: ${currentTheme.white.hex};
            }
          }

          &__info-wrapper {
            border-radius: 8px;
            &:after {
              background: ${currentTheme.white.hex};
            }
          }

          .UserInformation__swiper {
            .CustomSwitch__label {
              @include respond-to(sm) {
                color: ${currentTheme.white.hex} !important;
              }
            }
          }

          &__button-noBorder {
            @include respond-to(sm) {
              color: ${currentTheme.white.hex};
            }
          }

          &__noData {
            @include respond-to(sm) {
              color: ${currentTheme.white.hex};
            }
          }

          &__borrow-table {
            @include respond-to(sm) {
              background: ${currentTheme.mainBg.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
