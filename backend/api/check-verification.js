import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0xd117fc99 -> getVerifiedUser(address)

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
    const { userAddress } = req.body;

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Dirección de usuario inválida" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for getVerifiedUser function
    const contractAbi = [
      {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "getVerifiedUser",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Checking verification for user: ${userAddress}`);
    console.log(`Calling getVerifiedUser with selector: 0xd117fc99`);
    
    // Call getVerifiedUser(address) -> 0xd117fc99
    const isVerified = await contract.getVerifiedUser(userAddress);
    console.log(`User verification status: ${isVerified}`);
    
    res.json({ 
      success: true, 
      isVerified: isVerified
    });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({ error: "Error al verificar usuario", details: error.message });
  }
}
