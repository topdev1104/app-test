import React, { ReactNode } from 'react';

import staticStyles from './style';

interface TableHeaderBorrowWrapperProps {
  children: ReactNode;
}

export default function TableHeaderBorrowWrapper({ children }: TableHeaderBorrowWrapperProps) {
  return (
    <div className="TableHeaderBorrowWrapper">
      {children}
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
