import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x6C92343713EE9e8449c14f98E30f02Ebe7C91CE7
// Function Selectors:
// - 0x753008b1 -> assignMaximumAmountForLoan(address)

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
    
    // Contract ABI for assignMaximumAmountForLoan function
    const contractAbi = [
      {
        "inputs": [{"name": "user", "type": "address"}],
        "name": "assignMaximumAmountForLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Target user: ${userAddress}`);
    console.log(`Owner calling from: ${signer.address}`);
    console.log(`Contract address: ${contract.address}`);

    // Step 1: Call assignMaximumAmountForLoan - this function already:
    // - Assigns 10 ETH to the user's maximum loan amount
    // - Calls verifyUser internally
    console.log(`\nCalling assignMaximumAmountForLoan with selector: 0x753008b1`);
    console.log(`This will assign 10 ETH and verify the user automatically`);

    const assignTx = await contract.assignMaximumAmountForLoan(userAddress);
    console.log(`Transaction sent: ${assignTx.hash}`);

    const assignReceipt = await assignTx.wait();
    console.log(`Transaction confirmed in block: ${assignReceipt.blockNumber}`);

    res.json({
      success: true,
      txHash: assignTx.hash,
      message: "10 ETH asignados y usuario verificado exitosamente",
      details: "La función assignMaximumAmountForLoan asignó 10 ETH y verificó al usuario automáticamente"
    });

  } catch (error) {
    console.error('Error in init-loan:', error);
    res.status(500).json({ 
      error: "Error al inicializar préstamo", 
      details: error.message 
    });
  }
}
