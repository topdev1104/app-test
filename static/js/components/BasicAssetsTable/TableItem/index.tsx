import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import TableColumn from '../../BasicTable/TableColumn';
import FreezedWarning from '../../FreezedWarning';
import { getAssetInfo, TokenIcon } from '../../../helpers/config/assets-config';

import staticStyles from './style';
import TableItemWrapperNoClick from '../../BasicTable/TableItemWrapperNoClickDeposit';
import DefaultButton from '../../basic/DefaultButton';

interface TableItemProps {
  symbol: string;
  isFreezed?: boolean;
  children?: ReactNode;
  darkOnDarkMode?: boolean;
  onClick: () => void;
}

export default function TableItem({
  symbol,
  isFreezed,
  children,
  darkOnDarkMode,
  onClick,
}: TableItemProps) {
  const history = useHistory();
  const asset = getAssetInfo(symbol);

  return (
    <TableItemWrapperNoClick
      className={classNames('TableItem', {
        TableItem__withHeight: darkOnDarkMode,
      })}
      // onClick={() => history.push(url)}
      withGoToTop={true}
      darkOnDarkMode={darkOnDarkMode}
    >
      <TableColumn className="TableItem__token-inner">
        <TokenIcon
          tokenSymbol={symbol}
          height={35}
          width={35}
          tokenFullName={asset.shortSymbol || asset.name}
          className="TableItem__tokenIcon"
        />
      </TableColumn>
      <div className="TableItem__content">
        {children}

        {isFreezed && (
          <TableColumn>
            <FreezedWarning symbol={symbol} className="TableItem__freezedWarning" />
          </TableColumn>
        )}
      </div>
      <DefaultButton title="Deposit" color="primary" onClick={onClick} disabled={isFreezed} />
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </TableItemWrapperNoClick>
  );
}
