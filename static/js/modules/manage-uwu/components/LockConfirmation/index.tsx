import { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';
import { BigNumber } from '@aave/protocol-js';

import { useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { MultiFeeDistributionService } from '../../../../libs/aave-protocol-js/MulteFeeDistributionContract';
import Row from '../../../../components/basic/Row';
import Value from '../../../../components/basic/Value';
import StakeTxConfirmationView from '../../../../modules/staking/components/StakeTxConfirmationView';
import stakeMessages from '../../../../modules/staking/screens/StakeWithApprovalConfirmation/messages';
import defaultMessages from '../../../../defaultMessages';
import messages from './messages';
import { useUwuProviderContext } from '../../../../libs/uwu-provider/UwuProvider';

interface LockConfirmationProps {
  amount: BigNumber;
  maxAmount: BigNumber;
  onMainTxConfirmed?: () => void;
  onAfterSuccessClick?: (e: ChangeEvent) => void;
}

function LockConfirmation({
  amount,
  maxAmount,
  onMainTxConfirmed = () => {},
  onAfterSuccessClick = () => {},
}: LockConfirmationProps) {
  const intl = useIntl();
  const { chainId, currentMarketData } = useProtocolDataContext();
  const { userId } = useStaticPoolDataContext();
  const { provider: uwuProvider } = useUwuProviderContext();
  const selectedStake = 'UwU';
  const version = window.localStorage.getItem('version') ?? 'v2';

  if (!amount || !userId) {
    return null;
  }

  const uwuLpToken = currentMarketData.addresses.UWU_ETH_LP_TOKEN ?? '';
  let multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;

  switch (version) {
    case 'v1':
      multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V1;
      break;
    case 'v2':
      multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION;
      break;
    case 'v3':
      multiFeeDistributionAddress = currentMarketData.addresses.MULTI_FEE_DISTRIBUTION_V3;
      break;
  }

  const multiFeeDistributionService = new MultiFeeDistributionService(
    uwuProvider,
    uwuLpToken,
    multiFeeDistributionAddress
  );
  const handleGetTransactions = () =>
    multiFeeDistributionService.stake(userId, amount.toString(), true);

  let blockingError = '';
  if (amount.gt(maxAmount)) {
    blockingError = intl.formatMessage(stakeMessages.notEnoughBalance, {
      asset: selectedStake.toUpperCase(),
    });
  }

  return (
    <StakeTxConfirmationView
      getTransactionsData={handleGetTransactions}
      boxTitle={intl.formatMessage(defaultMessages.lock, { asset: selectedStake.toUpperCase() })}
      boxDescription={intl.formatMessage(messages.boxDescription)}
      mainTxName={intl.formatMessage(defaultMessages.lock, { asset: selectedStake.toUpperCase() })}
      mainTxType="LOCK_ACTION"
      blockingError={blockingError}
      goToAfterSuccess={''}
      onMainTxConfirmed={onMainTxConfirmed}
      onAfterSuccessClick={onAfterSuccessClick}
      successButtonTitle={intl.formatMessage(messages.backToStaking)}
      buttonTitle={intl.formatMessage(messages.buttonTitle)}
    >
      <Row title={`Amount`}>
        <Value
          symbol={`UWU-ETH LP`}
          value={amount.toString()}
          tokenIcon={true}
          tooltipId={selectedStake.toUpperCase()}
        />
      </Row>
    </StakeTxConfirmationView>
  );
}

export default LockConfirmation;
