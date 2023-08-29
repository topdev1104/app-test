import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import queryString from 'query-string';
import { valueToBigNumber } from '@aave/protocol-js';

import messages from './messages';

import { TokenIcon } from '../../../../helpers/config/assets-config';
import VaultCurrencyWrapper from '../../components/VaultCurrencyWrapper';
import VaultForm from '../../../../components/forms/VaultForm';
import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import { useHistory, useParams } from 'react-router-dom';
import { mainet } from '../../../../ui-config/markets/tokensConfig';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { getProvider } from '../../../../helpers/config/markets-and-network-config';
import { Calculator } from '../../utils/calculator';

import {
  YoSifuStargateVaultContract,
  YoSifuStargateVaultWrapperContract,
} from '../../../../libs/aave-protocol-js/YoSifuStargateVault';
import { BigNumber } from 'ethers/lib.esm/ethers';
import ValuePercent from '../../../../components/basic/ValuePercent';
import { ValidationWrapperComponentProps } from '../../../../components/RouteParamsValidationWrapper';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

function VaultCurrency({ poolReserve }: ValidationWrapperComponentProps) {
  const [apr, setAPR] = useState<string>('0');
  const [totalAssets, setTotalAssets] = useState<string>('0');
  const [rate, setRate] = useState<string>('0');

  const intl = useIntl();
  const { chainId } = useProtocolDataContext();
  const history = useHistory();
  const { user } = useDynamicPoolDataContext();
  const { asset, action } = useParams<{ asset: string; action: string }>();
  const { provider: uwuProvider } = useUwuProviderContext();

  const reserve = mainet.vaultReserves.find((reserve) => reserve.asset === asset);
  const currencySymbol = reserve?.symbol || '';

  useEffect(() => {
    if (reserve) {
      const vaultContract = new YoSifuStargateVaultContract(uwuProvider, reserve.vault);
      const yoSifuStargateVaultWrapperContract = new YoSifuStargateVaultWrapperContract(
        uwuProvider,
        mainet.YoSifuStargateVaultWrapper
      );

      vaultContract.totalSupply().then((totalSupply) => {
        if (reserve) {
          setTotalAssets(
            valueToBigNumber(totalSupply.toString())
              .div(valueToBigNumber(10).exponentiatedBy(valueToBigNumber(reserve?.decimals)))
              .toString()
          );
        }
      });

      yoSifuStargateVaultWrapperContract
        .previewWithdrawUnderlyingFromVault(reserve.vault, BigNumber.from(1000000))
        .then((result) => {
          if (reserve) {
            const dec = valueToBigNumber(10).exponentiatedBy(valueToBigNumber(reserve.decimals));
            setRate(valueToBigNumber(result.assetsPool.toString()).div(dec).toString());
          }
        });

      const calculator = new Calculator(uwuProvider);
      if (reserve) {
        calculator.calculateVaultAPR(reserve.coingeckoSymbol).then((apr) => {
          setAPR(apr.div(100).toString());
        });
      }
    }
  }, []);

  const handleSetAmountSubmit = (amount: string) => {
    const query = queryString.stringify({ rateMode: 'Variable', amount: amount });
    history.push(`${history.location.pathname}/confirmation?${query}`);
  };

  return (
    <VaultCurrencyWrapper currencySymbol={currencySymbol} user={user} goBack={undefined}>
      <div className="FormWrapper">
        <div className="VaultOverview__form">
          <VaultForm
            title={`Create Vault`}
            description={`How much do you want to deposit`}
            currencySymbol={currencySymbol}
            onSubmit={handleSetAmountSubmit}
            amountFieldTitle={intl.formatMessage(messages.amountTitle)}
            maxDecimals={reserve?.decimals}
            action={action}
            reserve={reserve}
            user={user}
            poolReserve={poolReserve}
          />
        </div>
        <div className="Loop">
          <div className="VaultOverview__form">
            <div className="VaultOverview__form__title"></div>
            <div className="VaultOverview__form__info">
              <div className="VaultOverview__form__info__icon">
                <TokenIcon tokenSymbol={currencySymbol} width={68} height={68} />
                {reserve?.strikeReserve.asset === asset && (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      position: 'relative',
                      right: '-43px',
                      top: '-25px',
                    }}
                  >
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0 60C0 26.863 26.863 0 60 0s60 26.863 60 60-26.863 60-60 60S0 93.137 0 60Z"
                        fill="#000"
                      ></path>
                      <path
                        d="M0 60C0 26.863 26.863 0 60 0s60 26.863 60 60-26.863 60-60 60S0 93.137 0 60Z"
                        fill="#000"
                      ></path>
                      <path
                        d="m68.894 15.874 2.596 6.081a50.353 50.353 0 0 0 26.548 26.547l6.081 2.596c1.591.679 2.883 1.652 3.881 2.811-3.029-21.714-20.203-38.89-41.917-41.916 1.157.995 2.133 2.29 2.811 3.88ZM15.876 51.098l6.081-2.596a50.366 50.366 0 0 0 26.55-26.547l2.593-6.081c.681-1.592 1.655-2.886 2.812-3.881-21.715 3.026-38.889 20.202-41.917 41.916.997-1.159 2.29-2.132 3.88-2.81ZM104.119 68.9l-6.081 2.596A50.356 50.356 0 0 0 71.49 98.045l-2.597 6.079a10.54 10.54 0 0 1-2.811 3.883c21.714-3.028 38.888-20.205 41.917-41.92-.998 1.16-2.29 2.134-3.881 2.812ZM51.1 104.124l-2.593-6.08a50.37 50.37 0 0 0-26.55-26.548l-6.081-2.597c-1.592-.678-2.884-1.652-3.881-2.811 3.028 21.714 20.202 38.891 41.917 41.919-1.157-.997-2.13-2.292-2.812-3.883Z"
                        fill="#A6A6A6"
                      ></path>
                      <path
                        d="m38.557 55.376 2.905-1.24a24.06 24.06 0 0 0 12.681-12.68l1.239-2.905c1.737-4.069 7.505-4.069 9.242 0l1.238 2.905a24.061 24.061 0 0 0 12.681 12.68l2.906 1.24c4.068 1.737 4.068 7.503 0 9.24l-2.906 1.24a24.056 24.056 0 0 0-12.68 12.681l-1.24 2.903c-1.736 4.069-7.504 4.069-9.241 0l-1.239-2.903a24.054 24.054 0 0 0-12.68-12.68l-2.906-1.241c-4.069-1.737-4.069-7.503 0-9.24Z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="VaultOverview__form__info__data">
                <div className="VaultOverview__form__info__data-title">
                  Vault {currencySymbol.toUpperCase()}
                </div>
                <div className="VaultOverview__form__info__data-description">
                  This vault manages your position at Stargate Finance by harvesting rewards,
                  selling reward tokens for your position tokens, and compounding them into the
                  vault. Each yos{currencySymbol} (vault share token) will gain {currencySymbol}{' '}
                  value as time passes. You can use yos{currencySymbol} as collateral in our markets
                  to leverage your position.
                </div>
              </div>
            </div>
            <div className="VaultOverview__form__value">
              <div className="VaultOverview__form__value__row">
                <div>APY</div>
                <div>
                  <ValuePercent value={apr ?? 0} />
                </div>
              </div>
              <div className="VaultOverview__form__value__row">
                <div>Total assets</div>
                <div>{totalAssets} $</div>
              </div>
              <div className="VaultOverview__form__value__row">
                <div>yos{currencySymbol} rate = </div>
                <div>{rate} $</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx={true} global={true}>
        {`
          .ValuePercent__value {
            font-weight: 400 !important;
            font-size: 14px !important;
          }
          .VaultOverview {
            &__form {
              &__title {
                font-weight: 600;
                font-size: 18px;
                line-height: 22px;
                color: #ffffff;
              }
              &__info {
                display: flex;
                flex-direction: row;
                margin-top: 30px;
                background: #120d48;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 16px;
                &__icon {
                  width: 68px;
                  margin-right: 8px;
                }

                &__data-title {
                  color: white;
                  font-weight: 600;
                  font-size: 16px;
                  line-height: 19px;
                }

                &__data-description {
                  font-weight: 400;
                  font-size: 16px;
                  line-height: 19px;
                  color: rgba(255, 255, 255, 0.6);
                  margin-top: 7px;
                }
              }
              &__value {
                color: white;
                &__row {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 17px;
                  margin-top: 16px;
                }
              }
            }
          }
          .BorrowOverview {
            &__form {
              background: #120d48;
              border-radius: 8px;
              padding: 12px;
              width: 100%;
            }
          }
          .FormWrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
          }
          .BasicForm {
            margin: 0;
            max-width: none;
          }
          .Loop {
            margin-left: 19px;
          }
          .BasicForm,
          .Loop {
            width: 100%;
          }
          .AmountField__wrapper {
            background: #1c165b;
            border: 1px solid #493fb5;
            border-radius: 8px;
            margin-top: 24px;
          }

          .AmountField__maxButton {
            color: #a49fda;
          }

          .AmountField {
            width: 100%;
          }
          @media (max-width: 540px) {
            .Loop {
              margin-left: 0;
              margin-top: 16px;
            }
            .FormWrapper {
              display: flex;
              flex-direction: column;
            }
            .AmountField__wrapper {
              width: 100%;
            }

            .BasicForm {
              padding: 5px;
            }
          }
        `}
      </style>
    </VaultCurrencyWrapper>
  );
}

export default VaultCurrency;
