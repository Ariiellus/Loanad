"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const BorrowerDetail2Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const borrower = null; // No state in Next.js

  // Data por defecto si no viene del state
  const defaultBorrower = {
    id: 1,
    name: 'Your loan',
    age: 28,
    amount: 15000,
    interestRate: 12,
    purpose: 'Expand my web development business',
    score: 750,
    fundedPercentage: 45,
    avatar: '🚀',
    income: 8000,
    expenses: 4500,
    description: 'I need capital to expand my web development agency. With this investment I can hire more developers and take on larger projects.'
  };

  const data = borrower || defaultBorrower;

  return (
    <div className="min-h-screen bg-background px-4 py-8 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-card rounded-xl shadow-lg border border-border/50">
          {/* Botón de regresar en el lado izquierdo */}
          <div className="flex justify-start mb-4">
            <button 
              onClick={() => router.push('/pages/dashboard')}
              className="text-foreground hover:text-monad-purple transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          
          {/* Header with avatar and basic data */}
          <div className="text-center space-y-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-monad-purple/30 to-monad-purple/60 rounded-2xl flex items-center justify-center text-4xl mx-auto">
              {data.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-montserrat font-bold text-foreground">
                {data.name}
              </h2>
              <p className="text-muted-foreground">
                Your loan status
              </p>
            </div>
          </div>

          {/* Loan Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-bold text-lg text-foreground">
                  ${data.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Rate</p>
                <p className="font-bold text-lg text-monad-purple">
                  {data.interestRate}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-montserrat font-bold text-foreground mb-2">
                Loan description
              </h3>
              <p className="text-muted-foreground text-sm">
                {data.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="font-bold text-foreground">
                  ${data.income.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="font-bold text-foreground">
                  ${data.expenses.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="text-monad-purple" size={20} />
              <span className="font-bold text-foreground">
                Credit Score: {data.score}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Loan progress</span>
                <span className="font-medium">{data.fundedPercentage}% funded</span>
              </div>
              <Progress value={data.fundedPercentage} className="h-3" />
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="h-9 px-4 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                💰 Pay
              </button>
              <button className="h-9 px-4 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                💸 Withdraw
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BorrowerDetail2Page;