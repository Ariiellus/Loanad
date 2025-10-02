'use client';

import { Home, TrendingUp, HandCoins } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Hide on public routes and user flow pages
  const hideBottomNavRoutes = [
    '/', // Landing page
    '/verification', // Verification page
    '/loan-form', // Loan form
    '/confirmations' // Confirmations
  ];
  
  if (pathname && hideBottomNavRoutes.includes(pathname)) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-md mx-auto flex justify-around items-center py-3">
        <button 
          onClick={() => router.push('/pages/borrowers-list')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive('/pages/borrowers-list') 
              ? 'text-monad-purple' 
              : 'text-muted-foreground hover:text-monad-purple'
          }`}
        >
          <TrendingUp size={24} />
          <span className="text-xs font-montserrat font-bold">Invest</span>
        </button>
        
        <button 
          onClick={() => router.push('/pages/dashboard')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive('/pages/dashboard') 
              ? 'text-monad-purple' 
              : 'text-muted-foreground hover:text-monad-purple'
          }`}
        >
          <Home size={28} />
          <span className="text-xs font-montserrat font-bold">Home</span>
        </button>
        
        <button 
          onClick={() => router.push('/pages/loan-form')}
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
            isActive('/pages/loan-form') 
              ? 'text-monad-purple' 
              : 'text-muted-foreground hover:text-monad-purple'
          }`}
        >
          <HandCoins size={24} />
          <span className="text-xs font-montserrat font-bold">Borrow</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;