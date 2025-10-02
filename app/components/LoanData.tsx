"use client";

import { useAccount } from "wagmi";
import { useLoanadContract, formatMON } from "@/hooks/useContract";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoanData() {
  const { address, isConnected } = useAccount();
  const [borrowAmount, setBorrowAmount] = useState("");
  
  const {
    useIsVerified,
    useMaxLoanAmount,
    useUserDebt,
    useTotalLoans,
    useActiveLoanIds,
    
    borrow,
    createLoanRequest,
    repayLoan,
    
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  } = useLoanadContract();

  // Use the hooks - they return { data, isLoading, error, refetch }
  const { data: isVerified, isLoading: verifiedLoading } = useIsVerified(address);
  const { data: maxLoanAmount, isLoading: maxLoanLoading } = useMaxLoanAmount(address);
  const { data: userDebt, isLoading: debtLoading } = useUserDebt(address);
  const { data: totalLoans } = useTotalLoans();
  const { data: activeLoanIds } = useActiveLoanIds();

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Your Loan Information</h2>
      
      {/* Display user data */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Account Status</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Verified:</span>{" "}
            {verifiedLoading ? "Loading..." : isVerified ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <span className="font-medium">Max Loan Amount:</span>{" "}
            {maxLoanLoading
              ? "Loading..."
              : maxLoanAmount
              ? `${formatMON(maxLoanAmount)} MON`
              : "0 MON"}
          </p>
          <p>
            <span className="font-medium">Current Debt:</span>{" "}
            {debtLoading
              ? "Loading..."
              : userDebt
              ? `${formatMON(userDebt)} MON`
              : "0 MON"}
          </p>
        </div>
      </Card>

      {/* Display global data */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Market Stats</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Total Loans:</span>{" "}
            {totalLoans?.toString() || "0"}
          </p>
          <p>
            <span className="font-medium">Active Loans:</span>{" "}
            {activeLoanIds?.length || "0"}
          </p>
        </div>
      </Card>

      {/* Borrow section */}
      {isVerified && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Borrow MON</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Amount in MON"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <Button
              onClick={() => borrow(borrowAmount)}
              disabled={!borrowAmount || isPending || isConfirming}
              className="w-full"
            >
              {isPending
                ? "Waiting for approval..."
                : isConfirming
                ? "Confirming..."
                : "Borrow"}
            </Button>
            
            {isConfirmed && (
              <p className="text-green-600">
                ✅ Transaction confirmed! Hash: {hash?.slice(0, 10)}...
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Active loans list */}
      {activeLoanIds && activeLoanIds.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Active Loan IDs</h3>
          <div className="space-y-1">
            {activeLoanIds.map((loanId: bigint, index: number) => (
              <p key={index}>Loan #{loanId.toString()}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

