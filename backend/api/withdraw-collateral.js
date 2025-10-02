import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x6C92343713EE9e8449c14f98E30f02Ebe7C91CE7
// Function Selectors:
// - 0x1e7b5766 -> withdrawForCrowfundedLoan(uint256,uint256)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { amount, loanId } = req.body;

    if (!amount || isNaN(parseInt(amount))) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    if (!loanId || isNaN(parseInt(loanId))) {
      return res.status(400).json({ error: "ID de préstamo inválido" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for withdrawForCrowfundedLoan function
    const contractAbi = [
      {
        "inputs": [
          {"name": "amount", "type": "uint256"},
          {"name": "loanId", "type": "uint256"}
        ],
        "name": "withdrawForCrowfundedLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Withdrawing collateral for loan: ${loanId}`);
    console.log(`Amount: ${amount} wei`);
    console.log(`Calling withdrawForCrowfundedLoan with selector: 0x1e7b5766`);
    
    // Function selector: 0x1e7b5766 -> withdrawForCrowfundedLoan(uint256,uint256)
    // First argument: amount, Second argument: loanId
    const withdrawTx = await contract.withdrawForCrowfundedLoan(amount, loanId);
    console.log(`Withdraw transaction sent: ${withdrawTx.hash}`);
    
    const withdrawReceipt = await withdrawTx.wait();
    console.log(`Withdraw transaction confirmed in block: ${withdrawReceipt.blockNumber}`);
    
    res.json({ 
      success: true, 
      txHash: withdrawTx.hash,
      message: "Colateral retirado exitosamente"
    });
  } catch (error) {
    console.error('Error withdrawing collateral:', error);
    res.status(500).json({ error: "Error al retirar colateral", details: error.message });
  }
}
