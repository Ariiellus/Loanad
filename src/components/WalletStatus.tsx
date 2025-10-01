"use client";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WalletStatus() {
  const { isConnected, address, chain } = useAccount();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        
        {isConnected && address && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Address:</span>
              <span className="text-sm font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            
            {chain && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network:</span>
                <span className="text-sm">{chain.name}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
