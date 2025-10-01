'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

export type WalletContextType = {
  /** Whether the connect modal is open */
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  /** Whether the sub component (dropdown) is open */
  isSubComponentOpen: boolean;
  setIsSubComponentOpen: Dispatch<SetStateAction<boolean>>;
  /** Handle closing sub components */
  handleClose: () => void;
  /** Reference to the connect button */
  connectRef: React.RefObject<HTMLDivElement | null>;
};

export const WalletContext = createContext<WalletContextType | null>(null);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSubComponentOpen, setIsSubComponentOpen] = useState(false);
  const connectRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    setIsSubComponentOpen(false);
  }, []);

  const value = useMemo(() => {
    return {
      isConnectModalOpen,
      setIsConnectModalOpen,
      isSubComponentOpen,
      setIsSubComponentOpen,
      handleClose,
      connectRef,
    };
  }, [isConnectModalOpen, isSubComponentOpen, handleClose]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }

  return context;
}
