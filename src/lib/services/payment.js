/**
 * Payment Service
 * 
 * Handles payment initiation, status tracking, and history for cryptocurrency payments.
 * Integrates with CryptAPI for payment address generation and Tatum for exchange rates.
 */

import { getSupabaseClient } from '../supabaseClient.js';

const supabase = getSupabaseClient();
import { createPaymentAddress } from './cryptapi.js';
import { getExchangeRate } from './tatum.js';

/**
 * Initiate a payment for a completed test
 * 
 * @param {Object} params - Payment parameters
 * @param {string} params.testId - Test ID
 * @param {string} params.hirerId - Hirer user ID
 * @param {string} params.testTakerId - Test taker user ID
 * @param {number} params.amount - Payment amount in USD
 * @param {string} params.cryptocurrency - Cryptocurrency code (BTC, ETH, DOGE, SOL)
 * @param {string} params.testTakerWallet - Test taker's wallet address
 * @returns {Promise<Object>} Payment details with payment address
 * @throws {Error} If validation fails or payment creation fails
 */
export async function initiatePayment(params) {
  const { testId, hirerId, testTakerId, amount, cryptocurrency, testTakerWallet } = params;

  // Validate required parameters
  if (!testId) throw new Error('Test ID is required');
  if (!hirerId) throw new Error('Hirer ID is required');
  if (!testTakerId) throw new Error('Test taker ID is required');
  if (!amount || amount <= 0) throw new Error('Valid amount is required');
  if (!cryptocurrency) throw new Error('Cryptocurrency is required');
  if (!testTakerWallet) throw new Error('Test taker wallet address is required');

  // Get exchange rate to convert USD to crypto
  const rateData = await getExchangeRate(cryptocurrency);
  const cryptoAmount = amount / rateData.rate;

  // Get platform wallet from environment
  const platformWallet = process.env[`${cryptocurrency}_PLATFORM_WALLET`];
  if (!platformWallet) {
    throw new Error(`Platform wallet not configured for ${cryptocurrency}`);
  }

  // Generate callback URL for webhook
  const callbackUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/api/webhooks/cryptapi`;

  // Create payment address via CryptAPI
  const paymentAddress = await createPaymentAddress({
    cryptocurrency,
    amount: cryptoAmount,
    testTakerWallet,
    platformWallet,
    callbackUrl
  });

  // Create payment record in database
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      test_id: testId,
      hirer_id: hirerId,
      test_taker_id: testTakerId,
      amount: cryptoAmount,
      cryptocurrency,
      usd_equivalent: amount,
      payment_address: paymentAddress.paymentAddress,
      test_taker_wallet: testTakerWallet,
      platform_wallet_address: platformWallet,
      status: 'pending',
      commission_rate: 0.03
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  return {
    ...payment,
    qrCodeUrl: paymentAddress.qrCodeUrl,
    commissionAmount: paymentAddress.commissionAmount,
    testTakerAmount: paymentAddress.testTakerAmount
  };
}

/**
 * Get payment status by ID
 * 
 * @param {string} paymentId - Payment ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object|null>} Payment details or null if not found
 */
export async function getPaymentStatus(paymentId, userId) {
  if (!paymentId) throw new Error('Payment ID is required');
  if (!userId) throw new Error('User ID is required');

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .or(`hirer_id.eq.${userId},test_taker_id.eq.${userId}`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get payment status: ${error.message}`);
  }

  return payment;
}

/**
 * Get payment history for a user
 * 
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status
 * @param {number} options.limit - Limit results (default: 50)
 * @param {number} options.offset - Offset for pagination (default: 0)
 * @returns {Promise<Array>} Array of payments
 */
export async function getPaymentHistory(userId, options = {}) {
  if (!userId) throw new Error('User ID is required');

  const { status, limit = 50, offset = 0 } = options;

  let query = supabase
    .from('payments')
    .select('*')
    .or(`hirer_id.eq.${userId},test_taker_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: payments, error } = await query;

  if (error) {
    throw new Error(`Failed to get payment history: ${error.message}`);
  }

  return payments || [];
}

/**
 * Update payment status (typically called by webhook)
 * 
 * @param {string} paymentId - Payment ID
 * @param {Object} updates - Fields to update
 * @param {string} updates.status - New status
 * @param {string} updates.transactionHash - Transaction hash
 * @returns {Promise<Object>} Updated payment
 */
export async function updatePaymentStatus(paymentId, updates) {
  if (!paymentId) throw new Error('Payment ID is required');

  const updateData = { ...updates };

  // Set confirmed_at timestamp if status is confirmed
  if (updates.status === 'confirmed' && !updates.confirmed_at) {
    updateData.confirmed_at = new Date().toISOString();
  }

  const { data: payment, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`);
  }

  return payment;
}

/**
 * Get payment by test ID
 * 
 * @param {string} testId - Test ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object|null>} Payment details or null if not found
 */
export async function getPaymentByTestId(testId, userId) {
  if (!testId) throw new Error('Test ID is required');
  if (!userId) throw new Error('User ID is required');

  const { data: payment, error } = await supabase
    .from('payments')
    .select('*')
    .eq('test_id', testId)
    .or(`hirer_id.eq.${userId},test_taker_id.eq.${userId}`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get payment: ${error.message}`);
  }

  return payment;
}