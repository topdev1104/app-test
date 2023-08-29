import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import TableColumn from '../../BasicTable/TableColumn';
import FreezedWarning from '../../FreezedWarning';
import { getAssetInfo, TokenIcon } from '../../../helpers/config/assets-config';

import staticStyles from './style';
import TableItemWrapperNoClick from '../../BasicTable/TableItemWrapperNoClickDeposit';
import DefaultButton from '../../basic/DefaultButton';

interface TableItemBorrowProps {
  symbol: string;
  isFreezed?: boolean;
  disabledButton?: boolean;
  children?: ReactNode;
  darkOnDarkMode?: boolean;
  onClick: () => void;
}

export default function TableItemBorrow({
  symbol,
  isFreezed,
  disabledButton,
  children,
  darkOnDarkMode,
  onClick,
}: TableItemBorrowProps) {
  const history = useHistory();
  const asset = getAssetInfo(symbol);

  return (
    <TableItemWrapperNoClick
      className={classNames('TableItemBorrow', {
        TableItem__withHeight: darkOnDarkMode,
      })}
      // onClick={() => history.push(url)}
      withGoToTop={true}
      darkOnDarkMode={darkOnDarkMode}
    >
      <TableColumn className="TableItemBorrow__token-inner">
        <TokenIcon
          tokenSymbol={symbol}
          height={35}
          width={35}
          tokenFullName={asset.shortSymbol || asset.name}
          className="TableItemBorrow__tokenIcon"
        />
      </TableColumn>
      <div className="TableItemBorrow__content">
        {children}

        {isFreezed && (
          <TableColumn>
            <FreezedWarning symbol={symbol} className="TableItemBorrow__freezedWarning" />
          </TableColumn>
        )}
      </div>
      <DefaultButton
        title="Borrow"
        color="primary"
        onClick={onClick}
        disabled={isFreezed || disabledButton}
      />
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </TableItemWrapperNoClick>
  );
}
