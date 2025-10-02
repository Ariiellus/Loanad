// API Configuration
const API_BASE_URL = 'https://loanadback.vercel.app';

// Common fetch configuration with CORS handling
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'omit', // Don't send cookies for cross-origin
    ...options
  };

  try {
    console.log(`🌐 API Call: ${defaultOptions.method} ${url}`);
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Response:`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error for ${url}:`, error);
    throw error;
  }
};

// Specific API functions
export const checkVerification = async (userAddress) => {
  return apiFetch('/api/check-verification', {
    method: 'POST',
    body: JSON.stringify({ userAddress })
  });
};

export const initLoan = async (userAddress) => {
  return apiFetch('/api/init-loan', {
    method: 'POST',
    body: JSON.stringify({ userAddress })
  });
};

export const borrowMon = async (amount) => {
  return apiFetch('/api/borrow-mon', {
    method: 'POST',
    body: JSON.stringify({ amount })
  });
};

export const repayMon = async (userAddress, amount) => {
  return apiFetch('/api/repay-mon', {
    method: 'POST',
    body: JSON.stringify({ userAddress, amount })
  });
};

export const getUserDebt = async (userAddress) => {
  return apiFetch(`/api/loan-data?action=user-debt&userAddress=${userAddress}`, {
    method: 'GET'
  });
};

export const getTotalLoans = async () => {
  return apiFetch('/api/loan-data?action=total-loans', {
    method: 'GET'
  });
};

export const getActiveLoanIds = async () => {
  return apiFetch('/api/loan-data?action=active-loan-ids', {
    method: 'GET'
  });
};

export const getMaxAmount = async (userAddress) => {
  return apiFetch('/api/loan-data', {
    method: 'POST',
    body: JSON.stringify({ action: 'max-amount', userAddress })
  });
};

export const getLoanBorrower = async (loanId) => {
  return apiFetch('/api/loan-data', {
    method: 'POST',
    body: JSON.stringify({ action: 'loan-borrower', loanId })
  });
};

export const getLoanCollateral = async (loanId) => {
  return apiFetch('/api/loan-data', {
    method: 'POST',
    body: JSON.stringify({ action: 'loan-collateral', loanId })
  });
};

export const addCollateral = async (loanId, amount) => {
  return apiFetch('/api/add-collateral', {
    method: 'POST',
    body: JSON.stringify({ loanId, amount })
  });
};

export const withdrawCollateral = async (amount, loanId) => {
  return apiFetch('/api/withdraw-collateral', {
    method: 'POST',
    body: JSON.stringify({ amount, loanId })
  });
};
