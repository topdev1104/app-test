import React, { useEffect, useState } from 'react';
import staticStyles from './style';
import { getAssetInfo, TokenIcon } from '../../../../helpers/config/assets-config';
import { Link } from 'react-router-dom';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import buyArrow from '../../../../images/buy-arrow.svg';
import Wallet from '../../../../images/wallet.svg';
import TotalPlatformFees from '../TotalPlatformFees';
import { useDynamicPoolDataContext } from '../../../../libs/pool-data-provider';
import MarketLocked from '../MarketLocked';

interface LockUwUAndEarnProps {
  data: any;
  projectedFeesPerYearByAssets: any;
  projectedFeesPerYear: any;
  apr: BigNumber;
}

export default function LockUwUAndEarn({
  data,
  projectedFeesPerYearByAssets,
  projectedFeesPerYear,
  apr,
}: LockUwUAndEarnProps) {
  const [columns, setColumns] = useState<any>([]);
  const [columnsMobile, setColumnsMobile] = useState<any>([]);
  const { reserves, locked, readyToVest, marketCap, uwuPrice, totalPlatformFees } =
    useDynamicPoolDataContext();
  // const [aprValues, setAPRValues] = useState<any>()

  const renderColumns = function (data: any, aprValues: any) {
    const countColumn = Math.ceil(data.length / 3);

    const columns = [];
    for (let i = 0; i < countColumn; i++) {
      const items = [];

      for (let l = i * 3; l < i * 3 + 3; l++) {
        if (data[l]) {
          const asset = getAssetInfo(data[l].currencySymbol);
          if (typeof aprValues[asset.symbol.toLowerCase()] !== 'undefined') {
            const IS_SIFU_OLD = asset.symbol === 'SIFU_OLD';
            const symbolLabel = IS_SIFU_OLD ? 'SIFU (old)' : asset.symbol;

            items.push(
              <div className="LockUwUAndEarn__content__column__item" key={`item-${i}-${l}`}>
                <div>
                  <TokenIcon
                    tokenSymbol={asset.symbol}
                    height={35}
                    width={35}
                    className="MarketTableItem__token"
                  />
                </div>
                <div className="LockUwUAndEarn__content__column__item__info">
                  <span className="LockUwUAndEarn__content__column__item__info__symbol">
                    {symbolLabel}
                  </span>
                  <span>{aprValues[asset.symbol.toLowerCase()]}%</span>
                </div>
              </div>
            );
          }
        }
      }
      columns.push(
        <div className="LockUwUAndEarn__content__column" key={`column-${i}`}>
          {items}
        </div>
      );
    }

    return columns;
  };

  const renderColumnsMobile = function (data: any, aprValues: any) {
    const columns = [];
    for (let i = 0; i < 2; i++) {
      const items = [];

      for (let l = i * 7; l < i * 7 + 7; l++) {
        if (data[l]) {
          const asset = getAssetInfo(data[l].currencySymbol);
          const IS_SIFU_OLD = asset.symbol === 'SIFU_OLD';
          const symbolLabel = IS_SIFU_OLD ? 'SIFU (old)' : asset.symbol;

          items.push(
            <div className="LockUwUAndEarn__content__column__item" key={`item-mobile-${i}-${l}`}>
              <div>
                <TokenIcon
                  tokenSymbol={asset.symbol}
                  height={35}
                  width={35}
                  className="MarketTableItem__token"
                />
              </div>
              <div className="LockUwUAndEarn__content__column__item__info">
                <span className="LockUwUAndEarn__content__column__item__info__symbol">
                  {symbolLabel}
                </span>
                <span>
                  {typeof aprValues[asset.symbol.toLowerCase()] !== 'undefined'
                    ? aprValues[asset.symbol.toLowerCase()]
                    : 'Fetching...'}
                  %
                </span>
              </div>
            </div>
          );
        }
      }
      columns.push(
        <div className="LockUwUAndEarn__content__column" key={`column-mobile-${i}`}>
          {items}
        </div>
      );
    }

    return columns;
  };

  useEffect(() => {
    if (data.length > 0 && projectedFeesPerYearByAssets && projectedFeesPerYear) {
      const aprs: any = {};
      const totalAPR = apr;

      for (const props in projectedFeesPerYearByAssets) {
        const percent = valueToBigNumber(projectedFeesPerYearByAssets[props]).div(
          valueToBigNumber(projectedFeesPerYear).div(100)
        );
        const percentValue = totalAPR.div(100).multipliedBy(percent).toFixed(2).toString();
        if (!totalAPR.isNaN() && totalAPR) {
          aprs[props.toLowerCase()] = !totalAPR.isNaN() ? `${percentValue}` : 'Fetch...';
        }
      }

      const index = data.findIndex((item: any) => item.currencySymbol.toUpperCase() === 'SIFUM');
      if (index !== -1) {
        data.splice(index, 1);
      }
      data.push({
        currencySymbol: 'UWU',
      });
      data.push({
        currencySymbol: 'SIFUM',
      });
      const columns = renderColumns(data, aprs);
      const columnsMobile = renderColumnsMobile(data, aprs);

      setColumns(columns);
      setColumnsMobile(columnsMobile);
    }
  }, [data, projectedFeesPerYearByAssets, projectedFeesPerYear, apr]);

  return (
    <>
      <div className="LockUwUAndEarn">
        <div className="LockUwUAndEarn__header">
          <div className="LockUwUAndEarn__header__cardLockApr">
            <img src={Wallet} className="LockUwUAndEarn__header__cardLockApr__icon" alt="wallet" />
            <div className="LockUwUAndEarn__header__cardLockApr__desc">
              <div className="LockUwUAndEarn__header__cardLockApr__title">Lock UwU APR</div>
              <span className="LockUwUAndEarn__header__cardLockApr__apr">
                {!apr.isNaN() ? `${apr.toFixed(2).toString()}%` : 'Fetch...'}
              </span>
            </div>
          </div>
          <div className="LockUwUAndEarn__header__cardTotal">
            <TotalPlatformFees value={totalPlatformFees} />
          </div>
          <div className="LockUwUAndEarn__header__cardLocked" style={{ marginTop: 13 }}>
            <MarketLocked value={locked} uwuPrice={uwuPrice} />
          </div>
        </div>
        <div className="LockUwUAndEarn__body">
          <p>Paid in</p>
          <div className="LockUwUAndEarn__body__button">
            <Link className="LockUwUAndEarn__body__button" to={`manage-uwu`}>
              <span>Lock</span>
            </Link>
            <img src={buyArrow} style={{ marginLeft: 4 }} alt="Arrow" />
          </div>
        </div>
        <div className="LockUwUAndEarn__verticalDiv"></div>
        <div className="LockUwUAndEarn__content">{columns}</div>
      </div>

      <div className="LockUwUAndEarn_mobile">
        <div>
          <TotalPlatformFees value={totalPlatformFees} />
        </div>
        <div className="LockUwUAndEarn_mobile__header">
          Lock <span className="LockUwUAndEarn_mobile__header__selected-text">UwU-ETH LPs</span> and
          earn{' '}
          <span className="LockUwUAndEarn_mobile__header__selected-text">
            {apr.toFixed(2).toString()}%
          </span>{' '}
          APR paid in
          <Link className="LockUwUAndEarn_mobile__header__button" to={`manage-uwu`}>
            <span>Lock</span>
          </Link>
        </div>
        <div className="LockUwUAndEarn_mobile__content">{columnsMobile}</div>
      </div>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
