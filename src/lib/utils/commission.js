/**
 * Commission Calculation Utilities
 * 
 * Handles platform commission calculations for cryptocurrency payments.
 * Default commission rate: 3% (0.03)
 * Supported cryptocurrencies: BTC, ETH, DOGE, SOL
 */

const DEFAULT_COMMISSION_RATE = 0.03; // 3%
const SUPPORTED_CRYPTOCURRENCIES = ['BTC', 'ETH', 'DOGE', 'SOL'];
const CRYPTO_PRECISION = 8; // 8 decimal places for cryptocurrency

/**
 * Calculate commission split for a payment
 * 
 * @param {number} totalAmount - Total payment amount in cryptocurrency
 * @param {number} commissionRate - Commission rate (default: 0.03 for 3%)
 * @returns {Object} Commission breakdown
 * @throws {Error} If amount is negative or commission rate is invalid
 */
export function calculateCommission(totalAmount, commissionRate = DEFAULT_COMMISSION_RATE) {
  // Validation
  if (totalAmount < 0) {
    throw new Error('Amount must be positive');
  }
  
  if (commissionRate < 0 || commissionRate > 1) {
    throw new Error('Commission rate must be between 0 and 1');
  }
  
  // Calculate amounts
  const commissionAmount = roundToCryptoPrecision(totalAmount * commissionRate);
  const testTakerAmount = roundToCryptoPrecision(totalAmount * (1 - commissionRate));
  
  return {
    totalAmount,
    commissionAmount,
    testTakerAmount,
    commissionRate
  };
}

/**
 * Round number to cryptocurrency precision (8 decimal places)
 * 
 * @param {number} value - Value to round
 * @returns {number} Rounded value
 */
function roundToCryptoPrecision(value) {
  return Math.round(value * Math.pow(10, CRYPTO_PRECISION)) / Math.pow(10, CRYPTO_PRECISION);
}

/**
 * Validate if cryptocurrency is supported
 * 
 * @param {string} cryptocurrency - Cryptocurrency code (e.g., 'BTC', 'ETH')
 * @returns {boolean} True if supported, false otherwise
 */
export function validateCryptocurrency(cryptocurrency) {
  if (!cryptocurrency || typeof cryptocurrency !== 'string') {
    return false;
  }
  
  return SUPPORTED_CRYPTOCURRENCIES.includes(cryptocurrency.toUpperCase());
}

/**
 * Get list of supported cryptocurrencies
 * 
 * @returns {string[]} Array of supported cryptocurrency codes
 */
export function getSupportedCryptocurrencies() {
  return [...SUPPORTED_CRYPTOCURRENCIES];
}

/**
 * Format cryptocurrency amount for display
 * 
 * @param {number} amount - Amount in cryptocurrency
 * @param {string} cryptocurrency - Cryptocurrency code
 * @returns {string} Formatted string (e.g., "0.01234567 BTC")
 */
export function formatCryptoAmount(amount, cryptocurrency) {
  const rounded = roundToCryptoPrecision(amount);
  return `${rounded.toFixed(CRYPTO_PRECISION)} ${cryptocurrency.toUpperCase()}`;
}