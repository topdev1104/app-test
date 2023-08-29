import React, { ReactNode } from 'react';
import ScreenWrapper from '../ScreenWrapper';
import ContentWrapper from '../ContentWrapper';

import staticStyles from './style';

import { ValidationWrapperComponentProps } from '../../RouteParamsValidationWrapper';

interface VaultScreenWrapperProps
  extends Pick<ValidationWrapperComponentProps, 'userReserve' | 'user' | 'currencySymbol'> {
  goBack?: () => void;
  children: ReactNode;
}

export default function VaultScreenWrapper({
  currencySymbol,
  goBack,
  children,
}: VaultScreenWrapperProps) {
  return (
    <ScreenWrapper pageTitle={`Vault`} className="VaultScreenWrapper">
      <div className="DesktopPageTitle">
        <h2>
          <div>{currencySymbol.toUpperCase()} Vault</div>
        </h2>
        <h2 className="PageSecondHeader">A crypto vault</h2>
      </div>
      <ContentWrapper className="VaultScreenWrapper__content">{children}</ContentWrapper>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .VaultScreenWrapper {
          &__content {
            background: none !important;
          }

          .DesktopPageTitle {
            h2 {
              font-weight: 600;
              font-size: 18px;
              line-height: 22px;
              color: white;
              div {
                color: white;
                font-weight: 600;
                font-size: 39px;
                line-height: 47px;
                letter-spacing: -0.02em;
              }
            }
          }
        }
      `}</style>
    </ScreenWrapper>
  );
}
