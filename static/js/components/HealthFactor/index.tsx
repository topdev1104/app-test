import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { valueToBigNumber, BigNumber } from '@aave/protocol-js';

import ValuePercent from '../basic/ValuePercent';
import HealthFactorHelpModal from '../HelpModal/HealthFactorHelpModal';
import NoData from '../basic/NoData';

import messages from './messages';
import staticStyles from './style';

interface HealthFactorProps {
  value: string;
  title?: string;
  helpIconSize?: number;
  updateCondition?: boolean;
  className?: string;
  withoutModal?: boolean;
  withoutTitle?: boolean;
  withTextShadow?: boolean;
  titleColor?: 'dark' | 'white';
  titleLightWeight?: boolean;
  isColumn?: boolean;
  onWhiteBackground?: boolean;
  withHALLink?: boolean;
  valueColor?: string;
}

export default function HealthFactor({
  value,
  title,
  helpIconSize,
  updateCondition,
  className,
  withoutModal,
  withoutTitle,
  withTextShadow,
  titleColor,
  titleLightWeight,
  isColumn,
  onWhiteBackground,
  withHALLink,
  valueColor,
}: HealthFactorProps) {
  const intl = useIntl();

  const [newValue, setNewValue] = useState(value);
  const updateValue = updateCondition ? undefined : value;
  useEffect(() => {
    setNewValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateValue]);

  const formattedHealthFactor = Number(valueToBigNumber(newValue).toFixed(2, BigNumber.ROUND_DOWN));

  return (
    <div
      className={classNames('HealthFactor', className, {
        HealthFactorWithTextShadow: withTextShadow || formattedHealthFactor <= 1.05,
        HealthFactor__column: isColumn,
        HealthFactor__white: titleColor === 'white',
      })}
    >
      {!withoutTitle && (
        <HealthFactorHelpModal
          className={classNames('HealthFactor__modal', { HealthFactor__noIcon: withoutModal })}
          text={title || intl.formatMessage(messages.caption)}
          iconSize={helpIconSize}
          color={titleColor}
          lightWeight={titleLightWeight}
          onWhiteBackground={onWhiteBackground}
          withSecondaryIcon={withHALLink}
        />
      )}

      {!(formattedHealthFactor < 0) ? (
        <ValuePercent
          className="HealthFactor__percent"
          value={formattedHealthFactor}
          updateCondition={updateCondition}
          valueColor={valueColor}
          percentSymbol={false}
          minimumDecimals={2}
          maximumDecimals={2}
        />
      ) : (
        <NoData
          color={titleColor}
          className="HealthFactor__no-value"
          onWhiteBackground={onWhiteBackground}
        />
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
