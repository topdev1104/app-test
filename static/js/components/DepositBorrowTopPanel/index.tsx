import { ReactElement, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { valueToBigNumber, BigNumber } from '@aave/protocol-js';

import { TokenIcon, useThemeContext } from '../../libs/aave-ui-kit';
import { ComputedReserveData, useDynamicPoolDataContext } from '../../libs/pool-data-provider';
import toggleLocalStorageClick from '../../helpers/toggle-local-storage-click';
import TopPanelWrapper from '../wrappers/TopPanelWrapper';
import Row from '../basic/Row';
import Value from '../basic/Value';
import DefaultButton from '../basic/DefaultButton';
import NoData from '../basic/NoData';
import CircleCompositionBar, {
  CircleCompositionBarItem,
} from '../compositionBars/CircleCompositionBar';
import CircleCollateralCompositionBar from '../compositionBars/CircleCollateralCompositionBar';
import LTVInfoModal from '../LTVInfoModal';
import ApproximateBalanceHelpModal from '../HelpModal/ApproximateBalanceHelpModal';

import messages from './messages';
import staticStyles from './style';
import { getAssetInfo, getAssetColor } from '../../helpers/config/assets-config';
import useVestHandler from '../../modules/dashboard/components/RdntTableItem/useVestHandler';
import useUwuPrices from '../../libs/aave-protocol-js/hooks/use-uwu-prices';
import { useRdntBalanceContext } from '../../libs/wallet-balance-provider/RdntBalanceProvider';
import { TopStats } from '../../modules/manage-uwu/components/TopStats';
import RewardsBackground from './components/rewardsBaclground/RewardsBackground';
import SystemIcon from '../SystemIcon/SystemIcon';
import { ComputedUserReserve } from '@aave/math-utils';

interface IProps {
  isBorrow: boolean;
}

export default function DepositBorrowTopPanel({ isBorrow }: IProps): ReactElement {
  const intl = useIntl();
  const { currentTheme, sm, md } = useThemeContext();
  const { user, reserves } = useDynamicPoolDataContext();
  const { prices } = useUwuPrices();
  const { availableForVesting } = useRdntBalanceContext();

  const [isCollapse, setIsCollapse] = useState(
    localStorage.getItem('borrowDepositTopPanelIsCollapse') === 'true'
  );
  const [isLTVModalVisible, setLTVModalVisible] = useState(false);
  // 0 - deposit composition, 1 - collateral composition
  const [selectedDepositChartType, setDepositChartType] = useState<number>(0);

  const isDepositCompositionChartType: boolean = selectedDepositChartType === 0;

  const maxBorrowAmount = valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0').plus(
    user?.availableBorrowsMarketReferenceCurrency || '0'
  );
  const collateralUsagePercent = maxBorrowAmount.eq(0)
    ? '1'
    : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
        .div(maxBorrowAmount)
        .toFixed();

  const loanToValue =
    user?.totalCollateralMarketReferenceCurrency === '0'
      ? '0'
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
          .dividedBy(user?.totalCollateralMarketReferenceCurrency || '1')
          .toFixed();

  const depositCompositionData: CircleCompositionBarItem[] = [];
  const borrowCompositionData: CircleCompositionBarItem[] = [];

  user?.userReservesData.forEach((userReserve) => {
    const poolReserve = reserves.find((res) => {
      if (userReserve.reserve.underlyingAsset === '0x29127fe04ffa4c32acac0ffe17280abd74eac313') {
        return res.symbol === 'SIFU_OLD';
      }
      return (
        res.symbol === (userReserve.reserve.symbol === 'ETH' ? 'WETH' : userReserve.reserve.symbol)
      );
    });

    if (!poolReserve) {
      throw new Error('data is inconsistent pool reserve is not available');
    }
    if (userReserve.underlyingBalance !== '0' || userReserve.totalBorrows !== '0') {
      if (userReserve.underlyingBalance !== '0') {
        depositCompositionData.push({
          label: `${getAssetInfo(userReserve.reserve.symbol).formattedName}  ${intl.formatNumber(
            valueToBigNumber(userReserve.underlyingBalanceMarketReferenceCurrency)
              .dividedBy(user?.totalLiquidityMarketReferenceCurrency)
              .multipliedBy(100)
              .toNumber(),
            { maximumFractionDigits: 2 }
          )}%`,
          value: Number(userReserve.underlyingBalanceMarketReferenceCurrency),
          color: getAssetColor(userReserve.reserve.symbol),
        });
      }
      if (userReserve.totalBorrows !== '0') {
        borrowCompositionData.push({
          label: `${getAssetInfo(userReserve.reserve.symbol).formattedName}  ${intl.formatNumber(
            valueToBigNumber(userReserve.totalBorrowsMarketReferenceCurrency)
              .dividedBy(maxBorrowAmount)
              .multipliedBy(100)
              .toNumber(),
            { maximumFractionDigits: 2 }
          )}%`,
          value: Number(userReserve.totalBorrowsMarketReferenceCurrency),
          color: getAssetColor(userReserve.reserve.symbol),
        });

        const availableBorrowPower = borrowCompositionData
          .reduce((acc, slice) => acc.minus(slice.value), maxBorrowAmount)
          .toNumber();
        const usedBorrowPower = borrowCompositionData
          .reduce((acc, slice) => acc.plus(slice.value), new BigNumber(0))
          .toNumber();

        borrowCompositionData.push({
          value: availableBorrowPower,
          label: `${intl.formatMessage(messages.borrowingPowerAvailable)}: ${intl.formatNumber(
            new BigNumber(1)
              .minus(valueToBigNumber(usedBorrowPower).dividedBy(maxBorrowAmount))
              .multipliedBy(100)
              .toNumber(),
            {
              maximumFractionDigits: 2,
            }
          )}%`,
          color: currentTheme.white.hex,
        });
      }
    }
  });

  const vestHandler = useVestHandler();

  const vestButtonHandler = useCallback(
    async (event) => {
      await vestHandler(event);
    },
    [vestHandler]
  );

  const borrowList = () => {
    const borrowList = [];
    const userReservesData = [];
    let countItems = 0;

    if (user) {
      for (let i = 0; i < user.userReservesData.length; i++) {
        const _userReserve = user.userReservesData[i];
        const value = valueToBigNumber(_userReserve.totalBorrowsMarketReferenceCurrency)
          .dividedBy(maxBorrowAmount)
          .multipliedBy(100)
          .toNumber();

        if (value > 0) {
          userReservesData.push(_userReserve);
          countItems++;
        }
      }
    }

    const countColumns = Math.ceil(countItems / 3);
    const countInColumn = user ? Math.ceil(countItems / countColumns) : 0;

    if (userReservesData.length > 0) {
      for (let i = 0; i < countColumns; i++) {
        const column = [];

        for (let m = i * countInColumn; m < (i + 1) * countInColumn; m++) {
          if (user && m < countItems) {
            const _userReserve = userReservesData[m];

            const label: string = `${intl.formatNumber(
              valueToBigNumber(_userReserve.totalBorrowsMarketReferenceCurrency)
                .dividedBy(maxBorrowAmount)
                .multipliedBy(100)
                .toNumber(),
              { maximumFractionDigits: 2 }
            )}%`;

            const value: number = valueToBigNumber(_userReserve.totalBorrowsMarketReferenceCurrency)
              .dividedBy(maxBorrowAmount)
              .multipliedBy(100)
              .toNumber();

            if (value > 0) {
              column.push({
                symbol: _userReserve.reserve.symbol,
                label: label,
                disabled: value === 0,
                color: getAssetColor(_userReserve.reserve.symbol),
              });
            }
          }
        }

        borrowList.push(column);
      }
    }

    console.log('borrowList', borrowList)
    return borrowList;
  };

  const depositList = (columns = 3) => {
    const depositList = [];
    const userReservesData = [];
    let countItems = 0;

    if (user) {
      for (let i = 0; i < user.userReservesData.length; i++) {
        const _userReserve = user.userReservesData[i];
        const value = valueToBigNumber(_userReserve.underlyingBalanceMarketReferenceCurrency)
          .dividedBy(user.totalCollateralMarketReferenceCurrency)
          .multipliedBy(100)
          .toNumber()
          .toFixed(2);

        if (value !== '0.00') {
          userReservesData.push(_userReserve);
          countItems++;
        }
      }
    }

    const countColumns = Math.ceil(countItems / columns);
    const countInColumn = user ? Math.ceil(countItems / countColumns) : 0;

    if (!!userReservesData.length) {
      for (let i: number = 0; i < countColumns; i++) {
        const column = [];

        for (let m: number = i * countInColumn; m < (i + 1) * countInColumn; m++) {
          if (user && m < countItems) {
            const _userReserve: ComputedUserReserve = userReservesData[m];
            const { usageAsCollateralEnabledOnUser } = _userReserve;

            const label: string = `${intl.formatNumber(
              valueToBigNumber(_userReserve.underlyingBalanceMarketReferenceCurrency)
                .dividedBy(user.totalCollateralMarketReferenceCurrency)
                .multipliedBy(100)
                .toNumber(),
              { maximumFractionDigits: 2 }
            )}%`;
            let value: number = 0;

            if (isDepositCompositionChartType || usageAsCollateralEnabledOnUser) {
              value = Number(_userReserve.underlyingBalanceMarketReferenceCurrency);
            }

            if (value > 0) {
              column.push({
                symbol: _userReserve.reserve.symbol,
                label: label,
                disabled: value === 0,
                color: getAssetColor(_userReserve.reserve.symbol),
              });
            }
          }
        }

        depositList.push(column);
      }
    }

    return depositList;
  };

  const changeDepositChartType = (chartIndex: number): void => setDepositChartType(chartIndex);

  const renderDepositBlock = (): ReactElement | null => {
    let layout = null;
    if (!isBorrow || !sm) {
      layout = (
        <div className="DepositBorrowTopPanel__block deposit">
          <div className="DepositBorrowTopPanel__header">
            <SystemIcon image={'wallet'} size={'32px'} border margin={'0 20px 0 0 '} />
            <div className="DepositBorrowTopPanel__caption">
              <div className="informationTitle">Deposit Information</div>
              <ApproximateBalanceHelpModal
                className={'informationSubtitle'}
                text={'Approximate balance'}
                color="white"
                lightWeight={true}
              />
            </div>
            <Row color="white" weight="light" isColumn={true}>
              {user && user.totalLiquidityUSD !== '0' ? (
                <Value
                  value={user.totalLiquidityUSD}
                  symbol="USD"
                  tokenIcon={true}
                  maximumValueDecimals={2}
                  color="white"
                />
              ) : (
                <NoData />
              )}
            </Row>
          </div>
          <div className="DepositBorrowTopPanel__content">
            <div className="DepositBorrowTopPanel__content__list">
              <div className="DepositBorrowTopPanel__content__list__title">Deposit composition</div>
              <div className="DepositBorrowTopPanel__content__list-items">
                {depositList().map((column, columnIndex) => {
                  return (
                    <div key={`col-${columnIndex}`}>
                      {column.map((item, itemIndex) => {
                        return (
                          <div
                            className={`DepositItem ${
                              item.disabled ? 'DepositItem__disabled' : ''
                            }`}
                            key={`row-${columnIndex}-${itemIndex}`}
                          >
                            <span
                              className="TableItem__assetColor"
                              style={{
                                backgroundColor: item.color,
                                position: 'relative',
                                marginRight: '5px',
                              }}
                            />
                            <div className="DepositItem__icon">
                              <TokenIcon
                                tokenSymbol={item.symbol}
                                height={26}
                                width={26}
                                className="TableItem__token"
                              />
                            </div>
                            <div className="DepositItem__info">
                              <div className="DepositItem__symbol">{item.symbol}</div>
                              <div className="DepositItem__label">{item.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="DepositBorrowTopPanel__content__chart">
              {!!depositCompositionData.length && (
                <div
                  className={`DepositBorrowTopPanel__topPanel-bars DepositBorrowTopPanel__content__chart-item ${
                    selectedDepositChartType === 0 && 'active'
                  }`}
                >
                  <CircleCompositionBar
                    title={'Deposit Composition'}
                    totalValue={Number(user?.totalLiquidityMarketReferenceCurrency || 0)}
                    data={depositCompositionData}
                  />
                </div>
              )}
              <div
                className={`DepositBorrowTopPanel__content__chart-item ${
                  selectedDepositChartType === 1 && 'active'
                }`}
              >
                {+collateralUsagePercent !== 1 && <CircleCollateralCompositionBar />}
              </div>
              <div className="DepositBorrowTopPanel__content__chart-switcher">
                <div
                  style={{ height: 6 }}
                  className={`${selectedDepositChartType === 0 ? 'active' : ''}`}
                  onClick={(e) => changeDepositChartType(0)}
                />
                <div
                  style={{ height: 6 }}
                  className={`${selectedDepositChartType === 1 ? 'active' : ''}`}
                  onClick={(e) => changeDepositChartType(1)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return layout;
  };

  const renderBorrowBlock = (): ReactElement | null => {
    let layout = null;
    if (isBorrow || !sm) {
      layout = (
        <div className="DepositBorrowTopPanel__block borrow">
          <div className="DepositBorrowTopPanel__header">
            <SystemIcon image={'wallet'} size={'32px'} border margin={'0 20px 0 0 '} />
            <div className="DepositBorrowTopPanel__caption">
              <div className={'informationTitle'}>Borrow information</div>
              <div className={'informationSubtitle'}>Your borrows</div>
            </div>
            <Row color="white" weight="light" isColumn={true}>
              {user && user.totalBorrowsUSD !== '0' ? (
                <Value
                  value={user.totalBorrowsUSD}
                  symbol="USD"
                  tokenIcon={true}
                  minimumValueDecimals={2}
                  maximumValueDecimals={2}
                  color="white"
                />
              ) : (
                <NoData />
              )}
            </Row>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div className="DepositBorrowTopPanel__content">
              <div className="DepositBorrowTopPanel__content__list">
                <div className="DepositBorrowTopPanel__content__list__title">
                  Borrow Composition
                </div>
                <div className="DepositBorrowTopPanel__content__list-items">
                  {borrowList().map((column, columnIndex) => {
                    return (
                      <div key={`col-${columnIndex}`}>
                        {column.map((item, itemIndex) => {
                          return (
                            <div
                              className={`DepositItem ${
                                item.disabled ? 'DepositItem__disabled' : ''
                              }`}
                              key={`row-${columnIndex}-${itemIndex}`}
                            >
                              <span
                                className="TableItem__assetColor"
                                style={{
                                  backgroundColor: item.color,
                                  position: 'relative',
                                  marginRight: '5px',
                                }}
                              />
                              <div className="DepositItem__icon">
                                <TokenIcon
                                  tokenSymbol={item.symbol}
                                  height={26}
                                  width={26}
                                  className="TableItem__token"
                                />
                              </div>
                              <div className="DepositItem__info">
                                <div className="DepositItem__symbol">{item.symbol === 'SIFU_OLD' ? 'Sifu (old)' : item.symbol}</div>
                                <div className="DepositItem__label">{item.label}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="DepositBorrowTopPanel__content__chart">
                <div className={`DepositBorrowTopPanel__content__chart-item active`}>
                  {!!borrowCompositionData.length && (
                    <CircleCompositionBar
                      title={intl.formatMessage(messages.borrowComposition)}
                      totalValue={Number(maxBorrowAmount || 0)}
                      data={borrowCompositionData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return layout;
  };

  return (
    <div className="DepositBorrowTopPanel">
      <TopPanelWrapper
        className={classNames('DepositBorrowTopPanel__topPanel', {
          DepositBorrowTopPanel__topPanelTransparent: user,
        })}
        isCollapse={isCollapse}
        setIsCollapse={() =>
          toggleLocalStorageClick(isCollapse, setIsCollapse, 'borrowDepositTopPanelIsCollapse')
        }
        withoutCollapseButton={true}
      >
        <div className="DepositBorrowTopPanel__information">
          {renderDepositBlock()}
          {renderBorrowBlock()}
          <div className="DepositBorrowTopPanel__block rewards">
            <SystemIcon image={'wallet'} size={'32px'} border />
            <div>
              <div className="DepositBorrowTopPanel__caption">Rewards</div>
            </div>
            <Row color="white" weight="light" isColumn={true} className="Reward">
              {/*<Value*/}
              {/*  value={0}*/}
              {/*  symbol="USD"*/}
              {/*  tokenIcon={true}*/}
              {/*  minimumValueDecimals={2}*/}
              {/*  maximumValueDecimals={2}*/}
              {/*  color="white"*/}
              {/*/>*/}
              <TopStats
                value={Number(availableForVesting)}
                dollarPrefix={false}
                subValue={
                  prices.tokenPrice
                    ? Number(availableForVesting) *
                      valueToBigNumber(prices.tokenPrice)
                        .div(10 ** 8)
                        .toNumber()
                    : undefined
                }
              />
            </Row>
            <DefaultButton
              title="Start Vesting"
              color="primary300"
              transparent={true}
              className="DepositBorrowTopPanel__button DepositBorrowTopPanel__button-vesting"
              size="small"
              onClick={vestButtonHandler}
              disabled={!availableForVesting}
            />
            <RewardsBackground />
          </div>
        </div>
      </TopPanelWrapper>

      {loanToValue !== '0' && (
        <LTVInfoModal visible={isLTVModalVisible} setVisible={setLTVModalVisible} />
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        @import 'src/_mixins/vars';
        @import 'src/_mixins/screen-size';

        .TokenIcon {
          justify-content: start;
        }

        .DepositItem {
          display: flex;
          flex-direction: row;
          align-items: center;

          &__disabled {
            color: rgba(255, 255, 255, 0.6);
          }

          &__info {
            margin-bottom: 8px;
          }

          &__symbol {
            text-transform: uppercase;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
          }

          &__label {
            font-weight: 400;
            font-size: 10px;
            line-height: 12px;
            color: rgba(255, 255, 255, 0.6);
          }
        }

        .DepositBorrowTopPanel {
          &__content {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;

            &__list {
              display: flex;
              flex-direction: column;
              width: 70%;
              @include respond-to(sm) {
                width: 100%;
              }

              &__title {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
                letter-spacing: 0.014em;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 16px;
                margin-bottom: 16px;
              }
            }

            &__list-items {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }

            &__chart {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 30px;
              width: 153px;
              min-height: 153px;
              @include respond-to(sm) {
                margin-top: 0;
                margin-bottom: 10px;
              }
            }

            &__chart > &__chart-item {
              display: none;
              width: 100%;
              height: 100%;
              @include respond-to(sm) {
                margin-top: 0;
              }
            }

            &__chart-switcher {
              display: flex;
              flex-direction: row;
              margin-bottom: 10px;
              @include respond-to(sm) {
                margin-top: 10px;
              }
            }

            &__chart-switcher {
              & > div {
                background: rgba(255, 255, 255, 0.1);
                width: 16px;
                height: 4px;
                border-radius: 4px;
                cursor: pointer;

                &:nth-child(2) {
                  margin-left: 8px;
                }

                &.active {
                  background: rgba(255, 255, 255, 0.3);
                }
              }
            }

            &__chart > div.active {
              display: block;
            }
          }

          &__button {
            background: rgba(100, 92, 192, 0.4) !important;
            border: 1px solid #8079cb;
            border-radius: 16px;
            width: 100%;
            height: 36px;
            font-weight: 600;
            font-size: 14px;
            line-height: 17px;
            margin-top: 20px;
          }

          &__button:hover {
            color: white !important;
          }

          &__topPanel-caption {
            p {
              background: #120d48;
              font-weight: 600;
              font-size: 23px;
            }
          }

          &__topPanel-inner {
            background: #120d48;
          }

          &__topPanel-captionWrapper {
            color: ${currentTheme.white.hex};
          }

          &__information {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: stretch;
            background-color: #08052e;
            gap: 22px;
            @include respond-to(sm) {
              // display: none;
              flex-direction: column-reverse;
            }
          }

          &__block {
            position: relative;
            color: white;
            border-radius: 16px;
            padding: 0 24px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(
              108.66deg,
              rgba(160, 175, 255, 0.06) 0.33%,
              rgba(182, 255, 237, 0.06) 99.67%
            );
            box-shadow: 0 4px 4px rgba(4, 2, 27, 0.2);
            backdrop-filter: blur(15px);
            overflow: hidden;

            &:nth-child(3) {
              max-width: 220px;
              padding: 60px 36px;
              border: 1px solid rgba(85, 82, 253, 0.3);
              @include respond-to(sm) {
                max-width: 100%;
              }
            }
          }

          &__header {
            width: 100%;
            min-height: 90px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            border-bottom: 1px solid rgba(49, 40, 147, 0.4);

            .Row {
              margin-left: auto;
            }

            .informationTitle {
              font-weight: 600;
              font-size: 18px;
              line-height: 22px;
              letter-spacing: 1px;
              color: #fff;
              margin-bottom: 5px;
              @include respond-to(sm) {
                font-size: 12px;
              }
            }

            .InformationSubtitle {
              justify-content: flex-start;
              font-weight: 600;
              font-size: 14px;
              line-height: 20px;
              letter-spacing: 1px;
              color: rgba(255, 255, 255, 0.6);

              & > div {
                margin: 0;
              }

              @include respond-to(sm) {
                font-size: 12px;
              }
            }
          }

          &__caption {
            font-weight: 600;
            font-size: 18px;
            margin-top: 8px;
            @include respond-to(sm) {
              width: 100%;
              font-size: 12px;
            }
          }

          .TextWithModal {
            &__text {
              font-weight: 600;
              font-size: 16px;
              line-height: 19px;
              color: rgba(255, 255, 255, 0.6);
              margin-top: 11px;
              margin-bottom: 8px;
              @include respond-to(sm) {
                font-size: 12px;
              }
            }
          }

          .Row {
            &__title {
              font-weight: 600;
              font-size: 16px;
              line-height: 19px;
              color: rgba(255, 255, 255, 0.6);
              margin-top: 11px;
              margin-bottom: 8px;
            }
          }

          .CircleCompositionBar {
            margin: 0 auto;
          }
        }

        @media only screen and (max-width: 1440px) {
          .DepositBorrowTopPanel__content {
            flex-direction: column;
            align-items: center;
          }

          // .DepositBorrowTopPanel__content__chart {
          //   display: none;
          // }
          // .DepositBorrowTopPanel__content__list {
          //   width: 100%;
          // }
        }

        .Value__value {
          @include respond-to(sm) {
            font-size: 12px;
          }
        }

        .TokenIcon__dollar {
          @include respond-to(sm) {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
