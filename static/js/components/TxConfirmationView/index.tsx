import { ChangeEvent, ReactNode, ReactNodeArray, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { EthereumTransactionTypeExtended } from '@aave/protocol-js';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { useThemeContext } from '../../libs/aave-ui-kit';
import { ChainId } from '@aave/contract-helpers';

import {
  getDefaultChainId,
  getSupportedChainIds,
} from '../../helpers/config/markets-and-network-config';
import { useUserWalletDataContext } from '../../libs/web3-data-provider';
import { useProtocolDataContext } from '../../libs/protocol-data-provider';
import {
  EthTransactionData,
  sendEthTransaction,
  TxStatusType,
} from '../../helpers/send-ethereum-tx';
import { ATokenInfo } from '../../helpers/get-atoken-info';
import Preloader from '../basic/Preloader';
import Caption from '../basic/Caption';
import InfoWrapper from '../wrappers/InfoWrapper';
import InfoPanel from '../InfoPanel';
import TxEstimationEditor from '../TxEstimationEditor';
import AddATokenButton from '../AddATokenButton';
import ActionsWrapper from './ActionsWrapper';
import ActionExecutionBox from './ActionExecutionBox';
import TxTopInfo from './TxTopInfo';
import NetworkMismatch from './NetworkMismatch';
import messages from './messages';
import staticStyles from './style';

export interface TxConfirmationViewProps {
  caption?: string;
  description?: string | ReactNodeArray | ReactNode;

  txChainId: ChainId;
  mainTxName: string;
  mainTxType?: string;
  boxTitle: string;
  boxDescription?: string;
  approveDescription?: string;
  children?: ReactNode;

  getTransactionsData: () => Promise<EthereumTransactionTypeExtended[]>;
  onMainTxExecuted?: (txHash: string) => void | Promise<void>;
  onMainTxConfirmed?: () => void | Promise<void>;

  goToAfterSuccess?: string;
  successButtonTitle?: string;
  buttonTitle?: string;
  onAfterSuccessClick?: (e: ChangeEvent) => void;

  warningMessage?: string;
  dangerousMessage?: string | null | {} | ReactNodeArray;
  blockingError?: string;
  mainTxFailedMessage?: string;

  className?: string;

  updateTransactionsData?: boolean;

  allowedChainIds?: ChainId[];
  aTokenData?: ATokenInfo;
}

export default function TxConfirmationView({
  caption,
  description,

  txChainId,
  mainTxType,
  mainTxName,
  boxTitle,
  boxDescription,
  approveDescription,
  children,

  getTransactionsData,
  onMainTxExecuted,
  onMainTxConfirmed,

  goToAfterSuccess,
  successButtonTitle,
  onAfterSuccessClick = () => {},
  buttonTitle,

  warningMessage,
  dangerousMessage,
  blockingError,
  mainTxFailedMessage,

  className,

  updateTransactionsData,
  allowedChainIds: _allowedChainIds,
  aTokenData,
}: TxConfirmationViewProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();
  const { library: provider, chainId } = useWeb3React<providers.Web3Provider>();
  const { disconnectWallet, currentProviderName } = useUserWalletDataContext();
  const [loadingTxData, setLoadingTxData] = useState(true);
  const [backendNotAvailable, setBackendNotAvailable] = useState(false);
  const { chainId: currentMarketChainId, networkConfig } = useProtocolDataContext();

  // todo: do types more sophisticated
  const [uncheckedApproveTxData, setApproveTxData] = useState({} as EthTransactionData);
  const [uncheckedApproveDelegationTxData, setApproveDelegationTxData] = useState(
    {} as EthTransactionData
  );
  const [uncheckedActionTxData, setActionTxData] = useState({} as EthTransactionData);
  const [selectedStep, setSelectedStep] = useState(1);
  const [unlockedSteps, setUnlockedSteps] = useState(1);

  /**
   * For some actions like e.g. stake/gov/migration we only allow certain networks (fork, kovan, mainnet).
   * We allow to browse these actions even while the user is on a different chain/network, therefore we can have multiple cases of mismatch,
   * 1. walletNetwork is not allowed for this action
   * 2. all networks or walletNetwork is allowed, but there the browsed market does not walletNetwork the walletNetwork
   */
  const currentWalletChainId = chainId as number;
  const allowedChainIds = _allowedChainIds?.filter((chainId) =>
    getSupportedChainIds().includes(chainId)
  );
  // current marketNetwork is supported if the action is either
  // not restricted to a network or the network is in the allow-list
  const currentMarketNetworkIsSupported =
    !allowedChainIds ||
    allowedChainIds?.find((network) =>
      networkConfig.isFork
        ? network === networkConfig.underlyingChainId
        : network === currentMarketChainId
    );

  let networkMismatch = false;
  let neededChainId = getDefaultChainId();

  if (currentMarketNetworkIsSupported && currentMarketChainId !== currentWalletChainId) {
    networkMismatch = true;
    neededChainId = currentMarketChainId;
  }

  if (!currentMarketNetworkIsSupported && txChainId !== currentWalletChainId) {
    networkMismatch = true;
    neededChainId = txChainId;
  }

  const [customGasPrice, setCustomGasPrice] = useState<string | null>(null);
  // todo: do types more sophisticated
  const approveTxData = uncheckedApproveTxData.unsignedData
    ? (uncheckedApproveTxData as EthTransactionData & {
        unsignedData: EthTransactionData;
      })
    : undefined;
  const approveDelegationTxData = uncheckedApproveDelegationTxData.unsignedData
    ? (uncheckedApproveDelegationTxData as EthTransactionData & {
        unsignedData: EthTransactionData;
      })
    : undefined;
  const actionTxData = uncheckedActionTxData.unsignedData
    ? (uncheckedActionTxData as EthTransactionData & {
        unsignedData: EthTransactionData;
      })
    : undefined;

  const handleGetTxData = async () => {
    try {
      const txs = await getTransactionsData();
      const approvalTxs = txs.filter((tx) => tx.txType === 'ERC20_APPROVAL');

      const actionTx = txs.find((tx) =>
        [
          'DLP_ACTION',
          'GOVERNANCE_ACTION',
          'STAKE_ACTION',
          'LOCK_ACTION',
          'GOV_DELEGATION_ACTION',
          'REWARD_ACTION',
          mainTxType,
        ].includes(tx.txType)
      );

      if (actionTx) {
        setActionTxData({
          txType: actionTx.txType,
          unsignedData: actionTx.tx,
          gas: actionTx.gas,
          name: mainTxName,
        });
      }

      if (approvalTxs.length > 0) {
        setApproveTxData({
          txType: approvalTxs[0].txType,
          unsignedData: approvalTxs[0].tx,
          gas: approvalTxs[0].gas,
          name: intl.formatMessage(messages.approve),
        });
      }

      if (approvalTxs.length > 1) {
        setApproveDelegationTxData({
          txType: approvalTxs[1].txType,
          unsignedData: approvalTxs[1].tx,
          gas: approvalTxs[1].gas,
          name: intl.formatMessage(messages.approveDelegation),
        });
      }

      setLoadingTxData(false);
      return true;
    } catch (e) {
      console.log('Error on txs loading', e);
      setBackendNotAvailable(true);
      setLoadingTxData(false);
      return false;
    }
  };

  const handleApprovalTxConfirmed = () => {
    setUnlockedSteps(2);
    setSelectedStep(2);
  };

  const handleApprovalDelegationTxConfirmed = () => {
    setUnlockedSteps(3);
    setSelectedStep(3);
  };

  useEffect(() => {
    if (
      (approveTxData?.error?.includes('disconnected') ||
        approveDelegationTxData?.error?.includes('disconnected') ||
        actionTxData?.error?.includes('disconnected')) &&
      currentProviderName?.includes('ledger')
    ) {
      setTimeout(() => disconnectWallet(new Error('Ledger device is disconnected')), 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveTxData?.error, approveDelegationTxData?.error, actionTxData?.error]);

  useEffect(() => {
    if (!networkMismatch) {
      // console.log('tx loading started');
      handleGetTxData();
    } else {
      setLoadingTxData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTransactionsData, networkMismatch]);

  if (loadingTxData) {
    return <Preloader withText={true} />;
  }

  const numberOfSteps = approveDelegationTxData ? 3 : approveTxData ? 2 : actionTxData ? 1 : 0;
  const mainTxConfirmed = actionTxData?.txStatus === TxStatusType.confirmed;
  const mainTxPending = actionTxData?.txStatus === TxStatusType.submitted;

  return (
    <div className={classNames('TxConfirmationView', className)}>
      {!!caption && (
        <Caption
          title={!mainTxConfirmed ? caption : intl.formatMessage(messages.congratulations)}
          description={
            !mainTxConfirmed
              ? description || intl.formatMessage(messages.transactionDetails, { br: <br /> })
              : intl.formatMessage(messages.successfullyExecuted)
          }
        />
      )}

      {!!children && (
        <div
          className={classNames('TxConfirmationView__content-inner', {
            TxConfirmationView__contentInner: !children,
          })}
        >
          <div className="TxConfirmationView__content">{children}</div>
        </div>
      )}
      <div className="TxConfirmationView__actions-inner">
        {networkMismatch && currentProviderName ? (
          <NetworkMismatch
            neededChainId={neededChainId}
            currentChainId={chainId as ChainId}
            currentProviderName={currentProviderName}
          />
        ) : (
          <ActionsWrapper
            approveTxData={approveTxData}
            approveDelegationTxData={approveDelegationTxData}
            actionTxData={actionTxData}
            selectedStep={selectedStep}
            setSelectedStep={setSelectedStep}
            numberOfSteps={numberOfSteps}
            unlockedSteps={unlockedSteps}
            error={backendNotAvailable || !!blockingError}
          >
            {(!blockingError || mainTxConfirmed) && (
              <>
                {approveTxData &&
                  selectedStep === 1 &&
                  approveTxData.txStatus !== TxStatusType.confirmed && (
                    <ActionExecutionBox
                      title={`Step ${selectedStep} of ${numberOfSteps + 1}: ${
                        backendNotAvailable
                          ? intl.formatMessage(messages.errorTitle)
                          : intl.formatMessage(messages.approve)
                      }`}
                      description={approveDescription}
                      onSubmitTransaction={() =>
                        sendEthTransaction(
                          approveTxData.unsignedData,
                          provider,
                          setApproveTxData,
                          customGasPrice,
                          {
                            onConfirmation: handleApprovalTxConfirmed,
                          }
                        )
                      }
                      txStatus={approveTxData.txStatus}
                      loading={approveTxData.loading}
                      failed={approveTxData.error}
                      buttonTitle={intl.formatMessage(messages.approve)}
                    />
                  )}

                {approveDelegationTxData &&
                  selectedStep === 2 &&
                  approveDelegationTxData.txStatus !== TxStatusType.confirmed && (
                    <ActionExecutionBox
                      title={`Step ${selectedStep} of ${numberOfSteps + 1}: ${
                        backendNotAvailable
                          ? intl.formatMessage(messages.errorTitle)
                          : intl.formatMessage(messages.approveDelegation)
                      }`}
                      description={approveDescription}
                      onSubmitTransaction={() =>
                        sendEthTransaction(
                          approveDelegationTxData.unsignedData,
                          provider,
                          setApproveDelegationTxData,
                          customGasPrice,
                          {
                            onConfirmation: handleApprovalDelegationTxConfirmed,
                          }
                        )
                      }
                      txStatus={approveDelegationTxData.txStatus}
                      loading={approveDelegationTxData.loading}
                      failed={approveDelegationTxData.error}
                      buttonTitle={intl.formatMessage(messages.approveDelegation)}
                    />
                  )}

                {actionTxData && selectedStep === numberOfSteps && (
                  <ActionExecutionBox
                    title={`Step ${selectedStep} of ${numberOfSteps + 1}: ${
                      backendNotAvailable ? intl.formatMessage(messages.errorTitle) : boxTitle
                    }`}
                    description={
                      (backendNotAvailable && intl.formatMessage(messages.errorDescription)) ||
                      blockingError ||
                      boxDescription
                    }
                    onSubmitTransaction={async () => {
                      const success = await handleGetTxData();
                      if (success) {
                        return sendEthTransaction(
                          actionTxData.unsignedData,
                          provider,
                          setActionTxData,
                          customGasPrice,
                          {
                            onExecution: onMainTxExecuted,
                            onConfirmation: onMainTxConfirmed,
                          }
                        );
                      } else {
                        setActionTxData((state) => ({
                          ...state,
                          txStatus: TxStatusType.error,
                          loading: false,
                          error: 'transaction no longer valid',
                        }));
                      }
                    }}
                    successButtonTitle={successButtonTitle}
                    goToAfterSuccess={goToAfterSuccess}
                    onAfterSuccessClick={onAfterSuccessClick}
                    buttonTitle={buttonTitle || boxTitle}
                    txStatus={actionTxData.txStatus}
                    loading={actionTxData.loading}
                    failed={actionTxData.error}
                    error={!mainTxPending && (backendNotAvailable || !!blockingError)}
                    numberOfSteps={numberOfSteps}
                    mainTxFailedMessage={mainTxFailedMessage}
                  />
                )}
              </>
            )}

            {((!!blockingError && !mainTxConfirmed && !mainTxPending) || backendNotAvailable) && (
              <TxTopInfo
                title={backendNotAvailable ? intl.formatMessage(messages.errorTitle) : boxTitle}
                description={
                  backendNotAvailable
                    ? intl.formatMessage(messages.errorDescription)
                    : blockingError
                }
                error={backendNotAvailable || !!blockingError}
              />
            )}
          </ActionsWrapper>
        )}

        {!mainTxConfirmed &&
          [ChainId.mainnet].includes(currentWalletChainId) &&
          currentMarketChainId === currentWalletChainId && (
            <TxEstimationEditor
              customGasPrice={customGasPrice}
              txs={[
                uncheckedApproveTxData,
                uncheckedApproveDelegationTxData,
                uncheckedActionTxData,
              ]}
              setCustomGasPrice={setCustomGasPrice}
              step={selectedStep}
              editDisabled={mainTxPending}
            />
          )}
      </div>

      <InfoWrapper>
        {!!warningMessage && !mainTxConfirmed && <InfoPanel>{warningMessage}</InfoPanel>}
        {!!dangerousMessage && !mainTxConfirmed && <InfoPanel>{dangerousMessage}</InfoPanel>}
      </InfoWrapper>

      {(global.window as any)?.ethereum?.isMetaMask &&
        mainTxConfirmed &&
        currentProviderName === 'browser' &&
        aTokenData?.address && <AddATokenButton aTokenData={aTokenData} />}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .TxConfirmationView {
          &__content {
            color: ${currentTheme.textDarkBlue.hex};
            background: rgba(57, 48, 159, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}
