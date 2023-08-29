import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import BasicTable from '../../../../components/BasicTable';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import TableHeaderButton from '../../../../components/BasicTable/TableHeaderButton';

import messages from './messages';
import staticStyles from './style';

interface MarketTableProps {
  sortName: string;
  setSortName: (value: string) => void;
  sortDesc: boolean;
  setSortDesc: (value: boolean) => void;
  children: ReactNode;
}

export default function MarketTable({
  sortName,
  setSortName,
  sortDesc,
  setSortDesc,
  children,
}: MarketTableProps) {
  const intl = useIntl();

  const columns = [
    {
      title: messages.assets,
      sortKey: 'currencySymbol',
    },
    {
      title: messages.marketSize,
      sortKey: 'totalLiquidityInUSD',
    },
    {
      title: messages.totalBorrowed,
      sortKey: 'totalBorrowsInUSD',
    },
    {
      title: messages.depositAPY,
      sortKey: 'depositAPY',
    },
  ];

  const doubleColumns = [
    {
      title: messages.variable,
      sortKey: 'variableBorrowRate',
    },
  ];

  return (
    <BasicTable
      className="MarketTable"
      headerColumns={
        <React.Fragment>
          {columns.map((column, index) => {
            if (column.sortKey === 'totalLiquidityInUSD') {
              return (
                <TableColumn className="MarketTable__header-column" key={index}>
                  <TableHeaderButton
                    sortName={sortName}
                    sortDesc={sortDesc}
                    setSortName={setSortName}
                    setSortDesc={setSortDesc}
                    sortKey={column.sortKey}
                    withSorting={true}
                    title={intl.formatMessage(column.title)}
                    subTitle={`Max Cap`}
                    size="small"
                  />
                </TableColumn>
              );
            }
            return (
              <TableColumn className="MarketTable__header-column" key={index}>
                <TableHeaderButton
                  sortName={sortName}
                  sortDesc={sortDesc}
                  setSortName={setSortName}
                  setSortDesc={setSortDesc}
                  sortKey={column.sortKey}
                  withSorting={true}
                  title={intl.formatMessage(column.title)}
                  size="small"
                />
              </TableColumn>
            );
          })}
          {doubleColumns.map((column, index) => (
            <TableColumn className="MarketTable__header-column" key={index}>
              <TableHeaderButton
                sortName={sortName}
                sortDesc={sortDesc}
                setSortName={setSortName}
                setSortDesc={setSortDesc}
                sortKey={column.sortKey}
                withSorting={true}
                title={intl.formatMessage(messages.borrowAPY)}
                subTitle={intl.formatMessage(column.title)}
                size="small"
              />
            </TableColumn>
          ))}
          {/*{addColumns.map((column, index) => (*/}
          {/*  <TableColumn className="MarketTable__header-column" key={index}>*/}
          {/*    <TableHeaderButton title={intl.formatMessage(messages.loopAPR)} size="small" />*/}
          {/*  </TableColumn>*/}
          {/*))}*/}
        </React.Fragment>
      }
    >
      {children}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </BasicTable>
  );
}
