import { useThemeContext } from '../../../libs/aave-ui-kit';
import classNames from 'classnames';
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useLanguageContext } from '../../../libs/language-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import DesktopPageTitle from '../../DesktopPageTitle';
import { useHeaderTitle, useWithDesktopTitle } from '../ScreensWrapper';

import staticStyles from './style';
import VersionSwitcher from '../../VersionSwitcher';

// Pages where the banners should be displayed
export const DISPLAY_BRIDGE_BANNER_PAGES = ['/deposit', '/repay'];

interface ScreenWrapperProps {
  pageTitle?: string;
  isTitleOnDesktop?: boolean;
  isTopLineSmall?: boolean;
  titleComponent?: ReactNode;
  className?: string;
  withMobileGrayBg?: boolean;
  subTitle?: string | ReactNode;
  children: ReactNode;
}

export default function ScreenWrapper({
  pageTitle,
  isTitleOnDesktop,
  isTopLineSmall,
  titleComponent,
  className,
  withMobileGrayBg,
  subTitle,
  children,
}: ScreenWrapperProps) {
  const { currentLangSlug } = useLanguageContext();
  const { currentTheme, isCurrentThemeDark } = useThemeContext();
  const {
    networkConfig: { bridge, name },
  } = useProtocolDataContext();
  const location = useLocation();
  const { setTitle } = useHeaderTitle();
  const { setTopPanelSmall } = useWithDesktopTitle();

  useEffect(() => {
    pageTitle && setTitle(pageTitle);
    // eslint-disable-next-line no-lone-blocks
    {
      if (isTitleOnDesktop || isTopLineSmall) {
        setTopPanelSmall(true);
        localStorage.setItem('isTopPanelSmall', 'true');
      } else {
        setTopPanelSmall(false);
        localStorage.setItem('isTopPanelSmall', 'false');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLangSlug, location.pathname]);

  return (
    <section
      className={classNames('ScreenWrapper', className, {
        ScreenWrapper__withDesktopTitle: isTitleOnDesktop,
      })}
    >
      {isTitleOnDesktop && (pageTitle || titleComponent) && (
        <div>
          <DesktopPageTitle
            title={!!titleComponent ? titleComponent : pageTitle}
            subTitle={subTitle}
          />
          <div style={{ paddingLeft: '25px' }}>
            <VersionSwitcher />
          </div>
        </div>
      )}
      {subTitle && <div className="ScreenWrapper__mobileSubTitle">{subTitle}</div>}

      {children}

      <div className="ScreenWrapper__mobile-bottomBorder">
        <p>i</p>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true}>{`
        @import 'src/_mixins/screen-size';
        .ScreenWrapper {
          &__mobileSubTitle {
            color: ${currentTheme.textDarkBlue.hex};
            background: ${currentTheme.whiteElement.hex};
          }
        }
      `}</style>
    </section>
  );
}
