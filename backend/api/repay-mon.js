import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x6C92343713EE9e8449c14f98E30f02Ebe7C91CE7
// Function Selectors:
// - 0x3d263c33 -> repayMON()

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
    const { userAddress, amount } = req.body;

    if (!ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "Dirección de usuario inválida" });
    }

    if (!amount || isNaN(parseInt(amount))) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for repayMON function
    const contractAbi = [
      {
        "inputs": [],
        "name": "repayMON",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Repaying MON for user: ${userAddress}`);
    console.log(`Amount: ${amount} wei`);
    console.log(`Calling repayMON with selector: 0x3d263c33`);
    console.log(`Contract address: ${contract.address}`);
    console.log(`Signer address: ${signer.address}`);
    
    // Call repayMON with msg.value (the amount is sent as ETH)
    const repayTx = await contract.repayMON({ value: amount });
    console.log(`Repay transaction sent: ${repayTx.hash}`);
    
    const repayReceipt = await repayTx.wait();
    console.log(`Repay transaction confirmed in block: ${repayReceipt.blockNumber}`);
    
    res.json({ 
      success: true, 
      txHash: repayTx.hash,
      message: "MON pagado exitosamente"
    });
  } catch (error) {
    console.error('Error repaying MON:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      reason: error.reason,
      stack: error.stack
    });
    res.status(500).json({ error: "Error al pagar MON", details: error.message });
  }
}
