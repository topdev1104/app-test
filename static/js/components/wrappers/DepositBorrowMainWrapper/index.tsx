import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../libs/aave-ui-kit';

import ContentWrapperWithTopLine from '../ContentWrapperWithTopLine';
import Row from '../../basic/Row';
import Value from '../../basic/Value';

import staticStyles from './style';

interface DepositBorrowMainWrapperProps {
  children: ReactNode;
  items: ReactNode;
  contentTitle: string;
  itemsTitle: string;
  isShowRightPanel?: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  showOnlyStableCoins: boolean;
  setShowOnlyStableCoins: (value: boolean) => void;
  withSwitchMarket?: boolean;
  totalValue: string | number;
}

export default function DepositBorrowMainWrapper({
  children,
  items,
  contentTitle,
  itemsTitle,
  isShowRightPanel,
  searchValue,
  setSearchValue,
  showOnlyStableCoins,
  setShowOnlyStableCoins,
  withSwitchMarket,
  totalValue,
}: DepositBorrowMainWrapperProps) {
  const intl = useIntl();
  const { currentTheme, sm } = useThemeContext();

  return (
    <div className="DepositBorrowMainWrapper">
      <div className="DepositBorrowMainWrapper__left-inner">
        {!sm && (
          <ContentWrapperWithTopLine title={contentTitle} className="">
            <div className="DepositBorrowMainWrapper__content">{children}</div>
          </ContentWrapperWithTopLine>
        )}

        {sm && <div className="DepositBorrowMainWrapper__mobile--content">{children}</div>}
      </div>

      {isShowRightPanel && (
        <div className="DepositBorrowMainWrapper__right-inner">
          <div className="DepositBorrowMainWrapper__right-content">
            <ContentWrapperWithTopLine title={itemsTitle}>
              <div className="DepositBorrowMainWrapper__title">My deposits</div>
              <div className="DepositBorrowMainWrapper__items">{items}</div>
              <Row className="DepositBorrowMainWrapper__total" title="Total">
                <Value
                  value={totalValue}
                  tokenIcon={true}
                  withoutSymbol={true}
                  symbol="USD"
                  maximumValueDecimals={2}
                  minimumValueDecimals={2}
                />
              </Row>
            </ContentWrapperWithTopLine>
          </div>
        </div>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .DepositBorrowMainWrapper {
          &__caption {
            color: ${currentTheme.textDarkBlue.hex};
          }
          .DepositBorrowMainWrapper__changeMarket-inner {
            color: ${currentTheme.textDarkBlue.hex};
          }

          &__right-content {
            height: 97%;
          }
        }
      `}</style>
    </div>
  );
}
