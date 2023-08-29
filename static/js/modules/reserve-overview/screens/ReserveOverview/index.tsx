import { useIntl } from 'react-intl';
import classNames from 'classnames';

import routeParamValidationHOC, {
  ValidationWrapperComponentProps,
} from '../../../../components/RouteParamsValidationWrapper';
import { getLPTokenPoolLink } from '../../../../helpers/lp-tokens';
import { RATES_HISTORY_ENDPOINT } from '../../../../helpers/config/misc-config';
import { useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import { useThemeContext } from '../../../../libs/aave-ui-kit';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import NoDataPanel from '../../../../components/NoDataPanel';
import ReserveInformation from '../../components/ReserveInformation';
import UserInformation from '../../components/UserInformation';
import Link from '../../../../components/basic/Link';

import messages from './messages';
import staticStyles from './style';

import linkIcon from '../../../../images/blueLinkIcon.svg';
import { getAssetInfo } from '../../../../helpers/config/assets-config';

function ReserveOverview({
  poolReserve,
  userReserve,
  currencySymbol,
  walletBalance,
  user,
}: ValidationWrapperComponentProps) {
  const intl = useIntl();

  const { currentTheme, sm } = useThemeContext();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const asset = getAssetInfo(currencySymbol);

  const poolLink = getLPTokenPoolLink({
    symbol: currencySymbol,
    underlyingAsset: poolReserve.underlyingAsset,
  });

  const isReserveHistoryGraphsVisible = !!RATES_HISTORY_ENDPOINT;

  return (
    <ScreenWrapper
      pageTitle={intl.formatMessage(messages.pageTitle, { currencySymbol: asset.formattedName })}
      isTitleOnDesktop={
        (!sm && !poolReserve.borrowingEnabled) || (!sm && !isReserveHistoryGraphsVisible)
      }
      isTopLineSmall={
        !(!sm && !poolReserve.borrowingEnabled) || (!sm && !isReserveHistoryGraphsVisible)
      }
      className="ReserveOverview"
      withMobileGrayBg={true}
    >
      <div className="ReserveOverview__content">
        {sm && poolLink && (
          <div className="ReserveOverview__poolLink-inner">
            <p>
              {intl.formatMessage(messages.provideLiquidity, {
                here: (
                  <Link
                    to={poolLink}
                    title="here"
                    absolute={true}
                    inNewWindow={true}
                    bold={true}
                    color="secondary"
                  />
                ),
              })}
            </p>
            <img src={linkIcon} alt="" />
          </div>
        )}

        <div className="ReserveOverview__content-wrapper">
          <div className="ReserveOverview__content-wrapper__data">
            <div className="ReserveOverview__mobileUserInformation-wrapper">
              {user ? (
                <UserInformation
                  symbol={currencySymbol}
                  user={user}
                  poolReserve={poolReserve}
                  userReserve={userReserve}
                  walletBalance={walletBalance}
                />
              ) : (
                <NoDataPanel
                  title={intl.formatMessage(messages.noConnectWalletCaption)}
                  description={intl.formatMessage(messages.noConnectWalletDescription)}
                  withConnectButton={true}
                  className="ReserveOverview__noDataPanel"
                />
              )}
            </div>

            <ReserveInformation
              poolReserve={poolReserve}
              marketRefPriceInUsd={marketRefPriceInUsd}
              symbol={currencySymbol}
              dollarPrefix={true}
            />

            <div className="ReserveOverview__information ReserveOverview__user-information">
              <h3 className="ReserveOverview__information-title">Your information</h3>

              <ContentWrapper
                className={classNames('ReserveOverview__user-informationInner', {
                  ReserveOverview__noUser: !user,
                })}
              >
                {user ? (
                  <UserInformation
                    symbol={currencySymbol}
                    user={user}
                    poolReserve={poolReserve}
                    userReserve={userReserve}
                    walletBalance={walletBalance}
                  />
                ) : (
                  <NoDataPanel
                    title={intl.formatMessage(messages.noConnectWalletCaption)}
                    description={intl.formatMessage(messages.noConnectWalletDescription)}
                    withConnectButton={true}
                    className="ReserveOverview__noDataPanel"
                  />
                )}
              </ContentWrapper>
            </div>
          </div>
        </div>
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .ReserveOverview {
          h1 {
            font-weight: 600;
            font-size: 39px;
            line-height: 47px;
            color: white;
            margin-bottom: 16px;
          }
          h3 {
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            color: white;
          }

          &__information-title,
          &__poolLink-inner {
            color: ${currentTheme.textDarkBlue.hex};
          }
          &__noUser {
            background: #120d48 !important;
            border-radius: 8px;
          }
        }
      `}</style>
    </ScreenWrapper>
  );
}

export default routeParamValidationHOC({
  withWalletBalance: true,
})(ReserveOverview);
