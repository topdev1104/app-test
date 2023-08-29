import staticStyles from './style';
import buyArrow from '../../../../images/buy-arrow.svg';
import Refresh from '../../../../images/refresh.svg';

import MarketPrice from '../../components/MarketPrice';

import { useIntl } from 'react-intl';
import MarketCap from '../MarketCap';
import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import MarketCirculatingSupply from '../MarketCirculatingSupply';
import { TokenIcon } from '../../../../helpers/config/assets-config';
import MarketCapFully from '../MarketCapFully';
interface PlatformFeesPaidToLockedProps {
  totalPlatformFees: string;
}

export default function PlatformFeesPaidToLocked({
  totalPlatformFees,
}: PlatformFeesPaidToLockedProps) {
  const intl = useIntl();

  const { marketCap, uwuPrice } = useDynamicPoolDataContext();

  return (
    <>
      <div className="PlatformFeesPaidToLocked">
        <div className="PlatformFeesPaidToLocked__header">
          <div className="PlatformFeesPaidToLocked__header__title">Stats</div>
        </div>
        <div className="PlatformFeesPaidToLocked__content">
          <div className="PlatformFeesPaidToLocked__content__fullyMarketCap">
            <MarketCapFully value={marketCap} />
          </div>
          <div className="PlatformFeesPaidToLocked__content__marketCap">
            <MarketCap uwuPrice={uwuPrice} />
          </div>
          <div className="PlatformFeesPaidToLocked__content__supply">
            <MarketCirculatingSupply uwuPrice={uwuPrice} />
          </div>
        </div>
        <div className="PlatformFeesPaidToLocked__footer">
          <div className="PlatformFeesPaidToLocked__footer__price">
            <TokenIcon width={35} height={35} tokenSymbol={'uwu'} />
            <div>
              <div>
                <MarketPrice value={uwuPrice} />
              </div>
            </div>
            <a
              href="https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x55C08ca52497e2f1534B59E2917BF524D4765257"
              className="PlatformFeesPaidToLocked__footer__price__button"
            >
              <img src={Refresh} alt="refresh" />
              Buy
              <img src={buyArrow} alt="buyArrow" />
            </a>
          </div>
        </div>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
