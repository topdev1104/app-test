import { ChainId } from '@aave/contract-helpers';

import TxConfirmationView, {
  TxConfirmationViewProps,
} from '../../../../components/TxConfirmationView';
import { useStakeDataContext } from '../../../../libs/pool-data-provider/hooks/use-stake-data-context';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';

type StakeTxConfirmationViewProps = Omit<TxConfirmationViewProps, 'txChainId' | 'allowedChainIds'>;

function StakeTxConfirmationView({ onMainTxConfirmed, ...props }: StakeTxConfirmationViewProps) {
  const { refresh } = useStakeDataContext();
  const { chainId } = useProtocolDataContext();

  const handleMainTxConfirmed = () => {
    if (typeof onMainTxConfirmed === 'function') {
      onMainTxConfirmed();
    }
    refresh();
  };

  return (
    <TxConfirmationView
      {...props}
      txChainId={chainId}
      allowedChainIds={[ChainId.mainnet, ChainId.arbitrum_one, ChainId.arbitrum_rinkeby]}
      onMainTxConfirmed={handleMainTxConfirmed}
    />
  );
}

export default StakeTxConfirmationView;
