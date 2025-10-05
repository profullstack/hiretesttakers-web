/**
 * Exchange Rate API Endpoint
 *
 * GET /api/exchange-rate/[crypto]
 * Fetches exchange rate for specified cryptocurrency
 */

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const TATUM_API_BASE = 'https://api.tatum.io/v3';
const SUPPORTED_CRYPTOS = ['BTC', 'ETH', 'DOGE', 'SOL'];

/**
 * Handle GET request for exchange rate
 * @param {Object} params - Request parameters
 * @param {Object} params.params - URL parameters
 * @returns {Response} JSON response with exchange rate or error
 */
export async function GET({ params }) {
  try {
    const { crypto } = params;
    
    if (!crypto) {
      return json({
        success: false,
        error: 'Cryptocurrency parameter is required'
      }, { status: 400 });
    }

    const cryptoUpper = crypto.toUpperCase();
    
    if (!SUPPORTED_CRYPTOS.includes(cryptoUpper)) {
      return json({
        success: false,
        error: `Unsupported cryptocurrency: ${crypto}`
      }, { status: 400 });
    }

    const apiKey = env.TATUM_API_KEY;
    
    // Fallback rates for development (approximate values)
    const FALLBACK_RATES = {
      'BTC': 95000,
      'ETH': 3500,
      'DOGE': 0.35,
      'SOL': 180
    };
    
    if (!apiKey || apiKey.includes('your_') || apiKey.startsWith('t-673f4b2a')) {
      // Use fallback rates if API key is not configured or is a placeholder
      console.warn(`Using fallback exchange rate for ${cryptoUpper} - Configure TATUM_API_KEY in .env for real rates`);
      return json({
        success: true,
        cryptocurrency: cryptoUpper,
        fiatCurrency: 'USD',
        rate: FALLBACK_RATES[cryptoUpper],
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

    try {
      const url = `${TATUM_API_BASE}/tatum/rate/${cryptoUpper}?basePair=USD`;
      
      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKey
        }
      });
      
      if (!response.ok) {
        // If API fails, use fallback
        console.warn(`Tatum API failed, using fallback rate for ${cryptoUpper}`);
        return json({
          success: true,
          cryptocurrency: cryptoUpper,
          fiatCurrency: 'USD',
          rate: FALLBACK_RATES[cryptoUpper],
          timestamp: new Date().toISOString(),
          fallback: true
        });
      }
      
      const data = await response.json();
      
      if (!data.value) {
        // If invalid response, use fallback
        console.warn(`Invalid Tatum API response, using fallback rate for ${cryptoUpper}`);
        return json({
          success: true,
          cryptocurrency: cryptoUpper,
          fiatCurrency: 'USD',
          rate: FALLBACK_RATES[cryptoUpper],
          timestamp: new Date().toISOString(),
          fallback: true
        });
      }
      
      const rate = parseFloat(data.value);

      return json({
        success: true,
        cryptocurrency: cryptoUpper,
        fiatCurrency: 'USD',
        rate,
        timestamp: new Date().toISOString(),
        fallback: false
      });
    } catch (apiError) {
      // On any error, use fallback
      console.warn(`Tatum API error, using fallback rate for ${cryptoUpper}:`, apiError.message);
      return json({
        success: true,
        cryptocurrency: cryptoUpper,
        fiatCurrency: 'USD',
        rate: FALLBACK_RATES[cryptoUpper],
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}