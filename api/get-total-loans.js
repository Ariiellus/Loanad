import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0x833be5d5 -> getTotalLoans()

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
    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for getTotalLoans function
    const contractAbi = [
      {
        "inputs": [],
        "name": "getTotalLoans",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Getting total loans`);
    console.log(`Calling getTotalLoans with selector: 0x833be5d5`);
    
    // Get total loans using getTotalLoans() -> 0x833be5d5
    const totalLoans = await contract.getTotalLoans();
    console.log(`Total loans: ${totalLoans.toString()}`);
    
    res.json({ 
      success: true, 
      totalLoans: totalLoans.toString()
    });
  } catch (error) {
    console.error('Error getting total loans:', error);
    res.status(500).json({ error: "Error al obtener total de préstamos", details: error.message });
  }
}
