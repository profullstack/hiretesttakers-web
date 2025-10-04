/**
 * CryptAPI Service
 * 
 * Handles cryptocurrency payment address generation with automatic commission splitting.
 * Uses CryptAPI.io for payment processing.
 * 
 * Supported cryptocurrencies: BTC, ETH, DOGE, SOL
 * Commission: 3% to platform, 97% to test taker
 */

import { calculateCommission, validateCryptocurrency } from '../utils/commission.js';

const SUPPORTED_COINS = ['BTC', 'ETH', 'DOGE', 'SOL'];
const CRYPTAPI_BASE_URL = 'https://api.cryptapi.io';

/**
 * Get list of supported cryptocurrencies
 * 
 * @returns {string[]} Array of supported coin codes
 */
export function getSupportedCoins() {
  return [...SUPPORTED_COINS];
}

/**
 * Calculate payment amounts with commission split
 * 
 * @param {number} amount - Total payment amount
 * @param {string} cryptocurrency - Cryptocurrency code (BTC, ETH, DOGE, SOL)
 * @returns {Object} Payment breakdown
 * @throws {Error} If amount is invalid or cryptocurrency unsupported
 */
export function calculatePaymentAmounts(amount, cryptocurrency) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  if (!validateCryptocurrency(cryptocurrency)) {
    throw new Error(`Unsupported cryptocurrency: ${cryptocurrency}`);
  }
  
  const commission = calculateCommission(amount);
  
  return {
    totalAmount: commission.totalAmount,
    commissionAmount: commission.commissionAmount,
    testTakerAmount: commission.testTakerAmount,
    cryptocurrency: cryptocurrency.toUpperCase()
  };
}

/**
 * Create payment address with automatic commission forwarding
 * 
 * @param {Object} params - Payment parameters
 * @param {string} params.cryptocurrency - Cryptocurrency code
 * @param {number} params.amount - Total payment amount
 * @param {string} params.testTakerWallet - Test taker's wallet address
 * @param {string} params.platformWallet - Platform's wallet address
 * @param {string} params.callbackUrl - Webhook callback URL
 * @returns {Promise<Object>} Payment address details
 * @throws {Error} If parameters are invalid
 */
export async function createPaymentAddress(params) {
  const {
    cryptocurrency,
    amount,
    testTakerWallet,
    platformWallet,
    callbackUrl
  } = params;
  
  // Validate required parameters
  if (!cryptocurrency) {
    throw new Error('Cryptocurrency is required');
  }
  
  if (!amount || amount <= 0) {
    throw new Error('Valid amount is required');
  }
  
  if (!testTakerWallet || testTakerWallet.trim() === '') {
    throw new Error('Test taker wallet address is required');
  }
  
  if (!platformWallet || platformWallet.trim() === '') {
    throw new Error('Platform wallet address is required');
  }
  
  if (!callbackUrl) {
    throw new Error('Callback URL is required');
  }
  
  // Validate cryptocurrency
  if (!validateCryptocurrency(cryptocurrency)) {
    throw new Error(`Unsupported cryptocurrency: ${cryptocurrency}`);
  }
  
  // Calculate amounts
  const amounts = calculatePaymentAmounts(amount, cryptocurrency);
  
  // Prepare CryptAPI request
  const coin = cryptocurrency.toLowerCase();
  const url = `${CRYPTAPI_BASE_URL}/${coin}/create/`;
  
  const requestBody = {
    callback: callbackUrl,
    address: testTakerWallet,
    pending: 0,
    confirmations: 1,
    post: 1,
    // Commission configuration for automatic split
    commission: {
      address: platformWallet,
      percentage: 3 // 3% to platform
    }
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`CryptAPI error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.address_in) {
      throw new Error('CryptAPI did not return a payment address');
    }
    
    return {
      paymentAddress: data.address_in,
      totalAmount: amounts.totalAmount,
      commissionAmount: amounts.commissionAmount,
      testTakerAmount: amounts.testTakerAmount,
      cryptocurrency: amounts.cryptocurrency,
      callbackUrl: data.callback_url || callbackUrl,
      qrCodeUrl: `https://api.cryptapi.io/${coin}/qrcode/?address=${data.address_in}&value=${amount}`
    };
    
  } catch (error) {
    if (error.message.includes('CryptAPI')) {
      throw error;
    }
    throw new Error(`Failed to create payment address: ${error.message}`);
  }
}

/**
 * Get CryptAPI coin code from cryptocurrency
 * 
 * @param {string} cryptocurrency - Cryptocurrency code
 * @returns {string} CryptAPI coin code (lowercase)
 */
export function getCoinCode(cryptocurrency) {
  const coinMap = {
    'BTC': 'btc',
    'ETH': 'eth',
    'DOGE': 'doge',
    'SOL': 'sol'
  };
  
  return coinMap[cryptocurrency.toUpperCase()] || cryptocurrency.toLowerCase();
}