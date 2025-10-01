# LOANAD Backend

Backend API for the LOANAD lending platform built with Express.js and deployed on Vercel.

## CORS Configuration

This backend is configured to handle CORS (Cross-Origin Resource Sharing) properly for the following origins:

- `https://loanad.vercel.app` (Production frontend)
- `https://loanad-*.vercel.app` (Vercel preview deployments)
- `http://localhost:3000` (Local development)
- `http://localhost:8080` (Local development)

## API Endpoints

### Test Endpoint
- `GET /api/test-cors` - Test CORS configuration

### Core Endpoints
- `POST /api/check-verification` - Check if user is verified
- `POST /api/init-loan` - Initialize loan for new user
- `POST /api/get-max-amount` - Get maximum loan amount
- `GET /api/get-total-loans` - Get total loans
- `GET /api/get-active-loan-ids` - Get active loan IDs
- `POST /api/get-loan-borrower` - Get loan borrower
- `POST /api/get-loan-collateral` - Get loan collateral
- `POST /api/add-collateral` - Add collateral to loan
- `POST /api/withdraw-collateral` - Withdraw collateral from loan
- `POST /api/borrow-mon` - Borrow MON tokens
- `GET /api/get-user-debt/:userAddress` - Get user debt
- `POST /api/repay-mon` - Repay MON tokens

## Deployment

### Prerequisites
- Node.js 18+
- Vercel CLI

### Local Development
```bash
npm install
npm run dev
```

### Deploy to Vercel
```bash
./deploy.sh
```

Or manually:
```bash
vercel --prod
```

## Environment Variables

Create a `.env` file with:
```
RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_private_key
```

## CORS Troubleshooting

If you encounter CORS issues:

1. Check that the frontend origin is in the allowed origins list
2. Verify the `vercel.json` configuration
3. Test with the `/api/test-cors` endpoint
4. Check browser console for CORS error details

## Smart Contract Integration

This backend integrates with the LoanadLendingMarket smart contract at address `0x2072d7D9E54cea8998eA6D5C39CB07766e48B314`.
