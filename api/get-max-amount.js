import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0xe3fede90 -> getMaximumAmountForLoan(address)

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
    const { userAddress } = req.body;

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Dirección de usuario inválida" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for getMaximumAmountForLoan function
    const contractAbi = [
      {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getMaximumAmountForLoan",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Getting max amount for user: ${userAddress}`);
    console.log(`Calling getMaximumAmountForLoan with selector: 0xe3fede90`);
    
    // Get maximum amount for loan using getMaximumAmountForLoan(address) -> 0xe3fede90
    const maxAmount = await contract.getMaximumAmountForLoan(userAddress);
    console.log(`Max amount: ${maxAmount.toString()} wei`);
    
    res.json({ 
      success: true, 
      maxAmount: maxAmount.toString()
    });
  } catch (error) {
    console.error('Error getting max amount:', error);
    res.status(500).json({ error: "Error al obtener monto máximo", details: error.message });
  }
}
