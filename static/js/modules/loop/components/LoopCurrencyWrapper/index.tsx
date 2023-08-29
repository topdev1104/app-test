import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

import { useReserveRatesHistory } from '../../../../libs/pool-data-provider/hooks/use-reserve-rates-history';
import { useLanguageContext } from '../../../../libs/language-provider';
import CurrencyScreenWrapper from '../../../../components/wrappers/CurrencyScreenWrapper';
import { ValidationWrapperComponentProps } from '../../../../components/RouteParamsValidationWrapper';
import { GraphPoint, InterestRateSeries } from '../../../../components/graphs/types';
import { RATES_HISTORY_ENDPOINT } from '../../../../helpers/config/misc-config';
import { getAssetInfo } from '../../../../helpers/config/assets-config';
import messages from './messages';

interface LoopCurrencyWrapperProps
  extends Pick<
    ValidationWrapperComponentProps,
    'userReserve' | 'poolReserve' | 'user' | 'currencySymbol'
  > {
  goBack?: () => void;
  children: ReactNode;
}

export default function LoopCurrencyWrapper({
  userReserve,
  poolReserve,
  user,
  currencySymbol,
  children,
}: LoopCurrencyWrapperProps) {
  const intl = useIntl();
  const { currentLangSlug } = useLanguageContext();
  const { currentTheme } = useThemeContext();
  const { data: borrowRatesHistory } = useReserveRatesHistory(poolReserve.id);
  const [series, setSeries] = useState<InterestRateSeries[]>([]);

  const asset = useMemo(() => getAssetInfo(currencySymbol), [currencySymbol]);

  const stableRateHistoryData = [] as GraphPoint[];
  const variableRateHistoryData = [] as GraphPoint[];
  borrowRatesHistory.forEach((item) => {
    stableRateHistoryData.push([
      item.timestamp,
      Number((Number(item.stableBorrowRate) * 100).toFixed(2)),
    ]);
    variableRateHistoryData.push([
      item.timestamp,
      Number((Number(item.variableBorrowRate) * 100).toFixed(2)),
    ]);
  });

  useEffect(() => {
    const series = [];
    if (poolReserve.stableBorrowRateEnabled) {
      series.push({
        name: intl.formatMessage(messages.graphDotStable),
        data: stableRateHistoryData,
      });
    }
    series.push({
      name: intl.formatMessage(messages.graphDotVariable),
      data: variableRateHistoryData,
    });
    setSeries(series);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowRatesHistory.length, currentLangSlug]);

  return (
    <CurrencyScreenWrapper
      title={intl.formatMessage(messages.pageTitle, {
        currencySymbol: asset.formattedName,
      })}
      isCollapseLocalStorageName="borrowCurrencyTopPanelIsCollapse"
      currencySymbol={currencySymbol}
      poolReserve={poolReserve}
      userReserve={userReserve}
      user={user}
      type="borrow"
      showGraphCondition={borrowRatesHistory.length > 1 && !!RATES_HISTORY_ENDPOINT}
      dots={
        poolReserve.stableBorrowRateEnabled
          ? [
              {
                name: intl.formatMessage(messages.graphDotStable),
                color: currentTheme.primary.hex,
              },
              {
                name: intl.formatMessage(messages.graphDotVariable),
                color: currentTheme.secondary.hex,
              },
            ]
          : []
      }
      series={series}
    >
      {children}
    </CurrencyScreenWrapper>
  );
}
