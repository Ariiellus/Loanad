'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { WalletConnection } from '@/components/Providers';
import { useLoanadContract } from '@/hooks/useContract';
import { Address } from 'viem';

const VerificationPageContent = () => {
  const router = useRouter();
  const { isConnected, address } = useWalletConnection();
  const { 
    useIsVerified, 
    assignMaxLoan, 
    isPending, 
    isConfirming, 
    isConfirmed,
    error 
  } = useLoanadContract();
  const { data: isVerified, refetch } = useIsVerified(address as Address);
  
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if verification has already been completed
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        // Check if user is connected
        if (!isConnected || !address) {
          console.log('User not connected');
          setIsLoading(false);
          return;
        }

        console.log('User connected:', address);
        
        // Check localStorage for existing verification
        const storedVerification = localStorage.getItem('loanad-verification');
        console.log('Checking verification status:', storedVerification);
        
        if (storedVerification) {
          const verification = JSON.parse(storedVerification);
          console.log('Parsed verification data:', verification);
          
          if (verification.documentUploaded && verification.kycCompleted) {
            console.log('Verification complete, but waiting for user to click continue');
            // Don't redirect automatically - let user click continue
            setDocumentUploaded(true);
            setKycCompleted(true);
          } else {
            console.log('Partial verification, restoring state');
            // Partial verification, restore state
            setDocumentUploaded(verification.documentUploaded || false);
            setKycCompleted(verification.kycCompleted || false);
          }
        } else {
          console.log('No verification data found');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, [router, isConnected, address]);

  const handleDocumentUpload = () => {
    setDocumentUploaded(true);
    // Save to localStorage
    localStorage.setItem('loanad-verification', JSON.stringify({
      documentUploaded: true,
      kycCompleted
    }));
  };

  const handleKycComplete = () => {
    setKycCompleted(true);
    // Save to localStorage
    localStorage.setItem('loanad-verification', JSON.stringify({
      documentUploaded,
      kycCompleted: true
    }));
  };

  // Watch for successful transaction
  useEffect(() => {
    if (isConfirmed) {
      setMessage({ 
        type: 'success', 
        text: 'Verification completed! You have been assigned 10 MON. Redirecting...'
      });
      
      // Refetch verification status
      refetch();
      
      // Save to localStorage
      localStorage.setItem('loanad-verification', JSON.stringify({
        documentUploaded: true,
        kycCompleted: true,
        verifiedAt: new Date().toISOString()
      }));
      
      setTimeout(() => {
        router.push('/pages/dashboard');
      }, 2000);
    }
  }, [isConfirmed, refetch, router]);

  // Watch for errors
  useEffect(() => {
    if (error) {
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message}. Note: Only the contract owner can verify users.`
      });
    }
  }, [error]);

  const handleContinue = () => {
    console.log('VerificationPage - handleContinue called');
    console.log('VerificationPage - isConnected:', isConnected);
    console.log('VerificationPage - address:', address);
    console.log('VerificationPage - isVerified:', isVerified);
    
    if (!isConnected || !address) {
      console.error('No wallet connected');
      setMessage({ type: 'error', text: 'No wallet connected' });
      return;
    }

    // Check if user is verified on-chain
    if (isVerified) {
      // Already verified, just proceed
      console.log('VerificationPage - User already verified, redirecting...');
      setMessage({ 
        type: 'success', 
        text: 'Already verified! Redirecting to dashboard...'
      });
      
      localStorage.setItem('loanad-verification', JSON.stringify({
        documentUploaded: true,
        kycCompleted: true,
        verifiedAt: new Date().toISOString()
      }));
      
      setTimeout(() => {
        router.push('/pages/dashboard');
      }, 1500);
    } else {
      // Not verified - call assignMaximumAmountForLoan
      console.log('VerificationPage - User NOT verified, calling assignMaxLoan...');
      console.log('VerificationPage - Calling assignMaxLoan with address:', address);
      
      setMessage({ 
        type: 'success', 
        text: 'Calling verification contract... Please confirm in your wallet.'
      });
      
      assignMaxLoan(address as Address);
      console.log('VerificationPage - assignMaxLoan called!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-monad-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-8 pb-24">
      <div className="max-w-md mx-auto">
        <Card className="p-6 space-y-6 bg-card rounded-xl shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-montserrat font-bold text-foreground">
              Verification
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We need these documents to verify your identity and ability to pay. 
              This helps us offer you the best conditions and protect both your information 
              and our investors.
            </p>
          </div>
          
          {/* Wallet Connection Status */}
          <WalletConnection />
          
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              onClick={handleDocumentUpload}
              className={`w-full rounded-lg py-6 transition-all duration-300 font-montserrat font-bold cursor-pointer ${
                documentUploaded 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
              }`}
            >
              <Paperclip className="mr-2" size={20} />
              {documentUploaded ? "Document uploaded" : "Income proof"}
            </Button>

            <Button 
              onClick={handleKycComplete}
              className={`w-full rounded-lg py-6 transition-all duration-300 font-montserrat font-bold cursor-pointer ${
                kycCompleted 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
              }`}
            >
              <User className="mr-2" size={20} />
              {kycCompleted ? "KYC completed" : "Complete KYC"}
            </Button>

            <Button 
              onClick={handleContinue}
              disabled={!documentUploaded || !kycCompleted || isPending || isConfirming}
              className={`w-full font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300 mt-6 ${
                documentUploaded && kycCompleted && !isPending && !isConfirming
                  ? 'bg-monad-purple hover:bg-monad-purple/90 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                  Waiting for approval...
                </>
              ) : isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                  Confirming transaction...
                </>
              ) : isVerified ? (
                'Continue to Dashboard'
              ) : (
                'Verify & Get 10 MON'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const VerificationPage = () => {
  return <VerificationPageContent />;
};

export default VerificationPage;