import { ReactNode } from 'react';
import { useThemeContext } from '../../../../../libs/aave-ui-kit';

import TableCol from '../TableCol';
import { getAssetInfo, TokenIcon } from '../../../../../helpers/config/assets-config';

import staticStyles from './style';

interface TableItemProps {
  tokenSymbol: string;
  color?: string;
  children: ReactNode;
}

export default function TableItem({ tokenSymbol, color, children, ...rest }: TableItemProps) {
  const { lg } = useThemeContext();
  const asset = getAssetInfo(tokenSymbol);

  return (
    <div className="TableItem">
      <span className="TableItem__assetColor" style={{ backgroundColor: color }} />

      <TableCol className="TableItem__inner" maxWidth={lg ? 250 : 160}>
        <TokenIcon
          tokenSymbol={tokenSymbol}
          tokenFullName={asset.shortSymbol || asset.formattedName}
          height={26}
          width={26}
          className="TableItem__token"
        />
      </TableCol>

      {children}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
