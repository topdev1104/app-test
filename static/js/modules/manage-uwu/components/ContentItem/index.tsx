import { ReactNode } from 'react';
import classNames from 'classnames';

import staticStyles from './style';
import { TokenIcon } from '../../../../libs/aave-ui-kit';

interface ContentItemProps {
  className?: string;
  apr?: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode;
}

export default function ContentItem({
  className,
  apr,
  title,
  description,
  children,
}: ContentItemProps) {
  const version = window.localStorage.getItem('version') ?? 'v2';

  return (
    <>
      <div className={classNames('ManageRadiant__content-item', className)}>
        <div className="ManageRadiant__content-title">
          <h3>Lock UwU-ETH LP</h3>

          {apr && version === 'v2' && (
            <span>
              <TokenIcon tokenSymbol={'uwu'} height={16} width={16} />
              <strong>{apr !== 'NaN%' && apr !== 'Infinity%' ? apr : 'Fetching...'}</strong> APR
            </span>
          )}
        </div>
        <p>
          {version === 'v3'
            ? 'To start earning platform revenues - lock UWU/WETH liqudity NFTs.'
            : 'Lock UwU-ETH LPs and earn platform fees and penalty fees in unlocked UwU.'}
        </p>
        <div className="ManageRadiant__content-form">{children}</div>
        {description && <div className="ManageRadiant__content-description">{description}</div>}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
