'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TransactionWrapper } from './TransactionWrapper';
import { buildBorrowCall } from '@/hooks/useContract';
import { TrendingUp } from 'lucide-react';
import { Address } from 'viem';

interface BorrowTransactionProps {
  address: Address;
  maxLoanAmount: bigint;
  onSuccess?: () => void;
}

export function BorrowTransaction({ 
  address, 
  maxLoanAmount,
  onSuccess 
}: BorrowTransactionProps) {
  const [borrowAmount, setBorrowAmount] = useState('');

  const handleSuccess = (response: any) => {
    console.log('Borrow successful!', response);
    setBorrowAmount(''); // Clear input
    if (onSuccess) onSuccess(); // Refresh data
  };

  const handleError = (error: any) => {
    console.error('Borrow failed:', error);
    alert(`Error: ${error.message || 'Transaction failed'}`);
  };

  // Build the contract call
  const contracts = borrowAmount ? [buildBorrowCall(borrowAmount)] : [];

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-500" />
        Borrow USDC
      </h2>
      
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Amount in USDC"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
          className="w-full"
          step="0.01"
          min="0"
          max={Number(maxLoanAmount) / 1e18}
        />

        {borrowAmount && parseFloat(borrowAmount) > 0 ? (
          <TransactionWrapper
            address={address}
            contracts={contracts}
            buttonText={`Borrow ${borrowAmount} USDC`}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        ) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            Enter an amount to borrow
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground text-center">
        ⚡ Gas-free • Powered by Coinbase Paymaster
      </div>
    </Card>
  );
}

