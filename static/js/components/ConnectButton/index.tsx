import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useThemeContext } from '../../libs/aave-ui-kit';
import { useUserWalletDataContext } from '../../libs/web3-data-provider';
import { useMenuContext } from '../../libs/menu';
import messages from './messages';
import staticStyles from './style';
import walletIcon from './images/wallet.svg';

interface ConnectButtonProps {
  className?: string;
  size?: 'small' | 'normal' | 'medium';
}

export default function ConnectButton({ className, size = 'normal' }: ConnectButtonProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();
  const { showSelectWalletModal } = useUserWalletDataContext();
  const { closeMobileMenu } = useMenuContext();

  return (
    <button
      className={classNames('ConnectButton', `ConnectButton__${size}`, className)}
      type="button"
      onClick={() => {
        showSelectWalletModal();
        closeMobileMenu();
      }}
    >
      <div className="ConnectButton__inner">
        <img className="ConnectButton__icon" src={walletIcon} alt="" />
        <span>{intl.formatMessage(messages.connectWallet)}</span>
      </div>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .ConnectButton {
          &:hover {
            .ConnectButton__inner {
              background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
            }
          }
          &__inner {
            background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
            border-radius: 24px;
            color: ${currentTheme.white.hex};
            font-weight: 600;
            height: 36px;
            width: 158px;
          }

          &__icon {
            margin-right: 10px;
          }
        }

        .ConnectButton__normal,
        .ConnectButton__medium {
          &:hover {
            .ConnectButton__inner {
              border-color: ${currentTheme.white.hex};
            }
          }

          .ConnectButton__inner {
            color: ${currentTheme.white.hex};
          }
        }
      `}</style>
    </button>
  );
}
