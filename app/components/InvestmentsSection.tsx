import InvestmentCard from './InvestmentCard';

interface Investment {
  id: string;
  borrowerName: string;
  amount: number;
  expectedReturn: number;
}

interface InvestmentsSectionProps {
  totalInvested: number;
  averageReturn: number;
  investments: Investment[];
}

const InvestmentsSection = ({ totalInvested, averageReturn, investments }: InvestmentsSectionProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-2">Investments</h2>
      <h3 className="text-sm text-muted-text mb-6">Loans you have granted</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Total amount invested</p>
          <p className="text-2xl font-bold text-monad-purple">
            ${totalInvested.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Average return rate</p>
          <p className="text-2xl font-bold text-foreground">
            {averageReturn}%
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-foreground mb-3">Active loans</h4>
        {investments.map((investment) => (
          <InvestmentCard
            key={investment.id}
            borrowerName={investment.borrowerName}
            amount={investment.amount}
            expectedReturn={investment.expectedReturn}
          />
        ))}
      </div>
    </div>
  );
};

export default InvestmentsSection;