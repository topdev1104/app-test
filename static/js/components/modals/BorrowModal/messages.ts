import { defineMessages } from 'react-intl';

export default defineMessages({
  title: 'How much would you like to borrow?',
  description:
    'Please enter an amount you would like to borrow. The maximum amount you can borrow is shown below.',
  amountTitle: 'Available to borrow',

  noDataTitle: 'No deposits yet',
  noDataDescription: 'You need to deposit some collateral first to unlock your borrowing power.',
  noLiquidityAvailableTitle: 'No liquidity',
  noLiquidityAvailableDescription: 'There is no {symbol} available liquidity to borrow.',
  healthFactorTooLowTitle: 'Health factor too low',
  healthFactorTooLowDescription:
    'Deposit more collateral or repay part of your borrowings to increase your health factor and be able to borrow.',
  noDataButtonTitle: 'Deposit now',

  connectWallet: 'Please connect a wallet',
  connectWalletDescription: 'We couldn’t detect a wallet. Connect a wallet to borrow.',
  currentBorrowRateTitle: 'Current {borrowRateMode} rate',
  errorPageDescription: 'Incorrect transaction',
  errorStableRateNotEnabled: 'The Stable Rate is not enabled for this currency',
  errorNotEnoughLiquidity: 'There are not enough funds in the {currencySymbol} reserve to borrow',
  errorNotEnoughCollateral: 'Your collateral is not enough to borrow this amount',
  errorBorrowingNotAvailable: 'Borrowing is currently unavailable for {currencySymbol}.',
  caption: 'Borrow overview',
  boxDescription: 'Please submit to borrow',
  approveDescription: 'Please approve before borrowing',
  valueRowTitle: 'Amount',
  APYRowTitle: 'Interest (APY)',
  borrowRateMode: 'New {borrowRateMode} rate',
  rateTypeRowTitle: 'Interest rate type',
  healthFactorRowTitle: 'New health factor',
  originationFeeRowTitle: 'Origination fee {percent}%',
  variable: 'Variable',
  stable: 'Stable',

  errorBorrowingAreTooSmall: "You can't borrow less then {amount}{symbol}",
});
