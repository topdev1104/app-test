import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import ContentWrapperWithTopLine from '../ContentWrapperWithTopLine';
import staticStyles from './style';

interface VaultMainWrapperProps {
  children: ReactNode;
  contentTitle: string;
}

export default function VaultMainWrapper({ children, contentTitle }: VaultMainWrapperProps) {
  const { currentTheme, sm } = useThemeContext();

  return (
    <div className="VaultMainWrapper">
      <div className="VaultMainWrapper__left-inner">
        {!sm && (
          <ContentWrapperWithTopLine title={contentTitle} className="">
            <div className="VaultMainWrapper__content">{children}</div>
          </ContentWrapperWithTopLine>
        )}

        {sm && <div className="VaultMainWrapper__mobile--content">{children}</div>}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .VaultMainWrapper {
          &__caption {
            color: ${currentTheme.textDarkBlue.hex};
          }
          .VaultMainWrapper__changeMarket-inner {
            color: ${currentTheme.textDarkBlue.hex};
          }

          &__right-content {
            background: #120d48;
            border: 1px solid rgba(57, 48, 159, 0.1);
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            height: 97%;
          }
        }
      `}</style>
    </div>
  );
}
