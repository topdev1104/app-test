import { useIntl, MessageDescriptor } from 'react-intl';
import classNames from 'classnames';
import { useThemeContext, SpinLoader } from '../../../libs/aave-ui-kit';

import messages from './messages';
import staticStyles from './style';

interface DotStatusProps {
  confirmed?: boolean;
  submitted?: boolean;
  error?: boolean;
  failed?: boolean;
  type?: string;
}

export default function DotStatus({ confirmed, submitted, error, failed, type }: DotStatusProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  let statusTitle: MessageDescriptor | undefined = undefined;
  let status = '';
  if (confirmed) {
    statusTitle = messages.confirmed;
    status = 'confirmed';
  } else if (submitted) {
    statusTitle = messages.pending;
    status = 'executed';
  } else if (error) {
    statusTitle = messages.error;
    status = 'error';
  } else if (failed) {
    statusTitle = messages.failed;
    status = 'error';
  }

  return (
    <div className={classNames('DotStatus', `DotStatus__${status}`)}>
      {statusTitle && <p>{intl.formatMessage(statusTitle)}</p>}
      {submitted && !confirmed ? (
        <SpinLoader className="DotStatus__loader" color={currentTheme.orange.hex} />
      ) : (
        <span className="DotStatus__dot" />
      )}

      {status === 'confirmed' && type !== 'approve' && (
        <audio className="audio-element" autoPlay={true}>
          <source src="/uwu-sound-effect-By-Tuna.mp3"></source>
        </audio>
      )}

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .DotStatus {
          color: ${currentTheme.textDarkBlue.hex};

          &__confirmed {
            .DotStatus__dot {
              background: ${currentTheme.green.hex};
            }
          }
          &__error {
            .DotStatus__dot {
              background: ${currentTheme.red.hex};
            }
          }
        }
      `}</style>
    </div>
  );
}
