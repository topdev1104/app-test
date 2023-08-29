import Link from '../../../../basic/Link';
import Value from '../../../../basic/Value';
import Row from '../../../../basic/Row';
import { getAssetInfo, TokenIcon } from '../../../../../helpers/config/assets-config';

import staticStyles from './style';
import { useThemeContext } from '../../../../../libs/aave-ui-kit';

interface CardProps {
  walletBalanceInUSD: number | string;
  symbol: string;
  id: string;
  value: string;
  underlyingAsset: string;
}

export default function Card({
  symbol,
  id,
  value,
  underlyingAsset,
  walletBalanceInUSD,
}: CardProps) {
  const { currentTheme, xl, sm } = useThemeContext();

  const asset = getAssetInfo(symbol);

  const iconSize = xl && !sm ? 20 : sm ? 24 : 25;

  return (
    <div className="Card ButtonLink" color="dark">
      <Row className="Card__content">
        <TokenIcon
          tokenSymbol={symbol}
          height={iconSize}
          width={iconSize}
          tokenFullName={asset.shortSymbol || asset.formattedName}
        />
        <Value
          value={value}
          maximumValueDecimals={2}
          subValue={walletBalanceInUSD}
          maximumSubValueDecimals={2}
          subSymbol="USD"
          tooltipId={`${underlyingAsset}-${id}`}
        />
      </Row>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </div>
  );
}
