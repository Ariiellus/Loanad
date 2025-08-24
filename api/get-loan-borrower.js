import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0x3ef0a2f7 -> getLoanBorrower(uint256)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { loanId } = req.body;

    if (!loanId || isNaN(parseInt(loanId))) {
      return res.status(400).json({ error: "ID de préstamo inválido" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for getLoanBorrower function
    const contractAbi = [
      {
        "inputs": [{"name": "loanId", "type": "uint256"}],
        "name": "getLoanBorrower",
        "outputs": [{"name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Getting borrower for loan: ${loanId}`);
    console.log(`Calling getLoanBorrower with selector: 0x3ef0a2f7`);
    
    // Get loan borrower using getLoanBorrower(uint256) -> 0x3ef0a2f7
    const borrower = await contract.getLoanBorrower(loanId);
    console.log(`Borrower: ${borrower}`);
    
    res.json({ 
      success: true, 
      borrower: borrower
    });
  } catch (error) {
    console.error('Error getting loan borrower:', error);
    res.status(500).json({ error: "Error al obtener prestatario", details: error.message });
  }
}
