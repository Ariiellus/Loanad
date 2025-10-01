import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314
// Function Selectors:
// - 0x2645b1db -> borrowMON(uint256)

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
    const { amount } = req.body;

    if (!amount || isNaN(parseInt(amount))) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for borrowMON function
    const contractAbi = [
      {
        "inputs": [{"name": "amount", "type": "uint256"}],
        "name": "borrowMON",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Borrowing MON amount: ${amount} wei`);
    console.log(`Calling borrowMON with selector: 0x2645b1db`);
    
    // Call borrowMON(uint256) with the specified amount
    const borrowTx = await contract.borrowMON(amount);
    console.log(`Borrow transaction sent: ${borrowTx.hash}`);
    
    const borrowReceipt = await borrowTx.wait();
    console.log(`Borrow transaction confirmed in block: ${borrowReceipt.blockNumber}`);
    
    res.json({ 
      success: true, 
      txHash: borrowTx.hash,
      message: "MON pedido prestado exitosamente"
    });
  } catch (error) {
    console.error('Error borrowing MON:', error);
    res.status(500).json({ error: "Error al pedir prestado", details: error.message });
  }
}
