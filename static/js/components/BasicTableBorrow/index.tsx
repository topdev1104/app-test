import React, { ReactNode } from 'react';
import classNames from 'classnames';

import staticStyles from './style';
import { useThemeContext } from '../../libs/aave-ui-kit';

interface BasicTableProps {
  children: ReactNode;
  headerColumns?: ReactNode;
  className?: string;
}

export default function BasicTableBorrow({ children, headerColumns, className }: BasicTableProps) {
  const { sm } = useThemeContext();

  return (
    <div className={classNames('BasicTableBorrow', className)}>
      <div className="BasicTableBorrow__wrapper">
        {!!headerColumns && <div className="BasicTableBorrow__header">{headerColumns}</div>}

        <div className="BasicTableBorrow__content">
          {!sm ? (
            <div className="BasicTableBorrow__content-inner">{children}</div>
          ) : (
            <div className="BasicTableBorrow__content-inner">{children}</div>
          )}
        </div>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
