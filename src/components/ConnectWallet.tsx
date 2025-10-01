'use client';
import { ReactNode, useCallback, useContext, useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { WalletModal } from '@/components/WalletModal';
import {
  useWalletContext,
  WalletContext,
  WalletProvider,
  type WalletContextType,
} from './WalletProvider';
import { cn } from '@/lib/utils';

export type ConnectWalletProps = {
  /** Children can be utilized to display customized content when the wallet is connected. */
  children?: ReactNode;
  /** Optional className override for button element */
  className?: string;
  /** Optional callback function to execute when the wallet is connected. */
  onConnect?: () => void;
  /** Optional disconnected display override */
  disconnectedLabel?: ReactNode;
};

function ConnectWalletContent({
  children,
  className,
  onConnect,
  disconnectedLabel = 'Connect Wallet',
}: ConnectWalletProps) {
  const walletContext = useWalletContext();
  const {
    isConnectModalOpen,
    setIsConnectModalOpen,
    isSubComponentOpen,
    setIsSubComponentOpen,
    handleClose,
  } = walletContext;
  const {
    address: accountAddress,
    status,
    connector: accountConnector,
  } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const [hasClickedConnect, setHasClickedConnect] = useState(false);

  const connector = accountConnector || connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  const handleToggle = useCallback(() => {
    if (isSubComponentOpen) {
      handleClose();
    } else {
      setIsSubComponentOpen(true);
    }
  }, [isSubComponentOpen, handleClose, setIsSubComponentOpen]);

  const handleCloseConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, [setIsConnectModalOpen]);

  const handleOpenConnectModal = useCallback(() => {
    setIsConnectModalOpen(true);
    setHasClickedConnect(true);
  }, [setIsConnectModalOpen]);

  useEffect(() => {
    if (status !== 'connected') return;

    if (hasClickedConnect && onConnect) {
      onConnect();
      setHasClickedConnect(false);
    }
  }, [status, hasClickedConnect, onConnect]);

  const handleConnectClick = useCallback(() => {
    handleOpenConnectModal();
    setHasClickedConnect(true);
  }, [handleOpenConnectModal]);

  const buttonContent = useMemo(() => {
    if (isLoading) return 'Connecting...';

    if (status === 'disconnected') return disconnectedLabel;

    return (
      <div className="flex items-center justify-center gap-2">{children}</div>
    );
  }, [isLoading, status, disconnectedLabel, children]);

  if (status === 'disconnected') {
    return (
      <div className="flex">
        <Button
          type="button"
          className={cn('inline-flex min-w-[153px]', className)}
          onClick={handleConnectClick}
        >
          {buttonContent}
        </Button>
        <WalletModal
          isOpen={isConnectModalOpen}
          onClose={handleCloseConnectModal}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex">
        <Button
          type="button"
          className={cn('inline-flex min-w-[153px]', className)}
          disabled={true}
        >
          {buttonContent}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className={cn(
          'px-4 py-3',
          isSubComponentOpen && 'bg-secondary',
          className,
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-center gap-2">
          {children}
        </div>
      </Button>
    </div>
  );
}

export function ConnectWallet(props: ConnectWalletProps) {
  // Using `useContext` because `useWalletContext` will throw if there is no
  // Provider up the tree.
  const walletContext = useContext(WalletContext);

  if (!walletContext) {
    return (
      <WalletProvider>
        <ConnectWalletContent {...props} />
      </WalletProvider>
    );
  }

  return <ConnectWalletContent {...props} />;
}
