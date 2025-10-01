'use client';
import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export type WalletDropdownDisconnectProps = {
  className?: string;
  text?: string;
};

export function WalletDropdownDisconnect({
  className,
  text = 'Disconnect',
}: WalletDropdownDisconnectProps) {
  const { disconnect, connectors } = useDisconnect();
  
  const handleDisconnect = useCallback(() => {
    // Disconnect all the connectors (wallets). Usually only one is connected
    connectors.forEach((connector) => disconnect({ connector }));
  }, [disconnect, connectors]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-full justify-start ${className || ''}`}
      onClick={handleDisconnect}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}
