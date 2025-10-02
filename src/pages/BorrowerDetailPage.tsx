"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, TrendingUp, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const BorrowerDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const borrower = null; // No state in Next.js
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Data por defecto si no viene del state
  const defaultBorrower = {
    id: 1,
    name: 'Molandaki.nad',
    age: 28,
    amount: 15000,
    interestRate: 12,
    purpose: 'Expandir mi negocio de desarrollo web',
    score: 750,
    fundedPercentage: 45,
    avatar: '🚀',
    income: 8000,
    expenses: 4500,
    description: 'Necesito capital para expandir mi agencia de desarrollo web. Con esta inversión podré contratar más desarrolladores y tomar proyectos más grandes.'
  };

  const data = {
    ...defaultBorrower,
    ...(borrower || {})
  };

  const handleSuggestedAmount = (amount: number) => {
    setInvestmentAmount(amount.toString());
  };

  const handleConfirmInvestment = () => {
    router.push('/investment-approved');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6 bg-card rounded-xl shadow-lg border border-border/50">
          {/* Botón X en el lado derecho */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => router.push('/borrowers-list')}
              className="text-foreground hover:text-monad-purple transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {/* Header con avatar y datos básicos */}
          <div className="text-center space-y-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-monad-purple/30 to-monad-purple/60 rounded-2xl flex items-center justify-center text-4xl mx-auto">
              {data.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-montserrat font-bold text-foreground">
                {data.name}
              </h2>
              <p className="text-muted-foreground">
                {data.age} años
              </p>
            </div>
          </div>

          {/* Información del préstamo */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Monto</p>
                <p className="font-bold text-lg text-foreground">
                  ${data.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Tasa</p>
                <p className="font-bold text-lg text-monad-purple">
                  {data.interestRate}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-montserrat font-bold text-foreground mb-2">
                Descripción del préstamo
              </h3>
              <p className="text-muted-foreground text-sm">
                {data.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="font-bold text-foreground">
                  ${data.income.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Egresos</p>
                <p className="font-bold text-foreground">
                  ${data.expenses.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="text-monad-purple" size={20} />
              <span className="font-bold text-foreground">
                Score crediticio: {data.score}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso del préstamo</span>
                <span className="font-medium">{data.fundedPercentage}% fondeado</span>
              </div>
              <Progress value={data.fundedPercentage} className="h-3" />
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button className="h-9 px-4 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                🔄 Reinvertir
              </button>
              <button className="h-9 px-4 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                💰 Reclamar
              </button>
            </div>
          </div>
        </Card>

        {/* Sección de inversión */}
        <Card className="p-6 bg-card rounded-xl shadow-sm">
          <h3 className="text-xl font-montserrat font-bold text-foreground mb-4">
            Tu inversión
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monto a invertir en USDC
              </label>
              <Input 
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="500"
                className="rounded-lg text-lg"
              />
            </div>

            <div className="flex gap-2">
              {[100, 200, 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleSuggestedAmount(amount)}
                  className="flex-1 rounded-lg"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {investmentAmount && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  Ganancia anual estimada: <span className="font-bold">
                    ${(parseFloat(investmentAmount) * data.interestRate / 100).toFixed(2)}
                  </span>
                </p>
              </div>
            )}

            <Button 
              onClick={handleConfirmInvestment}
              disabled={!investmentAmount}
              className="w-full bg-monad-purple hover:bg-monad-purple/90 text-white font-montserrat font-bold py-6 rounded-xl text-lg transition-all duration-300"
            >
              Confirmar inversión
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BorrowerDetailPage;