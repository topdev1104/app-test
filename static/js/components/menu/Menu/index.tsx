import { useHistory, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { rgba, useThemeContext } from '../../../libs/aave-ui-kit';

import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import goToTop from '../../../helpers/goToTop';
import Link from '../../basic/Link';
import MenuLink from '../MenuLink';
import AddressInfo from '../AddressInfo';
import MobileContent from '../MobileContent';
import { LOGO } from '../../../ui-config';
import mobileLogo from '../../../images/logo-mobile.svg';

import staticStyles from './style';

import navigation from '../navigation';

interface MenuProps {
  title: string;
}

export default function Menu({ title }: MenuProps) {
  const location = useLocation();
  const history = useHistory();
  const intl = useIntl();
  const { currentTheme } = useThemeContext();
  const { currentAccount } = useUserWalletDataContext();
  const { currentMarketData } = useProtocolDataContext();

  const isActive = (url: string) => {
    return `/${url.split('/')[1]}` === `/${location.pathname.split('/')[1]}`;
  };

  const topLineColor = rgba(`${currentTheme.white.rgb}, 0.1`);

  return (
    <header className="Menu">
      <div className="Menu__logo-inner">
        <Link className="Menu__logo-link" to="/markets" onClick={() => goToTop()}>
          <img src={LOGO} alt="UwU" />
        </Link>
      </div>

      <div className="Menu__title-inner">
        <div className="Menu__burger-inner">
          <MobileContent isActive={isActive} currentAccount={currentAccount} />
        </div>

        <img src={mobileLogo} alt="" />
      </div>

      <div className="Menu__right-inner">
        <nav className="Menu__navigation-inner">
          <ul>
            {navigation.map((link, index) => (
              <li
                className={classNames('Menu__link-inner', {
                  Menu__linkHidden:
                    (!currentAccount && link.hiddenWithoutWallet) ||
                    (link.isVisible && !link.isVisible(currentMarketData)),
                })}
                key={index}
              >
                <MenuLink
                  to={link.link}
                  title={intl.formatMessage(link.title)}
                  isActive={isActive(link.link)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        <div className="Menu__buttons-inner">
          <AddressInfo />
        </div>
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .Menu {
          &__title-inner {
            p {
              color: ${currentTheme.white.hex};
            }
          }
        }
      `}</style>
    </header>
  );
}
