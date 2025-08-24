import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0xcb476b6b -> getActiveLoanIds()

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
    
    // Contract ABI for getActiveLoanIds function
    const contractAbi = [
      {
        "inputs": [],
        "name": "getActiveLoanIds",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Getting active loan IDs`);
    console.log(`Calling getActiveLoanIds with selector: 0xcb476b6b`);
    
    // Get active loan IDs using getActiveLoanIds() -> 0xcb476b6b
    const activeLoanIds = await contract.getActiveLoanIds();
    console.log(`Active loan IDs: ${activeLoanIds.toString()}`);
    
    res.json({ 
      success: true, 
      activeLoanIds: activeLoanIds.map(id => id.toString())
    });
  } catch (error) {
    console.error('Error getting active loan IDs:', error);
    res.status(500).json({ error: "Error al obtener IDs de préstamos activos", details: error.message });
  }
}
