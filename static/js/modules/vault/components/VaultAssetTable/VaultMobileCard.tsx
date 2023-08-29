import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import MobileCardWrapper from '../../../../components/wrappers/MobileCardWrapper';
import Row from '../../../../components/basic/Row';
import NoData from '../../../../components/basic/NoData';
import Value from '../../../../components/basic/Value';
import { isAssetStable } from '../../../../helpers/config/assets-config';

import { VaultTableItem } from './types';
import { mainet } from '../../../../ui-config/markets/tokensConfig';
import { YoSifuStargateVaultContract } from '../../../../libs/aave-protocol-js/YoSifuStargateVault';
import { getProvider } from '../../../../helpers/config/markets-and-network-config';
import { valueToBigNumber } from '@aave/protocol-js';
import { Calculator } from '../../utils/calculator';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import ValuePercent from '../../../../components/basic/ValuePercent';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

export default function VaultMobileCard({ symbol, asset, userId }: VaultTableItem) {
  const history = useHistory();
  const [totalAssets, setTotalAssets] = useState<string>('0');
  const { chainId } = useProtocolDataContext();
  const [apr, setAPR] = useState<string>();
  const { provider: uwuProvider } = useUwuProviderContext();

  const url = `/vault/${asset}-deposit`;

  useEffect(() => {
    const reserve = mainet.vaultReserves.find((reserve) => reserve.asset === asset);

    if (reserve) {
      const vaultContract = new YoSifuStargateVaultContract(uwuProvider, reserve.vault);

      vaultContract.totalSupply().then((totalSupply) => {
        setTotalAssets(
          valueToBigNumber(totalSupply.toString())
            .div(valueToBigNumber(10).exponentiatedBy(valueToBigNumber(reserve?.decimals)))
            .toString()
        );
      });
    }

    if (reserve) {
      const calculator = new Calculator(uwuProvider);
      calculator.calculateVaultAPR(reserve.symbol).then((apr) => {
        setAPR(apr.div(100).toString());
      });
    }
  }, []);

  return (
    <MobileCardWrapper onClick={() => history.push(url)} symbol={symbol} withGoToTop={true}>
      <Row title={`APY`} withMargin={true}>
        {!userId ? <NoData color="dark" /> : <ValuePercent value={apr ?? '0'} />}
      </Row>

      {
        <Row title={`Total Assets`} withMargin={true}>
          <Value
            value={totalAssets}
            maximumSubValueDecimals={2}
            minimumValueDecimals={isAssetStable(symbol) ? 2 : 5}
            maximumValueDecimals={isAssetStable(symbol) ? 2 : 5}
          />
        </Row>
      }
    </MobileCardWrapper>
  );
}
