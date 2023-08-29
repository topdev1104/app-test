import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import ContentWrapperWithTopLine from '../ContentWrapperWithTopLine';
import Row from '../../basic/Row';
import Value from '../../basic/Value';

import staticStyles from './style';
import messages from './messages';
import { useThemeContext } from '../../../libs/aave-ui-kit';

interface BorrowMainWrapperProps {
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

export default function BorrowMainWrapper({
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
}: BorrowMainWrapperProps) {
  const intl = useIntl();
  const { currentTheme, sm } = useThemeContext();

  return (
    <div className="BorrowMainWrapper">
      <div className="BorrowMainWrapper__left-inner">
        {!sm && (
          <ContentWrapperWithTopLine title={contentTitle} className="">
            <div className="BorrowMainWrapper__content">{children}</div>
          </ContentWrapperWithTopLine>
        )}

        {sm && <div className="BorrowMainWrapper__mobile--content">{children}</div>}
      </div>

      {isShowRightPanel && (
        <div className="BorrowMainWrapper__right-inner">
          <div className="BorrowMainWrapper__right-content">
            <ContentWrapperWithTopLine title={itemsTitle}>
              <h4 className="BorrowMainWrapper__title">My borrows</h4>

              <div className="BorrowMainWrapper__items">{items}</div>

              <Row className="BorrowMainWrapper__total" title={intl.formatMessage(messages.total)}>
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
