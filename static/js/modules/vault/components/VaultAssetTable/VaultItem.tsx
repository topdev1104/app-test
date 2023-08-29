import React, { useEffect, useState } from 'react';

import TableItem from '../../../../components/BasicAssetsTable/TableItem';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import Value from '../../../../components/basic/Value';
import NoData from '../../../../components/basic/NoData';

import { VaultTableItem } from './types';
import TableButtonsWrapper from '../../../dashboard/components/DashboardTable/TableButtonsWrapper';
import TableButtonCol from '../../../dashboard/components/DashboardTable/TableButtonCol';
import { YoSifuStargateVaultContract } from '../../../../libs/aave-protocol-js/YoSifuStargateVault';
import { mainet } from '../../../../ui-config/markets/tokensConfig';
import { valueToBigNumber } from '@aave/protocol-js';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { Calculator } from '../../utils/calculator';
import ValuePercent from '../../../../components/basic/ValuePercent';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

export default function VaultItem({ asset, symbol, userId, coingeckoSymbol }: VaultTableItem) {
  const [totalAssets, setTotalAssets] = useState<string>('0');
  const { chainId } = useProtocolDataContext();
  const [apr, setAPR] = useState<string>();
  const { provider: uwuProvider } = useUwuProviderContext();

  useEffect(() => {
    const reserve = mainet.vaultReserves.find((reserve) => reserve.asset === asset);

    if (reserve) {
      const vaultContract = new YoSifuStargateVaultContract(uwuProvider, reserve.vault);

      vaultContract.totalSupply().then((totalSupply) => {
        const dec = valueToBigNumber(10)
          .exponentiatedBy(valueToBigNumber(reserve?.decimals))
          .toString();
        setTotalAssets(valueToBigNumber(totalSupply.toString()).div(dec).toString());
      });
    }

    if (reserve) {
      const calculator = new Calculator(uwuProvider);
      calculator.calculateVaultAPR(reserve.symbol).then((apr) => {
        setAPR(apr.div(100).toString());
      });
    }
  }, []);

  const url = `/vault/${asset}-deposit`;

  return (
    <TableItem symbol={symbol} darkOnDarkMode={true} onClick={() => {}}>
      <TableColumn>
        {!userId ? (
          <NoData color="dark" />
        ) : apr ? (
          <ValuePercent value={apr ?? 0} />
        ) : (
          <div style={{ color: 'white' }}>fetching...</div>
        )}
      </TableColumn>
      <TableColumn>
        {!userId ? (
          <NoData color="dark" />
        ) : totalAssets !== '0' ? (
          <Value
            value={totalAssets}
            subSymbol="USD"
            maximumSubValueDecimals={2}
            minimumValueDecimals={3}
            maximumValueDecimals={3}
          />
        ) : (
          <div style={{ color: 'white' }}>fetching...</div>
        )}
      </TableColumn>
      <TableColumn>
        <TableButtonsWrapper>
          <TableButtonCol disabled={false} title={`Deposit`} linkTo={`/vault/${asset}-deposit`} />
          <TableButtonCol disabled={false} title={`Withdraw`} linkTo={`/vault/${asset}-withdraw`} />
        </TableButtonsWrapper>
      </TableColumn>
    </TableItem>
  );
}
