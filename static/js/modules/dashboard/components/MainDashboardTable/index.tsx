import { useIntl } from 'react-intl';
import classNames from 'classnames';
import NoDataPanel from '../../../../components/NoDataPanel';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import BorrowDashboardTable from '../../../borrow/components/BorrowDashboardTable';
import { BorrowTableItem } from '../../../borrow/components/BorrowDashboardTable/types';
import DepositDashboardTable from '../../../deposit/components/DepositDashboardTable';
import { DepositTableItem } from '../../../deposit/components/DepositDashboardTable/types';
import { CSSProperties, ReactElement } from 'react';
import messages from './messages';
import staticStyles from './style';
import { useThemeContext } from '../../../../libs/aave-ui-kit';

interface MainDashboardTableProps {
  depositedPositions: DepositTableItem[];
  borrowedPositions: BorrowTableItem[];
  isBorrow: boolean;
  DepositTableItem?: (props: DepositTableItem) => ReactElement;
  depositTableHeaders?: string[];
  borrowTableHeaders?: string[];
  depositTableTemplateColumns?: string;
  borrowTableTemplateColumns?: string;
}

export default function MainDashboardTable({
  depositedPositions,
  borrowedPositions,
  isBorrow,
  DepositTableItem,
  depositTableHeaders,
  depositTableTemplateColumns,
  borrowTableTemplateColumns,
}: MainDashboardTableProps) {
  const intl = useIntl();
  const { xl } = useThemeContext();
  return (
    <div
      className={classNames('MainDashboardTable', {
        MainDashboardTable__onlyOne: isBorrow,
        MainDashboardTable__noBorrows: !borrowedPositions.length,
      })}
    >
      <div className="MainDashboardTable__left-inner">
        {!!depositedPositions.length && (
          <DepositDashboardTable
            headers={depositTableHeaders}
            TableItem={DepositTableItem}
            listData={depositedPositions}
          />
        )}
      </div>

      <div className="MainDashboardTable__right-inner">
        {!!borrowedPositions.length ? (
          <BorrowDashboardTable listData={borrowedPositions} />
        ) : (
          <ContentWrapper withFullHeight={true}>
            <NoDataPanel
              title={intl.formatMessage(messages.nothingBorrowed)}
              description={intl.formatMessage(messages.nothingBorrowedDescription)}
              buttonTitle={intl.formatMessage(messages.borrowNow)}
              linkTo="/borrow"
            />
          </ContentWrapper>
        )}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>
        {`
          .MainDashboardTable {
            ${xl && !!borrowedPositions.length ? '' : `gap: 16px;`}
            &__left-inner {
              ${xl && !!borrowedPositions.length ? '' : `min-width: 605px;`}
              .TableHeader__inner {
                display: grid;
                grid-template-columns: ${depositTableTemplateColumns ??
                'minmax(100px, 150px) minmax(80px, 1fr) minmax(112px, 1fr) 99px minmax(195px, 1fr)'};
              }

              .DashboardTable {
                .TableItem {
                  display: grid;
                  grid-template-columns: ${depositTableTemplateColumns ??
                  'minmax(100px, 150px) minmax(80px, 1fr) minmax(112px, 1fr) 99px minmax(195px, 1fr)'};
                }
              }
            }

            &__right-inner {
              ${xl && !!borrowedPositions.length ? '' : `min-width: 320;`}
              .TableHeader {
                &__inner {
                  display: grid;
                  grid-template-columns: ${borrowTableTemplateColumns ??
                  'minmax(100px, 150px) minmax(80px, 1fr) minmax(112px, 1fr) minmax(195px, 1fr)'};
                }
              }

              .DashboardTable {
                .TableItem {
                  display: grid;
                  grid-template-columns: ${borrowTableTemplateColumns ??
                  'minmax(100px, 150px) minmax(80px, 1fr) minmax(112px, 1fr) minmax(195px, 1fr)'};
                }
              }
            }
          }
        `}
      </style>
    </div>
  );
}
