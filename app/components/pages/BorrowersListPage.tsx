'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, TrendingUp, ArrowLeft, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useLoanadContract, format } from '@/hooks/useContract';
import { Address } from 'viem';

interface LoanData {
  loanId: bigint;
  borrower: Address;
  collateral: bigint;
}

const BorrowersListPage = () => {
  const router = useRouter();
  const { isConnected } = useWalletConnection();
  
  const {
    useActiveLoanIds,
    useLoanBorrower,
    useLoanCollateral,
    addCollateral,
    withdrawCollateral,
    isPending,
    isConfirming,
    isConfirmed,
    hash
  } = useLoanadContract();

  // Fetch active loan IDs
  const { data: activeLoanIds, isLoading, refetch } = useActiveLoanIds();
  const [inputAmounts, setInputAmounts] = useState<{ [key: string]: string }>({});
  const [selectedLoanId, setSelectedLoanId] = useState<bigint | null>(null);

  const handleRefresh = () => {
    refetch();
  };

  const handleFundLoan = (loanId: bigint) => {
    const amount = inputAmounts[loanId.toString()];
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setSelectedLoanId(loanId);
    addCollateral(loanId, amount);
  };

  const handleWithdrawFunds = (loanId: bigint) => {
    const amount = inputAmounts[loanId.toString()];
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setSelectedLoanId(loanId);
    withdrawCollateral(amount, loanId);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.push('/pages/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0 cursor-pointer"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Borrowers List
              </h2>
              <h3 className="text-sm text-muted-foreground">
                Loading loans...
              </h3>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-monad-purple" />
          </div>
        </div>
      </div>
    );
  }

  // Show no loans state
  if (!activeLoanIds || activeLoanIds.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.push('/pages/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0 cursor-pointer"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Borrowers List
              </h2>
              <h3 className="text-sm text-muted-foreground">
                No active loans
              </h3>
            </div>
          </div>
          
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No loans available</h3>
            <p className="text-muted-foreground mb-4">
              Currently there are no active loan requests in the system.
            </p>
            <Button onClick={handleRefresh} className="bg-monad-purple hover:bg-monad-purple/90 cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => router.push('/pages/dashboard')}
              className="p-2 hover:bg-muted rounded-lg transition-colors mr-3 shrink-0 cursor-pointer"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-1 truncate">
                Borrowers List
              </h2>
              <h3 className="text-sm text-muted-foreground">
                {activeLoanIds.length} active loan{activeLoanIds.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="shrink-0 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {isConfirmed && hash && (
          <Card className="p-4 mb-4 bg-green-50 border-green-200">
            <p className="text-green-800 text-sm">
              ✅ Transaction confirmed! Hash: {hash.slice(0, 10)}...
            </p>
          </Card>
        )}
        
        {/* Loans list */}
        <div className="space-y-4">
          {activeLoanIds.map((loanId: bigint) => (
            <LoanCard 
              key={loanId.toString()}
              loanId={loanId}
              inputAmount={inputAmounts[loanId.toString()] || ''}
              onInputChange={(value) => setInputAmounts(prev => ({ ...prev, [loanId.toString()]: value }))}
              onFund={() => handleFundLoan(loanId)}
              onWithdraw={() => handleWithdrawFunds(loanId)}
              isPending={isPending && selectedLoanId === loanId}
              isConfirming={isConfirming && selectedLoanId === loanId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Separate component for each loan card
const LoanCard = ({ 
  loanId, 
  inputAmount, 
  onInputChange, 
  onFund, 
  onWithdraw,
  isPending,
  isConfirming
}: { 
  loanId: bigint;
  inputAmount: string;
  onInputChange: (value: string) => void;
  onFund: () => void;
  onWithdraw: () => void;
  isPending: boolean;
  isConfirming: boolean;
}) => {
  const { useLoanBorrower, useLoanCollateral } = useLoanadContract();
  const { data: borrower } = useLoanBorrower(loanId);
  const { data: collateral } = useLoanCollateral(loanId);

  if (!borrower) return null;

  const collateralAmount = collateral ? format(collateral) : '0';
  const fundingPercentage = collateral ? Math.min(100, parseFloat(collateralAmount) * 10) : 0;

  // Generate avatar based on address
  const generateAvatar = (address: string) => {
    const emojis = ['🚀', '💼', '📚', '🏠', '💰', '🎯', '🌟', '💡'];
    const index = parseInt(address.slice(2, 4), 16) % emojis.length;
    return emojis[index];
  };

  return (
    <Card className="p-4 bg-card shadow-sm rounded-xl border border-border/50 hover:shadow-md transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-monad-purple/20 to-monad-purple/40 rounded-xl flex items-center justify-center text-xl shrink-0">
              {generateAvatar(borrower)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-montserrat font-bold text-foreground text-lg truncate">
                {borrower.slice(0, 6)}...{borrower.slice(-4)}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                Loan #{loanId.toString()}
              </p>
            </div>
          </div>
          <div className="bg-monad-purple text-white rounded-full px-3 py-1 text-xs font-bold shrink-0">
            ID{loanId.toString()}
          </div>
        </div>
        
        {/* Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-monad-purple shrink-0" />
            <span className="text-sm font-medium">Collateral: {collateralAmount} MON</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle size={14} />
            <span className="text-xs font-medium">Verified</span>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Collateral Progress</span>
            <span className="font-medium text-foreground">{fundingPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={fundingPercentage} className="h-2" />
        </div>
        
        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-muted-foreground">
            Amount in MON
          </label>
          <Input 
            type="number"
            placeholder="0.0"
            step="0.01"
            min="0"
            className="h-9 text-sm"
            value={inputAmount}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isPending || isConfirming}
          />
        </div>
        
        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={onFund}
            className="bg-green-600 hover:bg-green-700 text-white font-montserrat font-bold cursor-pointer"
            disabled={!inputAmount || parseFloat(inputAmount) <= 0 || isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                {isPending ? 'Approve...' : 'Confirming...'}
              </>
            ) : (
              <>💰 Fund</>
            )}
          </Button>
          
          <Button 
            onClick={onWithdraw}
            className="bg-orange-600 hover:bg-orange-700 text-white font-montserrat font-bold cursor-pointer"
            disabled={!inputAmount || parseFloat(inputAmount) <= 0 || isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>💸 Withdraw</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BorrowersListPage;

