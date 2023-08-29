import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import {
  DropdownWrapper,
  rgba,
  textCenterEllipsis,
  useThemeContext,
} from '../../../libs/aave-ui-kit';

import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { useMenuContext } from '../../../libs/menu';
import Link from '../../basic/Link';
import ConnectButton from '../../ConnectButton';

import staticStyles from './style';
import messages from './messages';
import { getNetworkConfig } from '../../../helpers/config/markets-and-network-config';
import useGetEnsName from '../../../libs/hooks/use-get-ens-name';
import walletButton from '../../../images/wallet-button.svg';

export default function AddressInfo() {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();
  const { chainId } = useWeb3React();
  const {
    currentAccount,
    disconnectWallet,
    displaySwitchAccountModal,
    currentProviderName,
    availableAccounts,
  } = useUserWalletDataContext();
  const { ensName } = useGetEnsName(currentAccount);
  const ensNameAbbreviated = ensName
    ? ensName.length > 18
      ? textCenterEllipsis(ensName, 12, 3)
      : ensName
    : undefined;
  const { closeMobileMenu } = useMenuContext();

  const [visible, setVisible] = useState(false);
  const config = chainId ? getNetworkConfig(chainId) : undefined;
  const networkName = config && config.name;
  let longName = networkName;
  let networkColor = '';
  if (config?.isFork) {
    networkColor = '#ff4a8d';
    longName += ' fork';
  } else if (config?.isTestnet) {
    networkColor = '#7157ff';
    longName += ' test';
  } else {
    networkColor = '#65c970';
  }

  const borderColor = rgba(`${currentTheme.darkBlue.rgb}, 0.1`);
  const hoverColor = rgba(`${currentTheme.darkBlue.rgb}, 0.05`);

  return (
    <div className="AddressInfo">
      {currentAccount ? (
        <DropdownWrapper
          visible={visible}
          setVisible={setVisible}
          horizontalPosition="right"
          verticalPosition="bottom"
          className="AddressInfo__dropdownWrapper"
          buttonComponent={
            <button
              className={classNames('AddressInfo__button', { AddressInfo__buttonActive: visible })}
              onClick={() => setVisible(!visible)}
              type="button"
            >
              <img src={walletButton} />
              {ensNameAbbreviated ? ensNameAbbreviated : textCenterEllipsis(currentAccount, 4, 4)}
            </button>
          }
        >
          <div className="AddressInfo__content">
            <div className="AddressInfo__content-caption">
              <p className="AddressInfo__content-network">
                <i />
                <span>{intl.formatMessage(messages.networkShortName, { name: longName })}</span>
              </p>
              <p className="AddressInfo__content-address">{currentAccount}</p>
              {ensName ? <p className="AddressInfo__content-ens">{ensName}</p> : <></>}
            </div>

            {(currentProviderName?.includes('ledger') || availableAccounts.length > 1) && (
              <button
                className="AddressInfo__contentButton"
                type="button"
                onClick={() => displaySwitchAccountModal(true)}
              >
                <span>{intl.formatMessage(messages.changeAddress)}</span>
              </button>
            )}

            <button
              className="AddressInfo__contentButton"
              type="button"
              onClick={() => {
                disconnectWallet();
                closeMobileMenu();
              }}
            >
              <img src={walletButton} />
              <span>{intl.formatMessage(messages.disconnect)}</span>
            </button>
          </div>
        </DropdownWrapper>
      ) : (
        <ConnectButton size="small" />
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .DropdownWrapper__right .DropdownWrapper__content {
          background: #493fb5;

          span,
          p {
            color: white;
            font-weight: 600;
          }

          .AddressInfo__contentButton {
            img {
              display: none;
            }
          }
        }
        .AddressInfo {
          &__button {
            background: linear-gradient(90deg, #493fb5 0%, #312893 100%);
            color: white;
            border-radius: 8px;
            width: 158px;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
            height: 36px;

            &:hover {
              background: linear-gradient(90deg, #6259c5 0%, #564bce 100%);
            }

            img {
              margin-right: 8px;
            }
          }

          &__content {
            color: ${currentTheme.darkBlue.hex};
          }

          &__content-caption {
            border-bottom: 1px solid ${currentTheme.darkBlue.hex};
          }
          &__content-network {
            i {
              background: ${networkColor};
            }
          }

          &__contentButton {
            color: ${currentTheme.darkBlue.hex} !important;
            border-bottom: 1px solid ${borderColor};
            &:hover {
              background: ${hoverColor};
            }
          }
        }
      `}</style>
    </div>
  );
}
