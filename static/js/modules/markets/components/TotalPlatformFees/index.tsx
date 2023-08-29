import { useThemeContext } from '../../../../libs/aave-ui-kit';
import staticStyles from './style';
import { BigNumber, valueToBigNumber } from '@aave/protocol-js';
import BoxNoLike from '../../../../images/box-noLike.svg';
import { useIntl } from 'react-intl';
interface TotalMarketsSizeProps {
  value: BigNumber;
}

export default function TotalPlatformFees({ value }: TotalMarketsSizeProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();

  return (
    <div className="TotalMarketsSize">
      <img src={BoxNoLike} alt="wallet" width={32} height={32} style={{ marginRight: 10 }} />
      <div>
        <p>Total Platform Fees</p>
        <h2>
          ${intl.formatNumber(valueToBigNumber(value).toNumber(), { maximumFractionDigits: 2 })}
          {/*{value < 100000000000 ? (*/}
          {/*  intl.formatNumber(value, {*/}
          {/*    maximumFractionDigits: 2,*/}
          {/*    minimumFractionDigits: 2,*/}
          {/*  })*/}
          {/*) : (*/}
          {/*  <CompactNumber value={value} maximumFractionDigits={2} minimumFractionDigits={2} />*/}
          {/*)}*/}
        </h2>
      </div>

      <style jsx={true}>{staticStyles}</style>
    </div>
  );
}
