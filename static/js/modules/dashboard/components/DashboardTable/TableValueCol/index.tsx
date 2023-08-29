import React from 'react';

import TableCol from '../TableCol';
import Value from '../../../../../components/basic/Value';

import staticStyles from './style';

interface TableValueColProps {
  value: number;
  subValue?: number;
}

export default function TableValueCol({ value, subValue }: TableValueColProps) {
  return (
    <TableCol>
      <Value
        value={value}
        subValue={subValue}
        subSymbol="USD"
        maximumValueDecimals={2}
        minimumValueDecimals={2}
        minimumSubValueDecimals={2}
        maximumSubValueDecimals={2}
        className="TableValueCol__value"
      />

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </TableCol>
  );
}
