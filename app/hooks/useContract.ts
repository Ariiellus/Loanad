"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";
import { Address, parseEther, formatEther } from "viem";

export function useLoanadContract() {
  // ============ READ FUNCTIONS ============

  const useIsVerified = (userAddress?: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "getVerifiedUser",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      },
    });
  };

  const useMaxLoanAmount = (userAddress?: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "getMaximumAmountForLoan",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      },
    });
  };

  /**
   * Get user's debt
   */
  const useUserDebt = (userAddress?: Address) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "s_debtorBorrowed",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      },
    });
  };

  const useTotalLoans = () => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "getTotalLoans",
    });
  };

  const useActiveLoanIds = () => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "getActiveLoanIds",
    });
  };

  const useLoanBorrower = (loanId?: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "getLoanBorrower",
      args: loanId !== undefined ? [loanId] : undefined,
      query: {
        enabled: loanId !== undefined,
      },
    });
  };

  const useLoanCollateral = (loanId?: bigint) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "getLoanCollateral",
      args: loanId !== undefined ? [loanId] : undefined,
      query: {
        enabled: loanId !== undefined,
      },
    });
  };

  // ============ WRITE FUNCTIONS ============

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const borrow = (amount: string) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "borrow",
      args: [parseEther(amount)],
      value: parseEther(amount), // Send collateral
    });
  };

  const repayLoan = (amount: string) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "repay",
      value: parseEther(amount),
    });
  };

  const addCollateral = (loanId: bigint, amount: string) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "addCollateralForCrowfundedLoan",
      args: [loanId],
      value: parseEther(amount),
    });
  };

  const createLoanRequest = (amount: string) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "createLoanRequest",
      args: [parseEther(amount)],
    });
  };

  const withdrawCollateral = (amount: string, loanId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "withdrawForCrowfundedLoan",
      args: [parseEther(amount), loanId],
    });
  };

  const assignMaxLoan = (userAddress: Address) => {
    console.log('🔧 assignMaxLoan called with address:', userAddress);
    console.log('🔧 Contract address:', CONTRACT_ADDRESS);
    console.log('🔧 Calling writeContract...');
    
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: "assignMaximumAmountForLoan",
      args: [userAddress],
    });
    
    console.log('🔧 writeContract called!');
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    useIsVerified,
    useMaxLoanAmount,
    useUserDebt,
    useTotalLoans,
    useActiveLoanIds,
    useLoanBorrower,
    useLoanCollateral,
    
    borrow,
    repayLoan,
    addCollateral,
    createLoanRequest,
    withdrawCollateral,
    assignMaxLoan,
    
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

// Helper functions
export const format = (wei: bigint) => formatEther(wei);
export const parseMON = (amount: string) => parseEther(amount);

// Helper to create contract call parameters for OnchainKit Transaction component
export const createContractCall = (
  functionName: string,
  args: any[] = [],
  value?: bigint
) => {
  return {
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName,
    args,
    ...(value && { value }),
  };
};

// Contract call builders for OnchainKit Transaction component
export const buildBorrowCall = (amount: string) => 
  createContractCall('borrow', [parseEther(amount)]);

export const buildRepayLoanCall = (amount: string) => 
  createContractCall('repayLoan', [], parseEther(amount));

export const buildAddCollateralCall = (loanId: number, amount: string) => 
  createContractCall('addCollateral', [BigInt(loanId)], parseEther(amount));

export const buildWithdrawCollateralCall = (loanId: number, amount: string) => 
  createContractCall('withdrawCollateral', [BigInt(loanId), parseEther(amount)]);

export const buildCreateLoanRequestCall = (amount: string) => 
  createContractCall('createLoanRequest', [parseEther(amount)]);

export const buildAssignMaxLoanCall = (userAddress: Address) => 
  createContractCall('assignMaximumAmountForLoan', [userAddress]);

