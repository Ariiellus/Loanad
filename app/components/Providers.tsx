"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

// Create wagmi config with OnchainKit
const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Loanad",
    }),
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_CDP_API_KEY || process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {apiKey ? (
          <OnchainKitProvider
            apiKey={apiKey}
            chain={baseSepolia}
            config={{
              paymaster: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT,
              appearance: {
                name: "Loanad",
                logo: "/Loanad-Logo.png",
                mode: "auto",
                theme: "default",
              },
              wallet: {
                display: "modal",
                termsUrl: "https://loanad.app/terms",
                privacyUrl: "https://loanad.app/privacy",
                supportedWallets: {
                  rabby: true,
                  trust: true,
                  frame: true,
                },
              },
            }}
          >
            {children}
          </OnchainKitProvider>
        ) : (
          children
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { WalletConnection } from "./WalletConnection";
