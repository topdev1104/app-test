import { ReactNode } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import goToTop from '../../../helpers/goToTop';

import staticStyles from './style';

interface TableItemWrapperProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  withGoToTop?: boolean;
  darkOnDarkMode?: boolean;
}

export default function TableItemWrapper({
  onClick,
  disabled,
  className,
  children,
  withGoToTop,
}: TableItemWrapperProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div
      className={classNames(
        'TableItemWrapper',
        { TableItemWrapper__disabled: disabled },
        className
      )}
      onClick={() => {
        !disabled && onClick();
        withGoToTop && goToTop();
      }}
    >
      {children}

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .TableItemWrapper {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #ffffff;
          &:hover {
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
            background: #1c165b;
            border-radius: 16px;
            //border: 1px solid #4339ab;
          }
          &:active {
            border-color: ${currentTheme.primary.hex};
          }
        }
      `}</style>
    </div>
  );
}
