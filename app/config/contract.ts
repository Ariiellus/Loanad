export const CONTRACT_ADDRESS = "0x6C92343713EE9e8449c14f98E30f02Ebe7C91CE7";

export const CONTRACT_ABI = [
  {
    "type": "function",
    "name": "getVerifiedUser",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaximumAmountForLoan",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "s_debtorBorrowed",
    "inputs": [{ "name": "", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalLoans",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveLoanIds",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLoanBorrower",
    "inputs": [{ "name": "loanId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getLoanCollateral",
    "inputs": [{ "name": "loanId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "assignMaximumAmountForLoan",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "borrow",
    "inputs": [{ "name": "borrowAmount", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "repay",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "addCollateralForCrowfundedLoan",
    "inputs": [{ "name": "crowfundedLoanId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdrawForCrowfundedLoan",
    "inputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "loanId", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createLoanRequest",
    "inputs": [{ "name": "amountToBorrow", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable"
  }
] as const;

