import { ReactNode } from 'react';
import classNames from 'classnames';

import staticStyles from './style';

interface TableItemWrapperNoClickProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  withGoToTop?: boolean;
  darkOnDarkMode?: boolean;
}

export default function TableItemWrapperNoClick({
  onClick,
  disabled,
  className,
  children,
}: TableItemWrapperNoClickProps) {
  return (
    <div
      className={classNames(
        'TableItemWrapperNoClick',
        { TableItemWrapper__disabled: disabled },
        className
      )}
    >
      {children}

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .TableItemWrapperNoClick {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
