'use client';
import { ReactNode, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useWalletContext } from './WalletProvider';
import { Card } from '@/components/ui/card';

export type WalletDropdownProps = {
  children?: ReactNode;
  className?: string;
};

const defaultWalletDropdownChildren = (
  <div className="p-4">
    <p className="text-sm text-muted-foreground">Wallet connected</p>
  </div>
);

export function WalletDropdown({
  children,
  className,
}: WalletDropdownProps) {
  const {
    isSubComponentOpen,
    connectRef,
    handleClose,
  } = useWalletContext();
  const { address } = useAccount();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        connectRef?.current &&
        !connectRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isSubComponentOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSubComponentOpen, handleClose, connectRef]);

  if (!address || !isSubComponentOpen) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 z-50 ${className || ''}`}
    >
      <Card className="min-w-[200px] shadow-lg">
        {children || defaultWalletDropdownChildren}
      </Card>
    </div>
  );
}
