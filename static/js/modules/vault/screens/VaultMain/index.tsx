import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import NoDataPanel from '../../../../components/NoDataPanel';
import VaultAssetTable from '../../components/VaultAssetTable';
import messages from './messages';

import { VaultTableItem } from '../../components/VaultAssetTable/types';
import VaultMainWrapper from '../../../../components/wrappers/VaultMainWrapper';
import { mainet } from '../../../../ui-config/markets/tokensConfig';
import VaultBox from '../../../../images/vault-box.svg';
import Banks from '../../../../images/banks.svg';
import VaultMobileCard from '../../components/VaultAssetTable/VaultMobileCard';

export default function VaultMain() {
  const intl = useIntl();
  const { user } = useDynamicPoolDataContext();
  const { sm } = useThemeContext();

  const vaultReserves: VaultTableItem[] = [...mainet.vaultReserves];

  return (
    <ScreenWrapper
      pageTitle="Vaults"
      subTitle="Available to deposit"
      isTitleOnDesktop={true}
      withMobileGrayBg={true}
    >
      {!sm ? (
        <div className="VaultTableTitle">
          <div className="VaultTableTitle__wrapper">
            <div className="VaultTableTitle__wrapper__box">
              <img src={VaultBox} alt="" />
            </div>
            <div className="VaultTableTitle__wrapper__text">
              <div className="VaultTableTitle__wrapper__text-content">
                UwU Vaults allow you to earn yields from various strategies while issuing yosTokens
                or “yo Sifu shares". These can be used as collateral in UwU markets. This allows you
                to leverage your positions and access some of the best yields in DeFi.
              </div>
            </div>
            <div className="VaultTableTitle__wrapper__banks">
              <img src={Banks} alt="" />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <VaultMainWrapper contentTitle={intl.formatMessage(messages.availableToVault)}>
        {!!vaultReserves.length ? (
          <>
            {!sm ? (
              <VaultAssetTable listData={vaultReserves} userId={user?.id} />
            ) : (
              <>
                {vaultReserves.map((item, index) => (
                  <VaultMobileCard userId={user?.id} {...item} key={index} />
                ))}
              </>
            )}
          </>
        ) : (
          <NoDataPanel title={intl.formatMessage(messages.noDataText)} />
        )}
      </VaultMainWrapper>
      <style jsx={true} global={true}>
        {`
          .VaultTableTitle {
            padding-left: 18px;
            padding-right: 18px;
            &__wrapper {
              height: 162px;
              color: white;
              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              font-size: 27px;
              line-height: 32px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin-top: 32px;
              padding-left: 48px;
              background: #120d48;
              border-radius: 8px;
              align-items: center;
              &__box {
              }

              &__text {
                width: 100%;
                margin-left: 23px;
              }

              &__text-content {
                width: 1053px;
              }

              &__banks {
                margin-right: 97px;
              }
            }
          }
        `}
      </style>
    </ScreenWrapper>
  );
}
