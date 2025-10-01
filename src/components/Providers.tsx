'use client';

import { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { baseSepolia } from 'wagmi/chains';

// Create wagmi config
const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "demo"}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: "auto",
            },
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { Wallet } from './Wallet';
export { ConnectWallet } from './ConnectWallet';
export { WalletModal } from './WalletModal';
export { WalletDropdown } from './WalletDropdown';
export { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
export { WalletConnection } from './WalletConnection';
export { UserInfo } from './UserInfo';
export { WalletStatus } from './WalletStatus';
