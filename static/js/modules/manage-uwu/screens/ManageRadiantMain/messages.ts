import { defineMessages } from 'react-intl';

export default defineMessages({
  title: 'Manage Locks and Vestings',
  subTitle:
    'Lock UwU to share platform fees or lock it for 4 weeks to receive platform fees AND exit penalties.',
  walletDashboard: 'Your Wallet Dashboard',
  lockedStakedGeist: 'Locked + Vesting UwU',
  dailyRevenue: 'Your Daily revenue',
  weeklyRevenue: 'Your Weekly revenue',
  dailyPlatformFees: 'Your Daily Platform Fees',
  dailyPenaltyFees: 'Your Daily Penalty Fees',

  incentivesPerMonth: 'UwU per month',
  cooldownPeriod: 'Cooldown period',
  claim: 'Claim',

  noWalletConnect: 'Please connect a wallet',
  noWalletConnectDescription: 'We couldn’t detect a wallet. Connect a wallet to stake.',
  stakingAPY: 'Staking APR',
  currentMaxSlashing: 'Current max. slashing',
  days: 'Days',
  seconds: 'Seconds',

  helpIconLockedStaked:
    'UwU rewards can be vested for 28 days to receive the full amount. While vesting, you earn 50% of platform revenue from borrowers paying interest. You can always exit early from a vest for a 50% penalty.',

  helpIconDailyFeesTitle: 'Daily platform fees are derived from two mechanisms:',
  helpIconDailyFees1:
    '1. 50% of the platform fees from borrowing interest are distributed to users who stake or lock UwU.',
  helpIconDailyFees2:
    '2. All of the early exit penalty fees from vesting UwU are distributed to locked UwU holders.',
  helpIconDailyRevenue:
    'Your daily revenue earned from locking and/or vesting UwU. Revenue includes both platform and penalty fees when applicable.',

  vestLock: '1-Click Vest + Lock',
  withdrawLock: '1-Click Withdraw + Lock',

  vestLockDescription: 'Earn {lockingApr}% by locking your UwU now.',
  vestLockTooltip: 'Instantly Vest & Exit your pending UwU to start earning the Lock APR',
  startVesting: 'Start Vesting',
});
