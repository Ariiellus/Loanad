import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0x6b9e1d93 -> s_debtorBorrowed(address)

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { userAddress } = req.query;

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Dirección de usuario inválida" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for s_debtorBorrowed function
    const contractAbi = [
      {
        "inputs": [{"name": "", "type": "address"}],
        "name": "s_debtorBorrowed",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Getting debt for user: ${userAddress}`);
    console.log(`Calling s_debtorBorrowed with selector: 0x6b9e1d93`);
    
    // Get user debt using s_debtorBorrowed(address)
    const userDebt = await contract.s_debtorBorrowed(userAddress);
    console.log(`User debt: ${userDebt.toString()} wei`);
    
    res.json({ 
      success: true, 
      userDebt: userDebt.toString(),
      userDebtEth: (parseFloat(userDebt.toString()) / 1e18).toFixed(4)
    });
  } catch (error) {
    console.error('Error getting user debt:', error);
    res.status(500).json({ error: "Error al obtener deuda del usuario", details: error.message });
  }
}
