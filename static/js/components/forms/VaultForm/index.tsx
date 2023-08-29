import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { valueToBigNumber, EthereumTransactionTypeExtended } from '@aave/protocol-js';

import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import AmountField from '../../fields/AmountField';
import DefaultButton from '../../basic/DefaultButton';
import ConnectButton from '../../ConnectButton';

import messages from './messages';
import staticStyles from './style';
import TableButtonsWrapper from '../../../modules/dashboard/components/DashboardTable/TableButtonsWrapper';
import {
  YoSifuStargateVaultContract,
  YoSifuStargateVaultWrapperContract,
} from '../../../libs/aave-protocol-js/YoSifuStargateVault';
import { getProvider } from '../../../helpers/config/markets-and-network-config';
import { BigNumber, providers } from 'ethers';
import { UserSummary, useStaticPoolDataContext } from '../../../libs/pool-data-provider';
import { EthTransactionData, sendEthTransaction } from '../../../helpers/send-ethereum-tx';
import { useWeb3React } from '@web3-react/core';
import { mainet } from '../../../ui-config/markets/tokensConfig';
import { VaultReserve } from '../../../modules/vault';
import { GeistTokenContract } from '../../../libs/aave-protocol-js/GeistTokenContract';
import { DEFAULT_APPROVE_AMOUNT } from '@aave/contract-helpers/dist/esm/commons/utils';
import { ERC20Contract } from '../../../libs/aave-protocol-js/ERC20Contract';
import { ValidationWrapperComponentProps } from '../../RouteParamsValidationWrapper';
import { useUwuProviderContext } from '../../../libs/uwu-provider/UwuProvider';

interface VaultFormProps extends Pick<ValidationWrapperComponentProps, 'poolReserve'> {
  title?: string;
  description?: string | ReactNode;
  amountFieldTitle?: string;
  currencySymbol: string;
  onSubmit: (amount: string, max?: boolean) => void;
  withRiskBar?: boolean;
  submitButtonTitle?: string;
  absoluteMaximum?: boolean;
  className?: string;
  maxDecimals?: number;
  warning?: ReactNode;
  children?: ReactNode;
  getTransactionData?: (
    user: string
  ) => () => Promise<EthereumTransactionTypeExtended[]> | EthereumTransactionTypeExtended[];
  action?: string;
  reserve?: VaultReserve;
  user?: UserSummary;
}

export default function VaultForm({
  poolReserve,
  currencySymbol,
  onSubmit,
  absoluteMaximum,
  className,
  maxDecimals,
  warning,
  children,
  action,
  reserve,
  user,
}: VaultFormProps) {
  const intl = useIntl();
  const { chainId } = useProtocolDataContext();
  const { userId } = useStaticPoolDataContext();
  const { currentAccount } = useUserWalletDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();

  const [isMaxSelected, setIsMaxSelected] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [tabs, setTabs] = useState<string>(action ?? 'deposit');
  const [currency, setCurrency] = useState<string>(currencySymbol);
  const [approved, setApproved] = useState<boolean>(false);
  const [approvedShare, setApprovedShare] = useState<boolean>(false);
  const [asset, setAsset] = useState<string | undefined>(reserve?.asset);
  const [decimals, setDecimals] = useState<number | undefined>(reserve?.decimals);
  const [previewDeposit, setPreviewDeposit] =
    useState<{ sharesVault: BigNumber; sharesPool: BigNumber }>();
  const [previewWithdraw, setPreviewWithdraw] =
    useState<{ assetsVault: BigNumber; assetsPool: BigNumber }>();
  const [assetsAmount, setAssetsAmount] = useState<BigNumber>();
  const [amountToReceive, setAmountToReceive] = useState<string>('0');
  const [txData, setTxData] = useState({} as EthTransactionData);
  const [vaultBalance, setVaultBalance] = useState<string>('0');
  const [balance, setBalance] = useState<string>('0');
  const [fee, setFee] = useState<string>('0');
  const { provider: uwuProvider } = useUwuProviderContext();

  useEffect(() => {
    if (reserve) {
      const yoSifuStargateVaultContract = new YoSifuStargateVaultContract(
        uwuProvider,
        reserve.vault
      );

      yoSifuStargateVaultContract.fee().then((res) => {
        const val = valueToBigNumber(res.toString());
        const dec = valueToBigNumber(10).exponentiatedBy(valueToBigNumber(18));

        setFee(val.div(dec).multipliedBy(100).toString());
      });
    }
  }, []);

  useEffect(() => {
    setError('');
    setAmount('');
    setVaultBalance('0');
    setBalance('0');

    if (reserve && asset) {
      const contract = new ERC20Contract(uwuProvider, asset);
      const contractVault = new ERC20Contract(uwuProvider, reserve.vault);

      if (user) {
        contract.allowance(user?.id, mainet.YoSifuStargateVaultWrapper).then((res) => {
          setApproved(!res.isZero());
        });

        contractVault.allowance(user?.id, mainet.YoSifuStargateVaultWrapper).then((res) => {
          setApprovedShare(!res.isZero());
        });

        getVaultBalance();
        getBalance();
      }
    }
  }, [asset, tabs]);

  useEffect(() => {
    if (tabs === 'deposit') {
      getPreviewDeposit();
    } else if (tabs === 'withdraw') {
      getPreviewWithdraw();
    }
  }, [amount]);

  useEffect(() => {
    getPreviewDeposit();
    getPreviewWithdraw();
  }, [currency]);

  const getPreviewDeposit = () => {
    const yoSifuStargateVaultWrapperContract = new YoSifuStargateVaultWrapperContract(
      uwuProvider,
      mainet.YoSifuStargateVaultWrapper
    );

    if (reserve && userId && decimals && amount !== '') {
      const dec = valueToBigNumber(10).exponentiatedBy(valueToBigNumber(decimals));
      const calculateAmount = valueToBigNumber(amount).multipliedBy(dec);
      const _assetAmount = BigNumber.from(calculateAmount.toString());

      setAssetsAmount(_assetAmount);

      yoSifuStargateVaultWrapperContract
        .previewDepositUnderlyingToVault(reserve.vault, _assetAmount)
        .then((result) => {
          setPreviewDeposit(result);
        });

      yoSifuStargateVaultWrapperContract
        .previewDeposit(reserve.vault, _assetAmount)
        .then((result) => {
          if (result) {
            setAmountToReceive(valueToBigNumber(result.toString()).div(dec).toString());
          }
        });
    }
  };

  const getPreviewWithdraw = () => {
    const yoSifuStargateVaultWrapperContract = new YoSifuStargateVaultWrapperContract(
      uwuProvider,
      mainet.YoSifuStargateVaultWrapper
    );

    if (reserve && userId && currency === reserve.symbol && decimals) {
      if (amount !== '' && reserve) {
        const calculateAmount = valueToBigNumber(amount).multipliedBy(
          valueToBigNumber(10).exponentiatedBy(valueToBigNumber(decimals))
        );
        const _assetAmount = BigNumber.from(calculateAmount.toString());

        setAssetsAmount(_assetAmount);

        yoSifuStargateVaultWrapperContract
          .previewWithdrawUnderlyingFromVault(reserve.vault, _assetAmount)
          .then((result) => {
            setAmountToReceive(
              valueToBigNumber(result.assetsPool.toString())
                .div(valueToBigNumber(10).exponentiatedBy(valueToBigNumber(decimals)))
                .toString()
            );

            setPreviewWithdraw(result);
          });
      }
    } else if (reserve && userId && decimals) {
      if (amount !== '') {
        const calculateAmount = valueToBigNumber(amount).multipliedBy(
          valueToBigNumber(10).exponentiatedBy(valueToBigNumber(decimals))
        );
        const _assetAmount = BigNumber.from(calculateAmount.toString());

        setAssetsAmount(_assetAmount);

        yoSifuStargateVaultWrapperContract
          .previewWithdraw(reserve.vault, _assetAmount)
          .then((result) => {
            setAmountToReceive(
              valueToBigNumber(result.toString())
                .div(valueToBigNumber(10).exponentiatedBy(valueToBigNumber(decimals)))
                .toString()
            );

            setPreviewWithdraw({
              assetsPool: result.assets,
              assetsVault: BigNumber.from(0),
            });
          });
      }
    }
  };

  const amountChange = (amount: string, isWithdraw: boolean) => {
    const newAmountValue = valueToBigNumber(amount);
    const _balance = isWithdraw ? vaultBalance : balance;
    setError('');
    if (newAmountValue.gt(_balance)) {
      setAmount(_balance);
      return setIsMaxSelected(true);
    } else if (newAmountValue.isNegative()) {
      setAmount('');
    } else {
      setAmount(amount);
    }

    setIsMaxSelected(false);
  };

  const handleAmountChange = (newAmount: string) => {
    amountChange(newAmount, false);
  };

  const handleAmountWithdrawChange = (newAmount: string) => {
    amountChange(newAmount, true);
  };

  const handleMaxButtonClick = (isWithdraw: boolean) => {
    setAmount(isWithdraw ? vaultBalance : balance);
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!valueToBigNumber(amount).isNaN() && +amount !== 0) {
      return onSubmit(amount, absoluteMaximum && isMaxSelected);
    }

    setError(intl.formatMessage(messages.error));
  };

  const handleApprove = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userId) {
      if (asset) {
        const contract = new ERC20Contract(uwuProvider, asset);

        const tx = await contract.approve(
          userId,
          mainet.YoSifuStargateVaultWrapper,
          DEFAULT_APPROVE_AMOUNT
        );

        await sendEthTransaction(tx, provider, setTxData, null, {
          onConfirmation: () => {
            console.log('approved');
            setApproved(true);
          },
        });
      }
    }
  };

  const handleWithdrawApprove = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userId) {
      if (reserve) {
        const contract = new ERC20Contract(uwuProvider, reserve.vault);

        const tx = await contract.approve(
          userId,
          mainet.YoSifuStargateVaultWrapper,
          DEFAULT_APPROVE_AMOUNT
        );

        await sendEthTransaction(tx, provider, setTxData, null, {
          onConfirmation: () => {
            console.log('approved');
            setApprovedShare(true);
          },
        });
      }
    }
  };

  const handleWithdraw = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isStargateToken = !(reserve && currency === reserve.symbol);
    const yoSifuStargateVaultWrapperContract = new YoSifuStargateVaultWrapperContract(
      uwuProvider,
      mainet.YoSifuStargateVaultWrapper
    );

    if (userId && previewWithdraw && assetsAmount && reserve) {
      let actionTx = [];
      if (!isStargateToken) {
        actionTx = await yoSifuStargateVaultWrapperContract.withdrawUnderlyingFromVault(
          userId,
          reserve?.vault,
          previewWithdraw.assetsPool,
          assetsAmount
        );
      } else {
        actionTx = await yoSifuStargateVaultWrapperContract.withdrawFromVault(
          userId,
          reserve?.vault,
          previewWithdraw.assetsPool,
          assetsAmount
        );
      }
      const approveTxData = {
        txType: actionTx[0].txType,
        unsignedData: actionTx[0].tx,
        gas: actionTx[0].gas,
      };

      return await sendEthTransaction(approveTxData.unsignedData, provider, setTxData, null, {
        onConfirmation: () => {
          console.log('confirmation');
        },
      });
    }
  };

  const handleDeposit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const yoSifuStargateVaultWrapperContract = new YoSifuStargateVaultWrapperContract(
      uwuProvider,
      mainet.YoSifuStargateVaultWrapper
    );

    if (userId && previewDeposit && assetsAmount && reserve) {
      let actionTx = [];

      if (reserve.asset === asset) {
        actionTx = await yoSifuStargateVaultWrapperContract.depositUnderlyingToVault(
          userId,
          reserve.vault,
          previewDeposit.sharesVault,
          assetsAmount,
          reserve.symbol === 'ETH' ? assetsAmount.toString() : undefined
        );

        const approveTxData = {
          txType: actionTx[0].txType,
          unsignedData: actionTx[0].tx,
          gas: actionTx[0].gas,
        };

        return await sendEthTransaction(approveTxData.unsignedData, provider, setTxData, null, {
          onConfirmation: () => {
            getVaultBalance();
          },
        });
      } else if (reserve.strikeReserve.asset === asset) {
        actionTx = await yoSifuStargateVaultWrapperContract.depositToVault(
          userId,
          reserve.vault,
          previewDeposit.sharesVault,
          assetsAmount
        );

        const approveTxData = {
          txType: actionTx[0].txType,
          unsignedData: actionTx[0].tx,
          gas: actionTx[0].gas,
        };

        return await sendEthTransaction(approveTxData.unsignedData, provider, setTxData, null, {
          onConfirmation: () => {
            getVaultBalance();
          },
        });
      }
    }
  };

  const getBalance = () => {
    if (reserve && user && decimals) {
      const dec = valueToBigNumber(10).exponentiatedBy(reserve.decimals);

      if (reserve.symbol === 'ETH' && reserve.asset === asset) {
        provider?.getBalance(user.id).then((r) => {
          const balance = valueToBigNumber(r.toString());
          setBalance(balance.div(dec).toString());
        });
      } else if (asset) {
        const contract = new GeistTokenContract(uwuProvider, asset);
        contract.balanceOf(user.id).then((balanceOf) => {
          const currencyBalance = valueToBigNumber(balanceOf.toString()).div(dec).toString();
          setBalance(currencyBalance);
        });
      }
    }
  };

  const getVaultBalance = () => {
    if (decimals && reserve && user) {
      const dec = valueToBigNumber(10).exponentiatedBy(valueToBigNumber(reserve.decimals));
      const contract = new YoSifuStargateVaultContract(uwuProvider, reserve?.vault);
      contract.balanceOf(user.id).then((balanceOf) => {
        setVaultBalance(valueToBigNumber(balanceOf.toString()).div(dec).toString());
      });
    }
  };

  const handleSwitchCurrency = (_currency: string | undefined) => {
    setVaultBalance('0');
    setBalance('0');

    if (_currency) {
      setCurrency(_currency);
    }

    if (reserve && _currency === reserve.symbol) {
      setAsset(reserve.asset);
      setDecimals(reserve.decimals);
    } else if (reserve) {
      setAsset(reserve.strikeReserve.asset);
      setDecimals(reserve.strikeReserve.decimals);
    }
  };

  const handleClickTab = (tabName: string) => {
    setTabs(tabName);
  };

  return (
    <form onSubmit={handleSubmit} className={classNames('VaultForm', className)}>
      <h2>{`Stargate ${currencySymbol} Vault`}</h2>
      <div className="Caption__description">Manage your deposits and withdrawals below</div>

      <TableButtonsWrapper>
        <div className="TabsVault__buttons">
          <div
            className={tabs === 'deposit' ? 'TabsVault__button-active' : 'TabsVault__button'}
            onClick={() => handleClickTab('deposit')}
          >
            Deposit
          </div>
          <div
            className={tabs === 'withdraw' ? 'TabsVault__button-active' : 'TabsVault__button'}
            onClick={() => handleClickTab('withdraw')}
          >
            Withdraw
          </div>
        </div>
      </TableButtonsWrapper>
      <div className="FormName">Form Wallet</div>
      {tabs === 'deposit' && (
        <>
          <div className="VaultForm__inner">
            {children}

            <AmountField
              title="Available"
              maxAmount={balance}
              symbol={currency}
              maxDecimals={maxDecimals}
              value={amount}
              onChange={handleAmountChange}
              onMaxButtonClick={() => handleMaxButtonClick(false)}
              error={error}
              className="VaultForm__field"
              poolReserve={poolReserve}
            />

            {/*{[ChainId.mainnet].includes(chainId) && getTransactionData && (*/}
            {/*  <TxEstimation getTransactionsData={getTransactionData} amount={amount} />*/}
            {/*)}*/}

            {!!warning && <div className="VaultForm__warning">{warning}</div>}
          </div>
          <div className="CurrencySwitcher__buttons">
            <div
              className={
                currency === reserve?.symbol
                  ? `CurrencySwitcher__buttons__button-active`
                  : `CurrencySwitcher__buttons__button`
              }
              onClick={() => handleSwitchCurrency(reserve?.symbol)}
            >
              {reserve?.symbol}
            </div>
            <div
              className={
                currency === reserve?.strikeReserve.symbol
                  ? `CurrencySwitcher__buttons__button-active`
                  : `CurrencySwitcher__buttons__button`
              }
              onClick={() => handleSwitchCurrency(reserve?.strikeReserve.symbol)}
            >
              {reserve?.strikeReserve.symbol}
            </div>
          </div>
          <div className="VaultOverview__form__vault">
            <div className="VaultOverview__form__vault__wrapper">
              <div className="VaultOverview__form__vault__title">Vault</div>
              <div className="VaultOverview__form__vault__values">
                <div className="VaultOverview__form__vault__values__row">
                  <div>Your current balance</div>
                  <div>
                    {vaultBalance} yoS{currencySymbol.toUpperCase()}
                  </div>
                </div>
                <div className="VaultOverview__form__vault__values__row">
                  <div style={{ width: '100%' }}>
                    <div className="VaultOverview__form__vault__values__sub-row-first">
                      <div>Amount to receive</div>
                      <div>
                        {amountToReceive} yoS{currencySymbol.toUpperCase()}
                      </div>
                    </div>
                    <div className="VaultOverview__form__vault__values__sub-row VaultOverview__form__vault__apy">
                      <div>
                        {/*<TokenIcon tokenSymbol={currencySymbol} width={16} height={16} />*/}
                        APY
                      </div>
                      <div>0 %</div>
                    </div>
                  </div>
                </div>
                <div className="VaultOverview__form__vault__values__row">
                  <div>Performance fee</div>
                  <div>{fee} %</div>
                </div>
              </div>
            </div>
            {txData.error && (
              <div style={{ color: 'red', marginTop: '20px', width: '100%' }}>
                {txData.error.length > 100 ? txData.error.substr(0, 100) + '...' : txData.error}
              </div>
            )}

            {txData.loading && (
              <div style={{ color: 'green', marginTop: '20px', fontWeight: 'bold' }}>
                Await transaction...
              </div>
            )}
          </div>
        </>
      )}

      {tabs === 'withdraw' && (
        <>
          <div className="VaultForm__inner">
            {children}

            <AmountField
              title="Available"
              maxAmount={vaultBalance}
              symbol={`yos${currencySymbol}`}
              maxDecimals={maxDecimals}
              value={amount}
              onChange={handleAmountWithdrawChange}
              onMaxButtonClick={() => handleMaxButtonClick(true)}
              error={error}
              className="VaultForm__field"
              poolReserve={poolReserve}
            />

            {/*{[ChainId.mainnet].includes(chainId) && getTransactionData && (*/}
            {/*  <TxEstimation getTransactionsData={getTransactionData} amount={amount} />*/}
            {/*)}*/}

            {!!warning && <div className="VaultForm__warning">{warning}</div>}
          </div>
          <div className="VaultOverview__form__vault">
            <div className="VaultOverview__form__vault__wrapper">
              <div className="VaultOverview__form__vault__title">To Wallet</div>
              <div className="VaultOverview__form__vault__values">
                <div className="VaultOverview__form__vault__values__row">
                  <div style={{ width: '100%' }}>
                    <div className="VaultOverview__form__vault__values__sub-row-first">
                      <div>Amount</div>
                      <div>
                        {amountToReceive} {currency.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {txData.error && (
              <div style={{ color: 'red', marginTop: '20px' }}>
                {txData.error.length > 100 ? txData.error.substr(0, 100) + '...' : txData.error}
              </div>
            )}

            {txData.loading && (
              <div style={{ color: 'green', marginTop: '20px', fontWeight: 'bold' }}>
                Await transaction...
              </div>
            )}
          </div>
        </>
      )}

      <div className="VaultForm__buttons">
        {!currentAccount ? (
          <ConnectButton />
        ) : (
          <>
            {tabs === 'deposit' && (
              <>
                {(reserve?.symbol !== 'ETH' ||
                  (reserve?.symbol === 'ETH' && reserve?.asset !== asset)) && (
                  <DefaultButton
                    title={`Approve`}
                    mobileBig={true}
                    type="submit"
                    onClick={handleApprove}
                    disabled={approved}
                  />
                )}
                <DefaultButton
                  title={`Deposit`}
                  mobileBig={true}
                  type="submit"
                  onClick={handleDeposit}
                  disabled={(!approved && reserve?.symbol !== 'ETH') || amount === ''}
                  className={reserve?.symbol === 'ETH' ? `VaultForm__buttons__button-deposit` : ''}
                />
              </>
            )}

            {tabs === 'withdraw' && (
              <>
                {reserve?.symbol !== 'ETH' && (
                  <DefaultButton
                    title={`Approve`}
                    mobileBig={true}
                    type="submit"
                    onClick={handleWithdrawApprove}
                    disabled={approvedShare}
                  />
                )}

                <DefaultButton
                  title={`Withdraw`}
                  mobileBig={true}
                  type="submit"
                  onClick={handleWithdraw}
                  disabled={
                    (!approvedShare && reserve?.symbol !== 'ETH') || amount === '' || txData.loading
                  }
                  className={reserve?.symbol === 'ETH' ? `VaultForm__buttons__button-deposit` : ''}
                />
              </>
            )}
          </>
        )}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </form>
  );
}
