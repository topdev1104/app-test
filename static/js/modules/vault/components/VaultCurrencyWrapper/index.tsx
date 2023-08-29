import React, { ReactNode } from 'react';
import VaultScreenWrapper from '../../../../components/wrappers/VaultScreenWrapper';

interface VaultCurrencyWrapperProps {
  user: any;
  currencySymbol: string;
  goBack?: () => void;
  children: ReactNode;
}

export default function VaultCurrencyWrapper({
  user,
  currencySymbol,
  children,
  goBack,
}: VaultCurrencyWrapperProps) {
  return (
    <VaultScreenWrapper currencySymbol={currencySymbol} user={user} goBack={goBack}>
      {children}
    </VaultScreenWrapper>
  );
}
