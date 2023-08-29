import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';
import staticStyles from './style';

interface TopPanelWrapperProps {
  isCollapse: boolean;
  setIsCollapse?: (value: boolean) => void;
  children: ReactNode;
  className?: string;
  withoutCollapseButton?: boolean;
}

export default function TopPanelWrapper({ children, className }: TopPanelWrapperProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  return (
    <div className={classNames('TopPanelWrapper', className)}>
      <div className="TopPanelWrapper__content">{children}</div>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .TopPanelWrapper {
          margin-top: 24px;

          &__button {
            color: ${currentTheme.white.hex};
            &:hover {
              color: ${currentTheme.secondary.hex};
              span {
                &:before,
                &:after {
                  background: ${currentTheme.secondary.hex};
                }
              }
            }
            span {
              &:before,
              &:after {
                background: ${currentTheme.white.hex};
              }
            }
          }
        }
      `}</style>
    </div>
  );
}
