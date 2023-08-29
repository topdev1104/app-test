import { ReactNode, useEffect, useState } from 'react';
import { TokenIcon } from '../../../../libs/aave-ui-kit';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import classNames from 'classnames';

import TextWithTooltip from '../../../../components/TextWithTooltip';
import { CompactNumber } from '../../../../components/basic/CompactNumber';
import staticStyles from './style';

interface TopStatsProps {
  title?: string;
  value: number;
  infoText?: string | ReactNode;
  children?: ReactNode;
  dollarPrefix?: boolean;
  showFullNum?: boolean;
  updateCondition?: boolean;
  subValue?: number;
  isHealthFactor?: boolean;
  isPercent?: boolean;
  hideTokenImg?: boolean;
  tooltipPlace?: 'top' | 'bottom';
}

export function TopStats({
  title,
  value,
  infoText,
  children,
  dollarPrefix,
  showFullNum,
  updateCondition,
  subValue,
  isHealthFactor,
  isPercent,
  hideTokenImg,
  tooltipPlace,
}: TopStatsProps) {
  const [color, setNewColor] = useState('');
  const updateValue = updateCondition ? undefined : value;

  useEffect(() => {
    checkHealthFactor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateValue]);

  const checkHealthFactor = () => {
    let formattedHealthFactor = Number(valueToBigNumber(value).toFixed(2, BigNumber.ROUND_DOWN));
    if (isHealthFactor) {
      if (formattedHealthFactor >= 1.5) {
        setNewColor('green');
      } else if (formattedHealthFactor < 1.5 && formattedHealthFactor > 1.2) {
        setNewColor('orange');
      } else {
        setNewColor('red');
      }
    }
  };

  return (
    <>
      <div className="TopStats">
        {title && (
          <h3 className="TopStats__main-title">
            {title}
            <TextWithTooltip text={''} iconSize={14} id={title || 'title'} place={tooltipPlace}>
              <p className="TopStats__modal-text">{infoText}</p>
            </TextWithTooltip>
          </h3>
        )}
        <span className={classNames('TopStats__title')}>
          {!!dollarPrefix && <span>$</span>}

          {!dollarPrefix && !hideTokenImg && (
            <TokenIcon tokenSymbol={'RDNT'} width={30} height={30} />
          )}

          {value !== 0 && (
            <CompactNumber
              value={value}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
              // showFullNum={showFullNum}
            />
          )}

          {!!isPercent && <span>%</span>}
        </span>
        {subValue !== undefined && (
          <div className="TopStats__subText">
            {!dollarPrefix && (
              <TokenIcon
                tokenSymbol={'RDNT'}
                width={30}
                height={30}
                style={{ visibility: 'hidden' }}
              />
            )}
            {!dollarPrefix && <span>$</span>}
            <CompactNumber
              value={subValue}
              maximumFractionDigits={2}
              minimumFractionDigits={2}
              // showFullNum={showFullNum}
            />{' '}
            USD
          </div>
        )}

        {children}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
