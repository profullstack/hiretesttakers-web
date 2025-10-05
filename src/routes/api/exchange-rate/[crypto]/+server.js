/**
 * Exchange Rate API Endpoint
 * 
 * GET /api/exchange-rate/[crypto]
 * Fetches exchange rate for specified cryptocurrency
 */

import { json } from '@sveltejs/kit';
import { getExchangeRate } from '$lib/services/tatum.js';

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

    const rateData = await getExchangeRate(crypto);

    return json({
      success: true,
      ...rateData
    });
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}