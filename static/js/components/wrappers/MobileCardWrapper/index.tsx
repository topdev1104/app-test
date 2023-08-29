import { ReactNode } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import goToTop from '../../../helpers/goToTop';
import { getAssetInfo, TokenIcon } from '../../../helpers/config/assets-config';

import staticStyles from './style';

interface MobileCardWrapperProps {
  onClick?: () => void;
  disabled?: boolean;
  withGoToTop?: boolean;
  symbol: string;
  className?: string;
  subSymbolComponent?: ReactNode;
  children: ReactNode;
}

export default function MobileCardWrapper({
  symbol,
  onClick,
  disabled,
  withGoToTop,
  className,
  subSymbolComponent,
  children,
}: MobileCardWrapperProps) {
  const { currentTheme } = useThemeContext();

  const asset = getAssetInfo(symbol);

  return (
    <div
      className={classNames('MobileCardWrapper', className)}
      onClick={() => {
        !disabled && onClick && onClick();
        withGoToTop && goToTop();
      }}
    >
      <div className="MobileCardWrapper__symbol--inner">
        <TokenIcon tokenSymbol={symbol} height={24} width={24} tokenFullName={asset.name} />
        {subSymbolComponent}
      </div>

      <div className="MobileCardWrapper__content">{children}</div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .MobileCardWrapper {
          background: #120d48;
          box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
          border-radius: 8px;

          &__symbol--inner {
            border-bottom: 1px solid ${currentTheme.mainBg.hex};
          }
        }
      `}</style>
    </div>
  );
}
