import { ReactNode } from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { gradient, useThemeContext } from '../../../libs/aave-ui-kit';

import { EthTransactionData, TxStatusType } from '../../../helpers/send-ethereum-tx';
import TxBottomStatusLine from '../TxBottomStatusLine';
import messages from './messages';
import staticStyles from './style';

interface ActionsWrapperProps {
  approveTxData?: EthTransactionData;
  approveDelegationTxData?: EthTransactionData;
  actionTxData?: EthTransactionData;
  selectedStep: number;
  setSelectedStep: (value: number) => void;
  numberOfSteps: number;
  unlockedSteps: number;
  error?: boolean;
  children: ReactNode;
}

export default function ActionsWrapper({
  approveTxData,
  approveDelegationTxData,
  actionTxData,
  selectedStep,
  setSelectedStep,
  numberOfSteps,
  unlockedSteps,
  error,
  children,
}: ActionsWrapperProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  const activeGradient = gradient(
    90,
    `${currentTheme.secondary.rgb}, 1`,
    0,
    `${currentTheme.primary.rgb}, 1`,
    100
  );
  const allowedGradient = gradient(
    90,
    `${currentTheme.secondary.rgb}, 0.5`,
    0,
    `${currentTheme.primary.rgb}, 0.5`,
    100
  );

  const approveSubmitted = approveTxData?.txStatus === TxStatusType.submitted;
  const approveConfirmed = approveTxData?.txStatus === TxStatusType.confirmed;
  const approveError = approveTxData?.error && approveTxData.txStatus === TxStatusType.error;
  const approveDelegationSubmitted = approveDelegationTxData?.txStatus === TxStatusType.submitted;
  const approveDelegationConfirmed = approveDelegationTxData?.txStatus === TxStatusType.confirmed;
  const approveDelegationError =
    approveDelegationTxData?.error && approveDelegationTxData.txStatus === TxStatusType.error;
  const actionSubmitted = actionTxData?.txStatus === TxStatusType.submitted;
  const actionConfirmed = actionTxData?.txStatus === TxStatusType.confirmed;
  const actionError = actionTxData?.error && actionTxData.txStatus === TxStatusType.error;

  return (
    <div
      className={classNames('ActionsWrapper', {
        ActionsWrapper__submitted: actionSubmitted,
        ActionsWrapper__confirmed: actionConfirmed,
        ActionsWrapper__error: (!actionConfirmed && actionError) || (error && !actionConfirmed),
      })}
    >
      <div className="ActionsWrapper__buttons">
        {approveTxData && (
          <div className="ActionsWrapper__buttons__button-wrapper">
            <div className="ActionsWrapper__buttons__button-title">
              <span>1</span>
              <p>{approveTxData.name}</p>
            </div>
            <button
              className={classNames('ActionsWrapper__button', {
                ActionsWrapper__buttonActive: selectedStep === 1,
                ActionsWrapper__buttonSubmitted: approveSubmitted,
                ActionsWrapper__buttonConfirmed: approveConfirmed || selectedStep > 1,
                ActionsWrapper__buttonError:
                  (!approveConfirmed && approveError) || (error && !approveConfirmed),
              })}
              onClick={() => setSelectedStep(1)}
              disabled={approveConfirmed || !!approveError || selectedStep === 1}
            ></button>
          </div>
        )}

        {approveDelegationTxData && (
          <div className="ActionsWrapper__buttons__button-wrapper">
            <div className="ActionsWrapper__buttons__button-title">
              <span>2</span>
              <p>{approveDelegationTxData.name}</p>
            </div>
            <button
              className={classNames('ActionsWrapper__button', {
                ActionsWrapper__buttonActive: selectedStep === 2,
                ActionsWrapper__buttonSubmitted: approveDelegationSubmitted,
                ActionsWrapper__buttonConfirmed: approveDelegationConfirmed || selectedStep > 2,
                ActionsWrapper__buttonError:
                  (!approveDelegationConfirmed && approveDelegationError) ||
                  (error && !approveDelegationConfirmed),
              })}
              onClick={() => setSelectedStep(2)}
              disabled={
                approveDelegationConfirmed || !!approveDelegationError || selectedStep === 2
              }
            ></button>
          </div>
        )}

        {actionTxData && (
          <div className="ActionsWrapper__buttons__button-wrapper">
            <div className="ActionsWrapper__buttons__button-title">
              <span>{numberOfSteps}</span>
              <p>{actionTxData.name}</p>
            </div>
            <button
              className={classNames('ActionsWrapper__button', {
                ActionsWrapper__buttonActive: selectedStep === numberOfSteps,
                ActionsWrapper__buttonSubmitted: actionSubmitted,
                ActionsWrapper__buttonConfirmed: actionConfirmed,
                ActionsWrapper__buttonError:
                  (!actionConfirmed && actionError) || (error && !actionConfirmed),
              })}
              onClick={() => unlockedSteps >= numberOfSteps && setSelectedStep(numberOfSteps)}
              disabled={actionConfirmed || !!actionError || selectedStep === numberOfSteps}
            ></button>
          </div>
        )}

        {!!numberOfSteps && (
          <div className="ActionsWrapper__buttons__button-wrapper">
            <div className="ActionsWrapper__buttons__button-title">
              <span>{numberOfSteps + 1}</span>
              <p>
                {!actionError
                  ? intl.formatMessage(actionSubmitted ? messages.pending : messages.finished)
                  : intl.formatMessage(messages.failed)}
              </p>
            </div>
            <button
              className={classNames('ActionsWrapper__button', {
                ActionsWrapper__buttonSubmitted: actionSubmitted,
                ActionsWrapper__buttonConfirmed: actionConfirmed,
                ActionsWrapper__buttonError:
                  (!actionConfirmed && actionError) || (error && !actionConfirmed),
              })}
              onClick={() => unlockedSteps > numberOfSteps && setSelectedStep(numberOfSteps + 1)}
              disabled={true}
            ></button>
          </div>
        )}
      </div>

      {children}

      {approveTxData && (approveConfirmed || approveSubmitted || !!approveError) && (
        <TxBottomStatusLine
          title={approveTxData.name}
          confirmed={approveConfirmed}
          submitted={approveSubmitted}
          failed={!!approveError}
          error={error && !approveConfirmed}
          txHash={approveTxData.txHash}
        />
      )}

      {approveDelegationTxData &&
        (approveDelegationConfirmed || approveDelegationSubmitted || !!approveDelegationError) && (
          <TxBottomStatusLine
            title={approveDelegationTxData.name}
            confirmed={approveDelegationConfirmed}
            submitted={approveDelegationSubmitted}
            failed={!!approveDelegationError}
            error={error && !approveDelegationConfirmed}
            txHash={approveDelegationTxData.txHash}
          />
        )}

      {actionTxData && (actionConfirmed || actionSubmitted || !!actionError) && (
        <TxBottomStatusLine
          title={actionTxData.name}
          confirmed={actionConfirmed}
          submitted={actionSubmitted}
          failed={!!actionError}
          error={error && !actionConfirmed}
          txHash={actionTxData.txHash}
        />
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .ActionsWrapper {
          background: rgba(57, 48, 159, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;

          &__submitted {
            border: 1px solid ${currentTheme.orange.hex};
          }
          &__confirmed {
            border: 1px solid ${currentTheme.green.hex};
          }
          &__error {
            border: 1px solid ${currentTheme.red.hex};
          }

          &__button {
            color: ${currentTheme.textDarkBlue.hex};
          }
          &__buttonAllowed {
            background: ${allowedGradient};
            color: ${currentTheme.white.hex};
            &:hover {
              background: ${activeGradient};
            }
          }
          &__buttonActive {
            background: #72eca2;
            height: 8px;
            border-radius: 8px;
            color: ${currentTheme.white.hex};
          }
          &__buttonSubmitted {
            background: ${currentTheme.orange.hex};
            color: ${currentTheme.white.hex};
          }
          &__buttonConfirmed {
            background: ${currentTheme.green.hex};
            color: ${currentTheme.white.hex};
            border-radius: 8px;
          }
          &__buttonError {
            background: ${currentTheme.red.hex};
            color: ${currentTheme.white.hex};
          }
        }
      `}</style>
    </div>
  );
}
