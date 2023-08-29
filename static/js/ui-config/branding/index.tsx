import React from 'react';
import { IntlShape } from 'react-intl/src/types';
import { SocialType } from '../../libs/aave-ui-kit';

import FormattedTxErrorTextUI from './FormattedTxErrorText';
import TopDisclaimerUI from './TopDisclaimer';
import LegalBanner from './LegalBanner';
import {
  DashboardLeftTopLine as DashboardLeftTopLineUI,
  DashboardLeftTopLineProps,
} from './DashboardLeftTopLine';
import { UnlockWalletExtraText as UnlockWalletExtraTextUI } from './UnlockWalletExtraText';

import logo from './images/lendLogo.svg';
import logo2 from './images/lendLogo2.svg';
import logo3 from './images/lendLogo3.svg';
import logoCatBack from './images/cat-back.svg';
import { SocialIcon } from '../../libs/aave-ui-kit/components/SocialIcons';

export const LOGO = logo;
export const LOGO_2 = logo2;
export const LOGO_3 = logo3;
export const LOGO_BACK_CAT = logoCatBack;

export const socialIcons: SocialIcon[] = [
  {
    url: 'https://github.com/aave/aave-ui',
    type: SocialType.Github,
  },
  {
    url: 'https://uwu.link/Discord',
    type: SocialType.Discord,
  },
];

export const TopDisclaimer: React.FC = TopDisclaimerUI;
export const BottomDisclaimer: React.FC = LegalBanner;
export const FormattedTxErrorText: React.FC = FormattedTxErrorTextUI;

export const DashboardLeftTopLine: React.FC<DashboardLeftTopLineProps> = DashboardLeftTopLineUI;

export const UnlockWalletExtraText: React.FC<{ intl: IntlShape }> = UnlockWalletExtraTextUI;
