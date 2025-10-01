"use client";
import { useAccount } from "wagmi";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserInfo() {
  const { isConnected, address } = useAccount();

  if (!isConnected || !address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your wallet to view user information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Identity hasCopyAddressOnClick>
          <div className="flex items-center space-x-4">
            <Avatar />
            <div className="space-y-1">
              <Name />
              <Address />
              <EthBalance />
            </div>
          </div>
        </Identity>
      </CardContent>
    </Card>
  );
}
