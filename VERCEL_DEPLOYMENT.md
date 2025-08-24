# 🚀 Vercel Deployment Guide

## 📋 **Prerequisites**
- [Vercel CLI](https://vercel.com/cli) installed
- [Node.js](https://nodejs.org/) 18+ installed
- Vercel account

## 🔧 **Setup Steps**

### **1. Install Vercel CLI**
```bash
npm i -g vercel
```

### **2. Login to Vercel**
```bash
vercel login
```

### **3. Set Environment Variables**
```bash
# Set RPC URL
vercel env add RPC_URL
# Value: https://testnet-rpc.monad.xyz

# Set Contract Address
vercel env add CONTRACT_ADDRESS
# Value: 0x2072d7D9E54cea8998eA6D5C39CB07766e48B314

# Set Private Key (OWNER ONLY)
vercel env add PRIVATE_KEY
# Value: your_actual_private_key
```

### **4. Deploy to Vercel**
```bash
vercel --prod
```

## 🌐 **API Endpoints Available**

### **Authentication & Verification**
- `POST /api/check-verification` - Check user verification status
- `POST /api/init-loan` - Initialize loan for user

### **Loan Management**
- `POST /api/borrow-mon` - Borrow MON tokens
- `POST /api/repay-mon` - Repay MON debt
- `GET /api/get-user-debt/:userAddress` - Get user debt

### **Loan Data**
- `GET /api/get-total-loans` - Get total number of loans
- `GET /api/get-active-loan-ids` - Get active loan IDs
- `POST /api/get-max-amount` - Get maximum loan amount for user
- `POST /api/get-loan-borrower` - Get borrower for specific loan
- `POST /api/get-loan-collateral` - Get collateral for specific loan

### **Collateral Management**
- `POST /api/add-collateral` - Add collateral to loan
- `POST /api/withdraw-collateral` - Withdraw collateral from loan

## 🔐 **Environment Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `RPC_URL` | Monad Testnet RPC endpoint | `https://testnet-rpc.monad.xyz` |
| `CONTRACT_ADDRESS` | Smart contract address | `0x2072d7D9E54cea8998eA6D5C39CB07766e48B314` |
| `PRIVATE_KEY` | Owner's private key for contract calls | `0x...` |

## 📱 **Frontend Integration**

### **Update API URLs**
Replace all `https://loanadback.vercel.app/` with your Vercel domain:

```typescript
// Before (Local)
const response = await fetch('https://loanadback.vercel.app//api/check-verification', {
  // ...
});

// After (Vercel)
const response = await fetch('https://your-app.vercel.app/api/check-verification', {
  // ...
});
```

### **CORS Configuration**
All API endpoints include CORS headers for cross-origin requests.

## 🚨 **Security Notes**

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Restrict access** to owner-only functions
4. **Monitor logs** for suspicious activity

## 🔍 **Troubleshooting**

### **Common Issues**
- **Environment variables not set**: Use `vercel env ls` to check
- **CORS errors**: Verify CORS headers in API functions
- **Contract calls failing**: Check RPC URL and contract address

### **Debug Commands**
```bash
# List environment variables
vercel env ls

# View deployment logs
vercel logs

# Redeploy with latest changes
vercel --prod
```

## 📚 **Additional Resources**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Ethers.js Documentation](https://docs.ethers.org/)
