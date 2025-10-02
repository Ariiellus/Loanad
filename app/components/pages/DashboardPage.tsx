'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useLoanadContract, format } from '@/hooks/useContract';
import { 
  Loader2, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  Shield, 
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Address } from 'viem';
import { WalletConnection } from '../WalletConnection';

const DashboardPage = () => {
  const router = useRouter();
  const { isConnected, address, disconnect } = useWalletConnection();
  
  // Use contract hooks for reading data
  const {
    useIsVerified,
    useMaxLoanAmount,
    useUserDebt,
    useTotalLoans,
    useActiveLoanIds,
    borrow,
    repayLoan,
    isPending,
    isConfirming,
    isConfirmed,
    hash
  } = useLoanadContract();

  // Read contract data - these auto-fetch and cache
  const { data: isVerified, isLoading: loadingVerified, refetch: refetchVerified } = useIsVerified(address as Address);
  const { data: maxLoanAmount, isLoading: loadingMax, refetch: refetchMax } = useMaxLoanAmount(address as Address);
  const { data: userDebt, isLoading: loadingDebt, refetch: refetchDebt } = useUserDebt(address as Address);
  const { data: totalLoans, isLoading: loadingTotal, refetch: refetchTotal } = useTotalLoans();
  const { data: activeLoanIds, isLoading: loadingActive, refetch: refetchActive } = useActiveLoanIds();

  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  
  const isLoading = loadingVerified || loadingMax || loadingDebt || loadingTotal || loadingActive;

  // Handle refresh - refetch all data
  const handleRefresh = async () => {
    await Promise.all([
      refetchVerified(),
      refetchMax(),
      refetchDebt(),
      refetchTotal(),
      refetchActive()
    ]);
  };

  // Handle borrow
  const handleBorrow = () => {
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      alert('Please enter a valid amount to borrow');
      return;
    }

    const confirmBorrow = window.confirm(
      `Are you sure you want to borrow ${borrowAmount} USDC?\n\nThis action will increase your debt.`
    );

    if (confirmBorrow) {
      borrow(borrowAmount);
    }
  };

  // Handle repay
  const handleRepay = () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      alert('Please enter a valid amount to repay');
      return;
    }

    const confirmRepay = window.confirm(
      `Are you sure you want to repay ${repayAmount} USDC?`
    );

    if (confirmRepay) {
      repayLoan(repayAmount);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  // Redirect if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <p className="text-center text-muted-foreground mb-4">No wallet connected</p>
          <WalletConnection />
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4 text-monad-purple" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-montserrat font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm" className="cursor-pointer">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button onClick={handleDisconnect} variant="outline" size="sm" className="cursor-pointer">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Wallet Info */}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-monad-purple" />
            <span className="font-mono text-sm">{address}</span>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Verification Status */}
          <Card className="p-4 col-span-2">
            <div className="flex items-center gap-2 mb-2">
              {isVerified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
              <h3 className="text-sm font-semibold text-muted-foreground">Verification status:</h3>
            </div>
            <p className="text-xl font-bold">{isVerified ? 'Verified' : 'Not Verified'}</p>
          </Card>

          {/* Max Loan Amount */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-monad-purple" />
              <h3 className="text-xs font-semibold text-muted-foreground">Max Loan</h3>
            </div>
            <p className="text-lg font-bold">
              {maxLoanAmount ? format(maxLoanAmount) : '0'} USDC
            </p>
          </Card>

          {/* Current Debt */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-semibold text-muted-foreground">Your Debt</h3>
            </div>
            <p className="text-lg font-bold">
              {userDebt ? format(userDebt) : '0'} USDC
            </p>
          </Card>
        </div>

        {/* Borrow Section */}
        {isVerified && maxLoanAmount && maxLoanAmount > BigInt(0) && (
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Borrow USDC
            </h2>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Amount in USDC"
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleBorrow}
                disabled={isPending || isConfirming || !borrowAmount}
                className={`bg-monad-purple hover:bg-monad-purple/90 ${
                  isPending || isConfirming || !borrowAmount ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    {isPending ? 'Waiting...' : 'Confirming...'}
                  </>
                ) : (
                  'Borrow'
                )}
              </Button>
            </div>
            {isConfirmed && hash && (
              <p className="text-green-600 mt-2 text-sm">
                ✅ Transaction confirmed! Hash: {hash.slice(0, 10)}...
              </p>
            )}
          </Card>
        )}

        {/* Repay Section */}
        {userDebt && userDebt > BigInt(0) && (
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Repay Debt
            </h2>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Amount in USDC"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleRepay}
                disabled={isPending || isConfirming || !repayAmount}
                className={`bg-blue-600 hover:bg-blue-700 ${
                  isPending || isConfirming || !repayAmount ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    {isPending ? 'Waiting...' : 'Confirming...'}
                  </>
                ) : (
                  'Repay'
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Active Loans */}
        {activeLoanIds && activeLoanIds.length > 0 && (
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Active Loans</h2>
            <div className="space-y-2">
              {activeLoanIds.map((loanId: bigint, index: number) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="font-mono">Loan #{loanId.toString()}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

