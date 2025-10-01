'use client';
import { useCallback } from 'react';
import { useConnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type WalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onError?: (error: Error) => void;
};

export function WalletModal({
  className,
  isOpen,
  onClose,
  onError,
}: WalletModalProps) {
  const { connect, connectors } = useConnect();

  const handleConnect = useCallback(
    (connector: any) => {
      connect(
        { connector },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            onError?.(error);
          },
        }
      );
    },
    [connect, onClose, onError]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleConnect(connector)}
            >
              {connector.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
