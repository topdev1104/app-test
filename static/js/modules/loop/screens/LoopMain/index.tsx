import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import { isAssetStable } from '../../../../helpers/config/assets-config';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import NoDataPanel from '../../../../components/NoDataPanel';
import Borrow1ClickLoopForm from '../../../../components/Borrow1ClickLoopForm';
import LoopCurrencyWrapper from '../../components/LoopCurrencyWrapper';
import messages from './messages';
import staticStyles from './style';

function LoopMain() {
  const intl = useIntl();
  const { location } = useHistory();
  const { reserves, user } = useDynamicPoolDataContext();

  const [reserveId, setReserveId] = useState<string>('');

  const stableReserves = useMemo(
    () =>
      reserves.filter(
        ({ symbol, borrowingEnabled, isActive }) =>
          borrowingEnabled && isActive && isAssetStable(symbol)
      ),
    [reserves]
  );

  useEffect(() => {
    if (!!reserveId || stableReserves.length === 0) {
      return undefined;
    }

    const query = queryString.parse(location.search);
    const selectedSymbol = query.symbol ? query.symbol : 'USDT';

    const usdtReverse = reserves.find((item) => item.symbol.toUpperCase() === selectedSymbol);

    if (!!usdtReverse) {
      setReserveId(usdtReverse.id);
    } else {
      setReserveId(stableReserves[0]?.id);
    }
  }, [stableReserves]);

  // console.log('reserves===', reserves);
  const poolReserve = useMemo(
    () => reserves.find((res) => res.id === reserveId),
    [reserves, reserveId]
  );

  const userReserve = useMemo(
    () => user?.userReservesData.find((userReserve) => userReserve.reserve.id === reserveId),
    [user, reserveId]
  );

  const currencySymbol = poolReserve?.symbol.toUpperCase() || '';

  return (
    <>
      <div className="LoopMain">
        <ScreenWrapper pageTitle={''} isTitleOnDesktop={false} withMobileGrayBg={true}>
          {!!poolReserve ? (
            <LoopCurrencyWrapper
              currencySymbol={currencySymbol}
              poolReserve={poolReserve}
              user={user}
              userReserve={userReserve}
            >
              <Borrow1ClickLoopForm
                stableReserves={reserves}
                currencySymbol={currencySymbol}
                user={user}
                poolReserve={poolReserve}
                setReserveId={setReserveId}
                className="LoopMain__1-click-loop-form"
              />
            </LoopCurrencyWrapper>
          ) : (
            <NoDataPanel title={intl.formatMessage(messages.noDataText)} />
          )}
        </ScreenWrapper>
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}

export default LoopMain;
