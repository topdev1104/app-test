import React, { FC, ReactElement } from 'react';
import { useIntl } from 'react-intl';

import staticStyles from './style';
import DefaultButton from '../../../../components/basic/DefaultButton';

interface ITableItem {
  amount: string;
  expiryDate?: Date;
  isUnlockable?: boolean;
}

interface AccordionFooterLockAndVestingProps {
  unlockableValue?: string;
  table?: ITableItem[];
  unlockHandler: () => void;
}

const AccordionFooterLockAndVesting: FC<AccordionFooterLockAndVestingProps> = ({
  table = [],
  unlockableValue,
  unlockHandler,
}) => {
  const intl = useIntl();

  const rows: ITableItem[] = [...table];

  !!Number(unlockableValue) && rows.push({ amount: unlockableValue as string, isUnlockable: true });

  return (
    <div>
      <div className="Accordion">
        {!!table.length && (
          <div className="Accordion__header">
            <div className="Accordion__header-column">Amount</div>
            <div className="Accordion__header-column">Expiry</div>
          </div>
        )}

        <div className="Accordion__body">
          {rows.map((record: ITableItem, index): ReactElement => {
            const { expiryDate, isUnlockable } = record;
            return (
              <div className="Accordion__row" key={index}>
                <div className="Accordion__column">
                  <strong>
                    {intl.formatNumber(parseFloat(record.amount), {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </div>
                <div className="Accordion__column">{expiryDate?.toLocaleString()}</div>
                <div
                  className="Accordion__column"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  {isUnlockable && <DefaultButton title="Unlock" onClick={unlockHandler} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{staticStyles}</style>
    </div>
  );
};

export default AccordionFooterLockAndVesting;
