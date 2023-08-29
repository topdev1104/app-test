import { ChangeEvent } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import classNames from 'classnames';

import { useThemeContext } from '../../../libs/aave-ui-kit';
import { TxStatusType } from '../../../helpers/send-ethereum-tx';
import DefaultButton from '../../basic/DefaultButton';
import Link from '../../basic/Link';

import messages from './messages';
import staticStyles from './style';

interface TextStatusProps {
  txStatus?: TxStatusType;
  goToAfterSuccess?: string;
  successButtonTitle?: string;
  submitted?: boolean;
  numberOfSteps?: number;
  onAfterSuccessClick?: (e: ChangeEvent) => void;
}

export default function TextStatus({
  txStatus,
  goToAfterSuccess = '/dashboard',
  successButtonTitle,
  submitted,
  numberOfSteps,
  onAfterSuccessClick = () => {},
}: TextStatusProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  let statusTitle: MessageDescriptor | undefined = undefined;
  if (txStatus === 'confirmed') {
    statusTitle = messages.confirmed;
  } else if (txStatus === 'error') {
    statusTitle = messages.failed;
  } else if (submitted) {
    statusTitle = messages.pending;
  }

  const step = (numberOfSteps || 1) + 1;

  const afterClickButton = (
    <DefaultButton
      className="TextStatus__button"
      title={successButtonTitle || intl.formatMessage(messages.dashboard)}
      onClick={onAfterSuccessClick}
    />
  );

  const afterClick = goToAfterSuccess ? (
    <Link to={goToAfterSuccess} className="ButtonLink">
      {afterClickButton}
    </Link>
  ) : (
    afterClickButton
  );

  return (
    <div className={classNames('TextStatus', `TextStatus__${txStatus}`)}>
      {statusTitle && (
        <p className="TextStatus__text">
          {txStatus === 'confirmed'
            ? `Step ${step} of ${step} ${intl.formatMessage(statusTitle)}`
            : intl.formatMessage(statusTitle)}
        </p>
      )}

      {txStatus === 'confirmed' && afterClick}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .TextStatus {
          color: ${currentTheme.orange.hex};
          &__submitted {
            .TextStatus__text {
              color: ${currentTheme.orange.hex};
            }
          }
          &__error {
            .TextStatus__text {
              color: ${currentTheme.red.hex};
            }
          }
          &__confirmed {
            .TextStatus__text {
              color: ${currentTheme.green.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
