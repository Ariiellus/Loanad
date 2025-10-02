'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WalletConnection } from '@/components/WalletConnection';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useEffect } from 'react';
import { useLoanadContract } from '@/hooks/useContract';
import { Address } from 'viem';

const LandingPageContent = () => {
  const router = useRouter();
  const { 
    isConnected, 
    address, 
    connectionType, 
    provider, 
    refreshConnection 
  } = useWalletConnection();

  const { useIsVerified } = useLoanadContract();
  const { data: isVerified, isLoading: checkingVerification } = useIsVerified(address as Address);

  // Log connection changes
  useEffect(() => {
    console.log('Wallet connection state changed:', { 
      isConnected, 
      address, 
      connectionType, 
      provider 
    });
  }, [isConnected, address, connectionType, provider]);

  const handleContinue = () => {
    if (!isConnected || !address) {
      console.error('No wallet connected');
      return;
    }

    console.log('LandingPage - Verification status:', isVerified);
    
    if (isVerified) {
      console.log('LandingPage - User verified, going to dashboard');
      router.push('/pages/dashboard');
    } else {
      console.log('LandingPage - User not verified, going to verification page');
      router.push('/pages/verification');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between px-4 py-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md w-full space-y-8">
          <div className="space-y-4">
            <img 
              src="/loanad-logo.png" 
              alt="LOANAD Logo" 
              className="w-24 h-24 mx-auto mb-2"
            />
            <h1 className="text-6xl font-montserrat font-bold text-foreground">
              LOANAD
            </h1>
            <p className="text-1.5xl font-montserrat font-bold text-foreground">
              Get a better loan
            </p>
          </div>

          
          <div className="flex flex-col items-center space-y-4">
            {isConnected && (
              <>
                {/* Wallet Display */}
                <div className="border border-monad-purple rounded-lg p-3 bg-card/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-monad-purple rounded-full animate-pulse"></div>
                    <span className="text-sm text-foreground font-mono">
                      {address ? `0x${address.slice(2, 6)}...${address.slice(-4)}` : 'Connecting...'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleContinue}
                  disabled={checkingVerification}
                  className={`w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300 ${
                    checkingVerification ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {checkingVerification ? 'Checking...' : 'Continue'}
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </>
            )}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <WalletConnection />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-light text-muted-foreground">
          Powered by Kairos Research
        </p>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return <LandingPageContent />;
};

export default LandingPage;