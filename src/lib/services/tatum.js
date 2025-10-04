/**
 * Tatum Exchange Rate Service
 * 
 * Fetches real-time cryptocurrency exchange rates from Tatum.io API.
 * Supports BTC, ETH, DOGE, SOL to USD conversion.
 */

import { validateCryptocurrency } from '../utils/commission.js';

const TATUM_API_BASE = 'https://api.tatum.io/v3';
const SUPPORTED_PAIRS = ['BTC-USD', 'ETH-USD', 'DOGE-USD', 'SOL-USD'];
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache
const rateCache = new Map();

/**
 * Get list of supported currency pairs
 * 
 * @returns {string[]} Array of supported pairs (e.g., ['BTC-USD', 'ETH-USD'])
 */
export function getSupportedPairs() {
  return [...SUPPORTED_PAIRS];
}

/**
 * Convert cryptocurrency amount to USD
 * 
 * @param {number} cryptoAmount - Amount in cryptocurrency
 * @param {number} exchangeRate - Exchange rate (crypto to USD)
 * @returns {number} USD value rounded to 2 decimals
 * @throws {Error} If amount or rate is invalid
 */
export function convertCryptoToUSD(cryptoAmount, exchangeRate) {
  if (cryptoAmount < 0) {
    throw new Error('Amount must be positive');
  }
  
  if (exchangeRate <= 0) {
    throw new Error('Exchange rate must be positive');
  }
  
  const usdValue = cryptoAmount * exchangeRate;
  return Math.round(usdValue * 100) / 100; // Round to 2 decimals
}

/**
 * Get exchange rate from cache if available and fresh
 * 
 * @param {string} cryptocurrency - Cryptocurrency code
 * @returns {Object|null} Cached rate or null
 */
function getCachedRate(cryptocurrency) {
  const cacheKey = `${cryptocurrency}-USD`;
  const cached = rateCache.get(cacheKey);
  
  if (!cached) {
    return null;
  }
  
  const age = Date.now() - cached.timestamp;
  if (age > CACHE_DURATION_MS) {
    rateCache.delete(cacheKey);
    return null;
  }
  
  return cached;
}

/**
 * Set exchange rate in cache
 * 
 * @param {string} cryptocurrency - Cryptocurrency code
 * @param {number} rate - Exchange rate
 */
function setCachedRate(cryptocurrency, rate) {
  const cacheKey = `${cryptocurrency}-USD`;
  rateCache.set(cacheKey, {
    rate,
    timestamp: Date.now()
  });
}

/**
 * Get current exchange rate for cryptocurrency to USD
 * 
 * @param {string} cryptocurrency - Cryptocurrency code (BTC, ETH, DOGE, SOL)
 * @param {boolean} useCache - Whether to use cached rate (default: true)
 * @returns {Promise<Object>} Exchange rate data
 * @throws {Error} If cryptocurrency is invalid or API call fails
 */
export async function getExchangeRate(cryptocurrency, useCache = true) {
  if (!cryptocurrency || cryptocurrency.trim() === '') {
    throw new Error('Cryptocurrency is required');
  }
  
  const crypto = cryptocurrency.toUpperCase();
  
  if (!validateCryptocurrency(crypto)) {
    throw new Error(`Unsupported cryptocurrency: ${crypto}`);
  }
  
  // Check cache first
  if (useCache) {
    const cached = getCachedRate(crypto);
    if (cached) {
      return {
        cryptocurrency: crypto,
        fiatCurrency: 'USD',
        rate: cached.rate,
        timestamp: new Date(cached.timestamp).toISOString(),
        cached: true
      };
    }
  }
  
  // Fetch from Tatum API
  const apiKey = process.env.TATUM_API_KEY;
  
  if (!apiKey || apiKey === 'your_tatum_api_key_here') {
    throw new Error('Tatum API key not configured');
  }
  
  try {
    const url = `${TATUM_API_BASE}/tatum/rate/${crypto}?basePair=USD`;
    
    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tatum API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.value) {
      throw new Error('Invalid response from Tatum API');
    }
    
    const rate = parseFloat(data.value);
    
    // Cache the rate
    setCachedRate(crypto, rate);
    
    return {
      cryptocurrency: crypto,
      fiatCurrency: 'USD',
      rate,
      timestamp: new Date().toISOString(),
      cached: false
    };
    
  } catch (error) {
    if (error.message.includes('Tatum')) {
      throw error;
    }
    throw new Error(`Failed to fetch exchange rate: ${error.message}`);
  }
}

/**
 * Get exchange rates for all supported cryptocurrencies
 * 
 * @param {boolean} useCache - Whether to use cached rates
 * @returns {Promise<Object>} Map of cryptocurrency to rate
 */
export async function getAllExchangeRates(useCache = true) {
  const rates = {};
  const coins = ['BTC', 'ETH', 'DOGE', 'SOL'];
  
  await Promise.all(
    coins.map(async (coin) => {
      try {
        const rateData = await getExchangeRate(coin, useCache);
        rates[coin] = rateData.rate;
      } catch (error) {
        console.error(`Failed to fetch ${coin} rate:`, error.message);
        rates[coin] = null;
      }
    })
  );
  
  return rates;
}

/**
 * Clear exchange rate cache
 */
export function clearRateCache() {
  rateCache.clear();
}