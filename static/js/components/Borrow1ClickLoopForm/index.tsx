import { FormEvent, useCallback, useState, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { valueToBigNumber } from '@aave/protocol-js';

import { ComputedReserveData } from '../../libs/pool-data-provider';
import { useUserWalletDataContext } from '../../libs/web3-data-provider';
import { useWalletBalanceProviderContext } from '../../libs/wallet-balance-provider/WalletBalanceProvider';
import { useProtocolDataContext } from '../../libs/protocol-data-provider';
import { LeveragerContract } from '../../libs/aave-protocol-js/LeveragerContract';
import useRdntLendingPoolRewards from '../../libs/aave-protocol-js/hooks/use-rdnt-lending-pool-rewards';
import { getProvider } from '../../helpers/config/markets-and-network-config';
import PoolTxConfirmationView from '../../components/PoolTxConfirmationView';
import { ValidationWrapperComponentProps } from '../RouteParamsValidationWrapper';
import AmountField from '../../components/fields/AmountField';
import DefaultButton from '../../components/basic/DefaultButton';
import ConnectButton from '../../components/ConnectButton';
import SelectTokenField from '../../components/fields/SelectTokenField';
import Row from '../../components/basic/Row';
import ValuePercent from '../../components/basic/ValuePercent';
import InputBar from '../../components/basic/InputBar';
import HealthFactor from '../../components/HealthFactor';
import { TokenIcon } from '../../helpers/config/assets-config';
import {
  BN_ONE,
  significantLoopingCount,
  loopingLeverageToLtv,
  estimateLooping,
} from '../../helpers/leverage';
import messages from './messages';
import staticStyles from './style';
import Value from '../basic/Value';
import { useUwuProviderContext } from '../../libs/uwu-provider/UwuProvider';

interface Borrow1ClickLoopFormProps
  extends Pick<
    ValidationWrapperComponentProps,
    'userReserve' | 'poolReserve' | 'user' | 'currencySymbol'
  > {
  className?: string;
  stableReserves?: ComputedReserveData[];
  setReserveId?: (value: string) => void;
  isDisableTokenSelect?: boolean;
}

const INTEREST_RATE_MODE = '2';
const AMOUNT_MIN = '1';
const LEVERAGE_MIN = '1.1';

export default function Borrow1ClickLoopForm({
  user,
  currencySymbol,
  poolReserve,
  className,
  stableReserves,
  setReserveId = () => {},
  isDisableTokenSelect = false,
}: Borrow1ClickLoopFormProps) {
  const intl = useIntl();
  const { currentAccount } = useUserWalletDataContext();
  const { walletData } = useWalletBalanceProviderContext();
  const { chainId, currentMarketData } = useProtocolDataContext();
  const { getRewardApr } = useRdntLendingPoolRewards();
  const { provider: uwuProvider } = useUwuProviderContext();

  let blockingError = '';
  // const maxLeverage = '6';
  const maxLeverage = BN_ONE.div(BN_ONE.minus(valueToBigNumber(poolReserve.baseLTVasCollateral)))
    .decimalPlaces(2, BigNumber.ROUND_FLOOR)
    .toString();

  const rdntRewardsDepositApr = getRewardApr(poolReserve.aTokenAddress);
  const rdntRewardsBorrowApr = getRewardApr(poolReserve.variableDebtTokenAddress);

  const [tab] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [formData, setFormData] = useState({
    amount: AMOUNT_MIN,
    leverage: maxLeverage,
  });
  const [errors, setErrors] = useState({
    amount: '',
    leverage: '',
  });
  const [chainSelectVisible, setChainSelectVisible] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      leverage: maxLeverage,
    }));
  }, [maxLeverage]);

  const { depositAPY, borrowAPY, rewardAPR, netAPY, healthFactor } = estimateLooping({
    amount: valueToBigNumber(formData.amount),
    asset: poolReserve,
    leverage: valueToBigNumber(formData.leverage),
    depositIncentiveAPR: valueToBigNumber(rdntRewardsDepositApr),
    variableBorrowIncentiveAPR: valueToBigNumber(rdntRewardsBorrowApr),
    userSummary: user,
  });

  const walletBalance = useMemo(() => {
    const maxWalletBalance =
      walletData[poolReserve.underlyingAsset] === '0'
        ? valueToBigNumber('0')
        : valueToBigNumber(walletData[poolReserve.underlyingAsset] || '0').dividedBy(
            valueToBigNumber('10').pow(poolReserve.decimals)
          );

    return maxWalletBalance.toString(10);
  }, [walletData, poolReserve]);

  const walletBalances = useMemo(() => {
    const result: any = {};

    if (stableReserves) {
      for (let i = 0; i < stableReserves.length; i++) {
        const _balance = BigNumber(walletData[stableReserves[i].underlyingAsset]);
        const _decimals = BigNumber(stableReserves[i].decimals.toString());

        result[stableReserves[i].underlyingAsset] = _balance
          .div(BigNumber(10).pow(_decimals))
          .toString();
      }
    }

    return result;
  }, [walletData, poolReserve]);

  const inputHandler = useCallback(
    (key: string, maxValue: string, minValue: string) => (value: string) => {
      if (maxValue && parseFloat(value) > parseFloat(maxValue)) {
        value = maxValue;
      }

      if (minValue && parseFloat(value) < parseFloat(minValue)) {
        setErrors((prev) => ({
          ...prev,
          [key]: `This field should be more than ${minValue}`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [key]: '',
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFormData, setErrors]
  );

  const handleBarChange = useCallback(
    (amount: string) => {
      setFormData((prev) => ({
        ...prev,
        leverage: amount,
      }));
    },
    [setFormData]
  );

  const handleMaxButtonClick = useCallback(
    (key: string, maxValue: string) => () => {
      setFormData((prev) => ({
        ...prev,
        [key]: maxValue,
      }));
    },
    [setFormData]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (parseFloat(formData.amount) <= 0) {
        setErrors((prev) => ({
          ...prev,
          amount: 'Please input the correct amount',
        }));
        return;
      }

      if (!errors.leverage) {
        setIsConfirm(true);
      }
    },
    [errors, formData, setIsConfirm, setErrors]
  );

  const handleGetTransactions = useCallback(async () => {
    if (currentMarketData.addresses.LEVERAGER) {
      const leveragerContract = new LeveragerContract(
        uwuProvider,
        currentMarketData.addresses.LEVERAGER
      );

      const userId = user?.id || '';
      const assetAddress = poolReserve.underlyingAsset;
      const debtTokenAddress = poolReserve.variableDebtTokenAddress;
      const amount = formData.amount;
      const borrowRatio = loopingLeverageToLtv(valueToBigNumber(formData.leverage));
      const loopCount = significantLoopingCount(valueToBigNumber(formData.leverage));

      return await leveragerContract.loop(
        userId,
        assetAddress,
        debtTokenAddress,
        amount,
        INTEREST_RATE_MODE,
        borrowRatio.toString(),
        loopCount.toString()
      );
    } else {
      throw new Error('need set LEVERAGER');
    }
  }, [user, poolReserve, formData]);

  const handleMainTxExecuted = () => {};

  return (
    <div className={classNames('Borrow1ClickLoopForm', className)}>
      <h2 className="Borrow1ClickLoopForm__title">1-Click Loop</h2>

      {!tab ? (
        !isConfirm ? (
          <form onSubmit={handleSubmit} className="Borrow1ClickLoopForm__inner">
            {!isDisableTokenSelect && (
              <SelectTokenField
                className="Borrow1ClickLoopForm__select-field"
                visible={chainSelectVisible}
                setVisible={setChainSelectVisible}
                placeholder={intl.formatMessage(messages.selectToken)}
                value={poolReserve}
              >
                {stableReserves?.map((item) => {
                  const IS_SIFU_OLD = item.symbol === 'SIFU_OLD';
                  const symbolLabel = IS_SIFU_OLD ? 'SIFU (old)' : item.symbol;

                  return (
                    <button
                      className="Borrow1ClickLoopForm__select-button"
                      type="button"
                      onClick={() => {
                        setReserveId(item.id);
                        setChainSelectVisible(false);
                      }}
                      disabled={poolReserve.id === item.id}
                      key={`token-item-${item.id}`}
                    >
                      <div className="Borrow1ClickLoopForm__select-button__icons">
                        <TokenIcon tokenSymbol={item.symbol} height={30} width={30} />
                        <span>{symbolLabel}</span>
                      </div>
                      <Value
                        value={
                          walletBalances[item.underlyingAsset] !== '0'
                            ? walletBalances[item.underlyingAsset]
                            : ''
                        }
                      />
                    </button>
                  );
                })}
              </SelectTokenField>
            )}

            <div style={{ marginTop: 24 }}>
              <AmountField
                title={intl.formatMessage(messages.amount)}
                maxAmount={walletBalance}
                symbol={currencySymbol}
                maxDecimals={poolReserve.decimals}
                value={formData.amount}
                onChange={inputHandler('amount', walletBalance, AMOUNT_MIN)}
                onMaxButtonClick={handleMaxButtonClick('amount', walletBalance)}
                error={errors.amount}
                poolReserve={poolReserve}
              />
            </div>

            <InputBar
              label={intl.formatMessage(messages.leverage)}
              value={Number(formData.leverage)}
              minAmount={LEVERAGE_MIN}
              maxAmount={maxLeverage}
              onChange={handleBarChange}
            />

            <div className="Borrow1ClickLoopForm__content-information">
              <div style={{ display: 'none' }}>
                <Row title="Net Apy:">
                  <>
                    <TokenIcon
                      tokenSymbol={currencySymbol}
                      height={20}
                      width={20}
                      className="Borrow1ClickLoopForm__status-label"
                    />
                    <ValuePercent value={depositAPY.minus(borrowAPY)} />
                  </>
                </Row>
              </div>
              <Row title={'Estimated Net APY:'}>
                <ValuePercent value={netAPY} />
              </Row>
              <div
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              ></div>
              <Row
                title={
                  <TokenIcon
                    tokenSymbol={'UwU'}
                    tokenFullName={'UWU APY:'}
                    height={20}
                    width={20}
                    className="Borrow1ClickLoopForm__status-label"
                  />
                }
              >
                <ValuePercent value={rewardAPR} />
              </Row>
              <div
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
              <Row title={'Deposit APY:'}>
                <ValuePercent value={depositAPY} />
              </Row>
              <div
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
              <Row title={'Borrow APY:'}>
                -<ValuePercent value={borrowAPY} />
              </Row>
              <div
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginTop: 8,
                  marginBottom: 8,
                }}
              ></div>
              <HealthFactor
                value={healthFactor || '-1'}
                withoutTitle={false}
                title="Health Factor:"
                withoutModal={true}
                valueColor="#F8BB54"
              />
            </div>

            <div className="Borrow1ClickLoopForm__buttons">
              {!currentAccount ? (
                <ConnectButton />
              ) : (
                <DefaultButton
                  title={intl.formatMessage(messages.submit)}
                  mobileBig={true}
                  size="medium"
                  type="submit"
                  disabled={!!errors.leverage}
                />
              )}
            </div>
          </form>
        ) : (
          <>
            <PoolTxConfirmationView
              mainTxName={intl.formatMessage(messages.title)}
              boxTitle={intl.formatMessage(messages.title)}
              boxDescription={intl.formatMessage(messages.boxDescription)}
              getTransactionsData={handleGetTransactions}
              onMainTxExecuted={handleMainTxExecuted}
              blockingError={blockingError}
            />
            <div className="Borrow1ClickLoopForm__buttons">
              <DefaultButton
                title={intl.formatMessage(messages.goBack)}
                mobileBig={true}
                size="medium"
                onClick={() => setIsConfirm(false)}
              />
            </div>
          </>
        )
      ) : (
        <form onSubmit={handleSubmit} className="Borrow1ClickLoopForm__inner">
          <p>{intl.formatMessage(messages.closeDescription)}</p>

          <div className="Borrow1ClickLoopForm__buttons">
            {!currentAccount ? (
              <ConnectButton />
            ) : (
              <DefaultButton
                title={intl.formatMessage(messages.closeLoopButton)}
                mobileBig={true}
                size="medium"
                type="submit"
                disabled={true}
              />
            )}
          </div>
        </form>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
