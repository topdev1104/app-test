import { ReactNode } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';
import staticStyles from './style';

interface ContentWrapperProps {
  className?: string;
  withFullHeight?: boolean;
  children: ReactNode;
}

export default function ContentWrapper({
  className,
  children,
  withFullHeight,
}: ContentWrapperProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div
      className={classNames(
        'ContentWrapper',
        { ContentWrapper__fullHeight: withFullHeight },
        className
      )}
    >
      {children}

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .ContentWrapper {
          color: ${currentTheme.darkBlue.hex};

          &__back-button {
            color: white;
            &:hover {
              background: #4339ab;
              color: white;
              span {
                border-color: white;
                &:after {
                  border: solid white;
                  border-width: 0 1px 1px 0;
                }
              }
            }
            span {
              &:after {
                border: solid white;
                border-width: 0 1px 1px 0;
              }
            }
          }
        }
      `}</style>
    </div>
  );
}
