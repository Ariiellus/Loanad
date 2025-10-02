'use client';

import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import type { ContractFunctionParameters } from 'viem';
import { baseSepolia } from 'wagmi/chains';

interface TransactionWrapperProps {
  address: `0x${string}`;
  contracts: ContractFunctionParameters[];
  buttonText: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

export function TransactionWrapper({
  address,
  contracts,
  buttonText,
  onSuccess,
  onError,
  className = "w-full",
}: TransactionWrapperProps) {
  const handleSuccess = (response: any) => {
    console.log('✅ Transaction successful:', response);
    if (onSuccess) onSuccess(response);
  };

  const handleError = (error: any) => {
    console.error('❌ Transaction failed:', error);
    if (onError) onError(error);
  };

  return (
    <div className={className}>
      <Transaction
        calls={contracts}
        chainId={baseSepolia.id}
        onError={handleError}
        onSuccess={handleSuccess}
        capabilities={{
          paymasterService: {
            url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT || '',
          },
        }}
      >
        {/* @ts-ignore - OnchainKit type compatibility */}
        <TransactionButton
          className="!w-full !bg-monad-purple hover:!bg-monad-purple/90 !text-white !font-montserrat !font-bold !py-6 !rounded-xl !text-lg !transition-all !duration-300 !cursor-pointer"
          text={buttonText}
        />
        {/* @ts-ignore - OnchainKit type compatibility */}
        <TransactionStatus className="!mt-4">
          {/* @ts-ignore */}
          <TransactionStatusLabel className="!text-sm" />
          {/* @ts-ignore */}
          <TransactionStatusAction className="!text-sm" />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}

