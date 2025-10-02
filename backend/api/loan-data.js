import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x6C92343713EE9e8449c14f98E30f02Ebe7C91CE7

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for multiple functions
    const contractAbi = [
      {
        "inputs": [],
        "name": "getTotalLoans",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getActiveLoanIds",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getMaximumAmountForLoan",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "loanId", "type": "uint256"}],
        "name": "getLoanBorrower",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "loanId", "type": "uint256"}],
        "name": "getLoanCollateral",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "", "type": "address"}],
        "name": "s_debtorBorrowed",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    if (req.method === 'GET') {
      const { action, userAddress, loanId } = req.query;

      switch (action) {
        case 'total-loans':
          const totalLoans = await contract.getTotalLoans();
          res.json({ success: true, totalLoans: totalLoans.toString() });
          break;

        case 'active-loan-ids':
          const activeLoanIds = await contract.getActiveLoanIds();
          res.json({ 
            success: true, 
            activeLoanIds: activeLoanIds.map(id => id.toString())
          });
          break;

        case 'user-debt':
          if (!userAddress) {
            return res.status(400).json({ error: "Dirección de usuario requerida" });
          }
          const userDebt = await contract.s_debtorBorrowed(userAddress);
          res.json({ 
            success: true, 
            userDebt: userDebt.toString(),
            userDebtEth: (parseFloat(userDebt.toString()) / 1e18).toFixed(4)
          });
          break;

        default:
          res.status(400).json({ error: "Acción no válida" });
      }
    } else if (req.method === 'POST') {
      const { action, userAddress, loanId } = req.body;

      switch (action) {
        case 'max-amount':
          if (!userAddress) {
            return res.status(400).json({ error: "Dirección de usuario requerida" });
          }
          const maxAmount = await contract.getMaximumAmountForLoan(userAddress);
          res.json({ success: true, maxAmount: maxAmount.toString() });
          break;

        case 'loan-borrower':
          if (!loanId) {
            return res.status(400).json({ error: "ID de préstamo requerido" });
          }
          const borrower = await contract.getLoanBorrower(loanId);
          res.json({ success: true, borrower: borrower });
          break;

        case 'loan-collateral':
          if (!loanId) {
            return res.status(400).json({ error: "ID de préstamo requerido" });
          }
          const collateral = await contract.getLoanCollateral(loanId);
          res.json({ success: true, collateral: collateral.toString() });
          break;

        default:
          res.status(400).json({ error: "Acción no válida" });
      }
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error in loan-data:', error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
}
