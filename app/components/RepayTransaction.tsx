'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TransactionWrapper } from './TransactionWrapper';
import { buildRepayLoanCall, format } from '@/hooks/useContract';
import { CreditCard } from 'lucide-react';
import { Address } from 'viem';

interface RepayTransactionProps {
  address: Address;
  userDebt: bigint;
  onSuccess?: () => void;
}

export function RepayTransaction({ 
  address, 
  userDebt,
  onSuccess 
}: RepayTransactionProps) {
  const [repayAmount, setRepayAmount] = useState('');

  const handleSuccess = (response: any) => {
    console.log('Repayment successful!', response);
    setRepayAmount(''); // Clear input
    if (onSuccess) onSuccess(); // Refresh data
  };

  const handleError = (error: any) => {
    console.error('Repayment failed:', error);
    alert(`Error: ${error.message || 'Transaction failed'}`);
  };

  // Build the contract call
  const contracts = repayAmount ? [buildRepayLoanCall(repayAmount)] : [];

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-blue-500" />
        Repay Debt
      </h2>
      
      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">Current Debt</p>
          <p className="text-xl font-bold">{format(userDebt)} USDC</p>
        </div>

        <Input
          type="number"
          placeholder="Amount to repay in USDC"
          value={repayAmount}
          onChange={(e) => setRepayAmount(e.target.value)}
          className="w-full"
          step="0.01"
          min="0"
          max={Number(userDebt) / 1e18}
        />

        {repayAmount && parseFloat(repayAmount) > 0 ? (
          <TransactionWrapper
            address={address}
            contracts={contracts}
            buttonText={`Repay ${repayAmount} USDC`}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        ) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            Enter an amount to repay
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground text-center">
        ⚡ Gas-free • Powered by Coinbase Paymaster
      </div>
    </Card>
  );
}

