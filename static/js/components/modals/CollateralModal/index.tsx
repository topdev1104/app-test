import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useThemeContext, BasicModal } from '../../../libs/aave-ui-kit';
import { calculateHealthFactorFromBalancesBigUnits, valueToBigNumber } from '@aave/protocol-js';
import { UserSummary, useStaticPoolDataContext } from '../../../libs/pool-data-provider';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import PoolTxConfirmationView from '../../../components/PoolTxConfirmationView';
import Row from '../../../components/basic/Row';
import NoDataPanel from '../../../components/NoDataPanel';
import HealthFactor from '../../../components/HealthFactor';
import { getAssetInfo, TokenIcon } from '../../../helpers/config/assets-config';
import messages from './messages';

interface CollateralModalProps {
  showModal: boolean;
  onBackdropPress: () => void;
  history: any;
  id: string;
  usageAsCollateralEnabledOnUser: boolean;
  underlyingAsset: string;
  user: UserSummary | undefined;
  userReserve: any;
  poolReserve: any;
  asCollateral: boolean;
}

export default function CollateralModal({
  showModal,
  onBackdropPress,
  history,
  id,
  usageAsCollateralEnabledOnUser,
  underlyingAsset,
  user,
  userReserve,
  poolReserve,
  asCollateral,
}: CollateralModalProps) {
  const { lendingPool } = useTxBuilderContext();
  const { WrappedBaseNetworkAssetAddress, networkConfig } = useStaticPoolDataContext();
  const [isTxExecuted, setIsTxExecuted] = useState(false);
  const { lg, md } = useThemeContext();
  const intl = useIntl();

  const asset = getAssetInfo(poolReserve.symbol);

  if (!user) {
    return (
      <NoDataPanel
        title={intl.formatMessage(messages.connectWallet)}
        description={intl.formatMessage(messages.connectWalletDescription)}
        withConnectButton={true}
      />
    );
  }

  if (!userReserve) {
    return null;
  }

  const handleGetTransactions = async () =>
    await lendingPool.setUsageAsCollateral({
      user: user.id,
      reserve:
        poolReserve.symbol === networkConfig.baseAsset
          ? WrappedBaseNetworkAssetAddress
          : poolReserve.underlyingAsset,
      usageAsCollateral: asCollateral === true,
    });
  const usageAsCollateralModeAfterSwitch = !userReserve.usageAsCollateralEnabledOnUser;
  const currenttotalCollateralMarketReferenceCurrency = valueToBigNumber(
    user.totalCollateralMarketReferenceCurrency
  );

  const totalCollateralAfterSwitchETH = currenttotalCollateralMarketReferenceCurrency[
    usageAsCollateralModeAfterSwitch ? 'plus' : 'minus'
  ](userReserve.underlyingBalanceMarketReferenceCurrency);

  const healthFactorAfterSwitch = calculateHealthFactorFromBalancesBigUnits(
    totalCollateralAfterSwitchETH,
    user.totalBorrowsMarketReferenceCurrency,
    user.currentLiquidationThreshold
  );

  let blockingError = '';
  if (valueToBigNumber(userReserve.underlyingBalance).eq(0)) {
    blockingError = intl.formatMessage(messages.errorDoNotHaveDepositsInThisCurrency);
  }
  if (
    (!userReserve.usageAsCollateralEnabledOnUser && !poolReserve.usageAsCollateralEnabled) ||
    !poolReserve.usageAsCollateralEnabled
  ) {
    blockingError = intl.formatMessage(messages.errorCanNotUseThisCurrencyAsCollateral);
  }

  if (
    userReserve.usageAsCollateralEnabledOnUser &&
    user.totalBorrowsMarketReferenceCurrency !== '0' &&
    healthFactorAfterSwitch.lte('1')
  ) {
    blockingError = intl.formatMessage(messages.errorCanNotSwitchUsageAsCollateralMode);
  }
  const pageTitle = asCollateral === true ? messages.pageTitleFirst : messages.pageTitleSecond;
  const caption =
    asCollateral === true
      ? intl.formatMessage(messages.firstCaption, {
          currencySymbol: asset.formattedName,
        })
      : intl.formatMessage(messages.secondCaption, {
          currencySymbol: asset.formattedName,
        });

  const handleMainTxExecuted = () => setIsTxExecuted(true);

  const tokenIconSize = lg && !md ? 20 : 25;

  return (
    <BasicModal
      className="AddressModal"
      isVisible={showModal}
      onBackdropPress={onBackdropPress}
      withCloseButton={true}
    >
      <PoolTxConfirmationView
        mainTxName={intl.formatMessage(messages.txName)}
        caption={caption}
        boxTitle={intl.formatMessage(messages.boxTitle)}
        boxDescription={intl.formatMessage(
          asCollateral === true ? messages.boxDescriptionUse : messages.boxDescriptionNotUse,
          { currencySymbol: asset.formattedName }
        )}
        getTransactionsData={handleGetTransactions}
        onMainTxExecuted={handleMainTxExecuted}
        blockingError={blockingError}
        buttonTitle={intl.formatMessage(messages.buttonTitle)}
      >
        <Row
          title={intl.formatMessage(messages.rowTitle)}
          withMargin={Number(user.healthFactor) > 0}
        >
          <TokenIcon
            tokenSymbol={poolReserve.symbol}
            height={tokenIconSize}
            width={tokenIconSize}
            tokenFullName={asset.formattedName}
          />
        </Row>

        {Number(user.healthFactor) > 0 && (
          <HealthFactor
            title={intl.formatMessage(messages.currentHealthFactor)}
            value={user.healthFactor}
            updateCondition={isTxExecuted}
          />
        )}

        {Number(healthFactorAfterSwitch) > 0 && (
          <HealthFactor
            title={intl.formatMessage(messages.nextHealthFactor)}
            value={healthFactorAfterSwitch.toString()}
            updateCondition={isTxExecuted}
            withoutModal={true}
          />
        )}
      </PoolTxConfirmationView>
    </BasicModal>
  );
}
