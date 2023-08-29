import { useState } from 'react';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';

import BasicForm from '../../../../components/forms/BasicForm';
import Value from '../../../../components/basic/Value';
import LockConfirmation from '../LockConfirmation';
// import iconLock from '../../images/icon-lock.svg';
import staticStyles from './style';
import { ComputedReserveData } from '../../../../libs/pool-data-provider';
import { ValidationWrapperComponentProps } from '../../../../components/RouteParamsValidationWrapper';

interface ContentItemLockProps extends Pick<ValidationWrapperComponentProps, 'poolReserve'> {
  maxAmount: string;
  currencySymbol: string;
  walletBalance: BigNumber;
  depositBalance: BigNumber;
  priceInMarketReferenceCurrency: string;
  onMainTxConfirmed: () => void;
  poolReserve: ComputedReserveData;
}

function ContentItemLock({
  poolReserve,
  maxAmount,
  currencySymbol,
  priceInMarketReferenceCurrency,
  walletBalance,
  depositBalance,
  onMainTxConfirmed,
}: ContentItemLockProps) {
  const [amount, setAmount] = useState<BigNumber | null>(null);
  const [version] = useState<String>(window.localStorage.getItem('version') ?? 'v2');

  return (
    <div className="ManageRadiant__content-lock">
      {!!amount ? (
        <LockConfirmation
          amount={amount}
          maxAmount={valueToBigNumber(maxAmount)}
          onMainTxConfirmed={onMainTxConfirmed}
          onAfterSuccessClick={() => {
            setAmount(null);
          }}
        />
      ) : (
        <>
          <div className="ManageRadiant__form-controls">
            {version === 'v2' && (
              <BasicForm
                maxAmount={maxAmount}
                currencySymbol={currencySymbol}
                onSubmit={(amount) => setAmount(new BigNumber(amount))}
                submitButtonTitle="Lock"
                poolReserve={poolReserve}
              />
            )}
          </div>

          {/* <div className="ManageRadiant__form-legend">
           <label className="ManageRadiant__input-label">Wallet Balance:</label>

           <Value
           className="ManageRadiant__value"
           symbol={currencySymbol}
           value={walletBalance.toString()}
           tokenIcon={false}
           subSymbol="USD"
           maximumValueDecimals={2}
           />
           </div> */}

          <div className="ManageRadiant__content-description">
            {version !== 'v3' ? (
              <p>
                UWU-ETH LPs can be generated from providing liquidity at{' '}
                <a
                  href="https://sushi.com"
                  style={{ color: 'rgba(255,255,255, 0.6)', textDecoration: 'underline' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  sushi.com
                </a>
              </p>
            ) : (
              <p>
                Liquidity should be provided within specific range. To provide liquidity, click{' '}
                <a
                  href="https://app.uniswap.org/#/add/0x55C08ca52497e2f1534B59E2917BF524D4765257/ETH/10000?minPrice=0.0085407&maxPrice=0.0097253"
                  style={{ color: 'rgba(255,255,255, 0.6)', textDecoration: 'underline' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </a>
                .
              </p>
            )}
            {/* <p>Lock UwU-ETH LPs and earn platform fees and penalty fees in unlocked UwU.</p>
             <p>
             Locked LPs is subject to a 8 week lock (56 days) and will continue to earn fees after
             the locks expire if you do not withdraw.
             </p> */}
          </div>
        </>
      )}
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}

export default ContentItemLock;
