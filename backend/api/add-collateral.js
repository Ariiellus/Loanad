import { ethers } from 'ethers';

// Smart Contract: LoanadLendingMarket
// Address: 0x6C92343713EE9e8449c14f98E30f02Ebe7C91CE7
// Function Selectors:
// - 0x5886cb68 -> addCollateralForCrowfundedLoan(uint256)

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
    const { loanId, amount } = req.body;

    if (!loanId || isNaN(parseInt(loanId))) {
      return res.status(400).json({ error: "ID de préstamo inválido" });
    }

    if (!amount || isNaN(parseInt(amount))) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Contract ABI for addCollateralForCrowfundedLoan function
    const contractAbi = [
      {
        "inputs": [{"name": "loanId", "type": "uint256"}],
        "name": "addCollateralForCrowfundedLoan",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, signer);

    console.log(`Adding collateral for loan: ${loanId}`);
    console.log(`Amount: ${amount} wei`);
    console.log(`Calling addCollateralForCrowfundedLoan with selector: 0x5886cb68`);
    
    // Function selector: 0x5886cb68 -> addCollateralForCrowfundedLoan(uint256)
    // The amount parameter is now a direct ETH amount (no multiplier), passed as msg.value
    const addCollateralTx = await contract.addCollateralForCrowfundedLoan(loanId, { value: amount });
    console.log(`Add collateral transaction sent: ${addCollateralTx.hash}`);
    
    const addCollateralReceipt = await addCollateralTx.wait();
    console.log(`Add collateral transaction confirmed in block: ${addCollateralReceipt.blockNumber}`);
    
    res.json({ 
      success: true, 
      txHash: addCollateralTx.hash,
      message: "Colateral agregado exitosamente"
    });
  } catch (error) {
    console.error('Error adding collateral:', error);
    res.status(500).json({ error: "Error al agregar colateral", details: error.message });
  }
}
