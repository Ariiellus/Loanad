'use client';

import { TransactionWrapper } from './TransactionWrapper';
import { buildAssignMaxLoanCall } from '@/hooks/useContract';
import { Address } from 'viem';

interface VerifyTransactionProps {
  address: Address;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function VerifyTransaction({ 
  address, 
  onSuccess,
  disabled = false
}: VerifyTransactionProps) {
  const handleSuccess = (response: any) => {
    console.log('Verification successful!', response);
    if (onSuccess) onSuccess();
  };

  const handleError = (error: any) => {
    console.error('Verification failed:', error);
    alert(`Verification error: ${error.message || 'Transaction failed'}`);
  };

  // Build the contract call
  const contracts = [buildAssignMaxLoanCall(address)];

  if (disabled) {
    return (
      <div className="w-full bg-gray-400 text-gray-200 cursor-not-allowed font-montserrat font-bold py-6 rounded-xl text-lg text-center">
        Complete verification steps first
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <TransactionWrapper
        address={address}
        contracts={contracts}
        buttonText="Verify & Get 10 MON"
        onSuccess={handleSuccess}
        onError={handleError}
        className="w-full"
      />
      <div className="text-xs text-muted-foreground text-center">
        ⚡ Gas-free • Powered by Coinbase Paymaster
      </div>
    </div>
  );
}

