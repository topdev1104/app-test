import { useIntl } from 'react-intl';
import { useThemeContext } from '../../../../../libs/aave-ui-kit';

import staticStyles from './style';
import { PieChart } from '../../../../../components/compositionBars/PieChart';
import messages from './messages';

interface ReserveStatusGraphProps {
  symbol: string;
  totalBorrows: number | string;
  availableLiquidity: number | string;
}

export default function ReserveStatusGraph({
  symbol,
  totalBorrows,
  availableLiquidity,
}: ReserveStatusGraphProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  return (
    <>
      <PieChart
        width={161}
        height={161}
        slices={[
          {
            value: +availableLiquidity,
            label: intl.formatMessage(messages.availableLiquidity),
            color: '#79c982',
          },
          {
            value: +totalBorrows,
            label: intl.formatMessage(messages.totalBorrowed),
            color: '#F7A646',
          },
        ]}
      />

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </>
  );
}
