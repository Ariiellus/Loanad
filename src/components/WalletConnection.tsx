"use client";
import { useAccount } from "wagmi";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";

export function WalletConnection() {
  const { isConnected } = useAccount();

  return (
    <Wallet>
      {!isConnected ? (
        <ConnectWallet />
      ) : (
        <WalletDropdown>
          <Identity hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      )}
    </Wallet>
  );
}
