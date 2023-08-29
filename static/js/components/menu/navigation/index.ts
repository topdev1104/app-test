import { MessageDescriptor } from 'react-intl';
import { MarketDataType } from '../../../helpers/config/types';

import messages from './messages';

export interface Navigation {
  link: string;
  title: MessageDescriptor;
  hiddenWithoutWallet?: boolean;
  absolute?: boolean;
  onClick?: () => void;
  isVisible?: (data: MarketDataType) => boolean | undefined;
}

const navigation: Navigation[] = [
  {
    link: '/markets',
    title: messages.markets,
  },
  {
    link: '/dashboard',
    title: messages.dashboard,
  },
  {
    link: '/loop',
    title: messages.loop,
  },
  {
    link: '/deposit',
    title: messages.deposit,
  },
  {
    link: '/borrow',
    title: messages.borrow,
  },
  {
    link: '/manage-uwu',
    title: messages.stake,
  },
];

export const moreNavigation: Navigation[] = [];

export const mobileNavigation: Navigation[] = [...navigation];

export default navigation;
