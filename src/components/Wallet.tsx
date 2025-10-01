'use client';
import { ReactNode } from 'react';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider } from './WalletProvider';

export type WalletProps = {
  children?: ReactNode;
  className?: string;
};

function WalletContent({ children, className }: WalletProps) {
  return (
    <div className={`relative w-fit shrink-0 ${className || ''}`}>
      {children}
    </div>
  );
}

export function Wallet({
  children = (
    <>
      <ConnectWallet />
      <WalletDropdown />
    </>
  ),
  className,
}: WalletProps) {
  return (
    <WalletProvider>
      <WalletContent className={className}>
        {children}
      </WalletContent>
    </WalletProvider>
  );
}
