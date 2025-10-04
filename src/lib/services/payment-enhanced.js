/**
 * Enhanced Payment Service
 * 
 * Handles enhanced payment features including:
 * - Commission calculation by service type
 * - Payment splitting
 * - Refund system
 * - Earnings summary
 * - Payment method management
 */

import { getSupabaseClient } from '../supabaseClient.js';

const supabase = getSupabaseClient();

// Commission rates by service type (matching database defaults)
const COMMISSION_RATES = {
  homework_help: 0.15,
  programming_help: 0.20,
  assignment_writing: 0.15,
  test_taking: 0.25
};

const DEFAULT_COMMISSION_RATE = 0.03;

/**
 * Calculate commission split by service type
 * 
 * @param {number} amount - Total payment amount
 * @param {string} serviceType - Service type (homework_help, programming_help, etc.)
 * @returns {Object} Commission breakdown
 * @throws {Error} If amount is invalid
 */
export function calculateCommissionByServiceType(amount, serviceType) {
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  const commissionRate = COMMISSION_RATES[serviceType] || DEFAULT_COMMISSION_RATE;
  const commissionAmount = amount * commissionRate;
  const serviceProviderAmount = amount - commissionAmount;

  return {
    totalAmount: amount,
    commissionRate,
    commissionAmount,
    serviceProviderAmount
  };
}

/**
 * Split payment between platform and service provider
 * 
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Updated payment with split amounts
 * @throws {Error} If payment not found or split fails
 */
export async function splitPayment(paymentId) {
  if (!paymentId) {
    throw new Error('Payment ID is required');
  }

  // Get payment details
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Payment not found');
    }
    throw new Error(`Failed to fetch payment: ${fetchError.message}`);
  }

  // Calculate commission split
  const split = calculateCommissionByServiceType(
    payment.usd_equivalent || payment.amount,
    payment.service_type
  );

  // Update payment with split amounts
  const { data: updatedPayment, error: updateError } = await supabase
    .from('payments')
    .update({
      commission_rate: split.commissionRate,
      commission_amount: split.commissionAmount,
      test_taker_amount: split.serviceProviderAmount
    })
    .eq('id', paymentId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update payment: ${updateError.message}`);
  }

  return {
    ...updatedPayment,
    commissionAmount: split.commissionAmount,
    serviceProviderAmount: split.serviceProviderAmount
  };
}

/**
 * Request a refund for a payment
 * 
 * @param {Object} params - Refund parameters
 * @param {string} params.paymentId - Payment ID
 * @param {string} params.requesterId - User requesting refund
 * @param {string} params.reason - Reason for refund
 * @param {number} params.amount - Amount to refund (optional, defaults to full payment)
 * @returns {Promise<Object>} Created refund request
 * @throws {Error} If validation fails or refund creation fails
 */
export async function requestRefund(params) {
  const { paymentId, requesterId, reason, amount } = params;

  // Validation
  if (!paymentId) throw new Error('Payment ID is required');
  if (!requesterId) throw new Error('Requester ID is required');
  if (!reason) throw new Error('Reason is required');

  // Get payment details
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('Payment not found');
    }
    throw new Error(`Failed to fetch payment: ${fetchError.message}`);
  }

  // Create refund request
  const refundData = {
    payment_id: paymentId,
    requester_id: requesterId,
    amount: amount || payment.amount,
    cryptocurrency: payment.cryptocurrency,
    usd_equivalent: payment.usd_equivalent,
    reason,
    status: 'pending'
  };

  const { data: refund, error: createError } = await supabase
    .from('refunds')
    .insert(refundData)
    .select()
    .single();

  if (createError) {
    if (createError.code === '23505') {
      throw new Error('Refund request already exists for this payment');
    }
    throw new Error(`Failed to create refund request: ${createError.message}`);
  }

  return refund;
}

/**
 * Get refund status
 * 
 * @param {string} refundId - Refund ID
 * @returns {Promise<Object|null>} Refund details or null if not found
 */
export async function getRefundStatus(refundId) {
  if (!refundId) throw new Error('Refund ID is required');

  const { data: refund, error } = await supabase
    .from('refunds')
    .select('*')
    .eq('id', refundId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to get refund status: ${error.message}`);
  }

  return refund;
}

/**
 * Get earnings summary for a user and period
 * 
 * @param {string} userId - User ID
 * @param {string} startDate - Period start date (ISO string)
 * @param {string} endDate - Period end date (ISO string)
 * @returns {Promise<Object>} Earnings summary
 * @throws {Error} If validation fails or query fails
 */
export async function getEarningsSummary(userId, startDate, endDate) {
  if (!userId) throw new Error('User ID is required');
  if (!startDate) throw new Error('Start date is required');
  if (!endDate) throw new Error('End date is required');

  const { data, error } = await supabase.rpc('calculate_earnings_for_period', {
    p_user_id: userId,
    p_start_date: startDate,
    p_end_date: endDate
  });

  if (error) {
    throw new Error(`Failed to get earnings summary: ${error.message}`);
  }

  return data;
}

/**
 * Add a payment method for a user
 * 
 * @param {Object} params - Payment method parameters
 * @param {string} params.userId - User ID
 * @param {string} params.methodType - Method type (crypto_wallet, paypal, bank_transfer)
 * @param {string} params.cryptocurrency - Cryptocurrency code (for crypto_wallet)
 * @param {string} params.walletAddress - Wallet address (for crypto_wallet)
 * @param {string} params.paypalEmail - PayPal email (for paypal)
 * @param {Object} params.bankDetails - Bank details (for bank_transfer)
 * @returns {Promise<Object>} Created payment method
 * @throws {Error} If validation fails or creation fails
 */
export async function addPaymentMethod(params) {
  const { userId, methodType, cryptocurrency, walletAddress, paypalEmail, bankDetails } = params;

  // Validation
  if (!userId) throw new Error('User ID is required');
  if (!methodType) throw new Error('Method type is required');

  const validMethodTypes = ['crypto_wallet', 'paypal', 'bank_transfer'];
  if (!validMethodTypes.includes(methodType)) {
    throw new Error('Invalid payment method type');
  }

  // Validate method-specific requirements
  if (methodType === 'crypto_wallet' && (!cryptocurrency || !walletAddress)) {
    throw new Error('Cryptocurrency and wallet address are required for crypto wallet');
  }
  if (methodType === 'paypal' && !paypalEmail) {
    throw new Error('PayPal email is required for PayPal method');
  }
  if (methodType === 'bank_transfer' && !bankDetails) {
    throw new Error('Bank details are required for bank transfer');
  }

  const methodData = {
    user_id: userId,
    method_type: methodType,
    cryptocurrency,
    wallet_address: walletAddress,
    paypal_email: paypalEmail,
    bank_details: bankDetails
  };

  const { data: method, error } = await supabase
    .from('payment_methods')
    .insert(methodData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add payment method: ${error.message}`);
  }

  return method;
}

/**
 * Get all payment methods for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of payment methods
 * @throws {Error} If query fails
 */
export async function getPaymentMethods(userId) {
  if (!userId) throw new Error('User ID is required');

  const { data: methods, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get payment methods: ${error.message}`);
  }

  return methods || [];
}

/**
 * Set a payment method as default
 * 
 * @param {string} userId - User ID
 * @param {string} methodId - Payment method ID
 * @returns {Promise<void>}
 * @throws {Error} If validation fails or update fails
 */
export async function setDefaultPaymentMethod(userId, methodId) {
  if (!userId) throw new Error('User ID is required');
  if (!methodId) throw new Error('Payment method ID is required');

  // First, unset all other default methods for this user
  const { error: unsetError } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (unsetError) {
    throw new Error(`Failed to unset default methods: ${unsetError.message}`);
  }

  // Set the specified method as default
  const { error: setError } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', methodId)
    .eq('user_id', userId);

  if (setError) {
    throw new Error(`Failed to set default method: ${setError.message}`);
  }
}

/**
 * Delete a payment method
 * 
 * @param {string} userId - User ID
 * @param {string} methodId - Payment method ID
 * @returns {Promise<void>}
 * @throws {Error} If validation fails or deletion fails
 */
export async function deletePaymentMethod(userId, methodId) {
  if (!userId) throw new Error('User ID is required');
  if (!methodId) throw new Error('Payment method ID is required');

  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', methodId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete payment method: ${error.message}`);
  }
}

/**
 * Get commission rates
 * 
 * @returns {Promise<Array>} Array of commission rates
 */
export async function getCommissionRates() {
  const { data: rates, error } = await supabase
    .from('commission_rates')
    .select('*')
    .order('service_type');

  if (error) {
    throw new Error(`Failed to get commission rates: ${error.message}`);
  }

  return rates || [];
}

/**
 * Process refund (admin function)
 * 
 * @param {string} refundId - Refund ID
 * @param {Object} updates - Updates to apply
 * @param {string} updates.status - New status (approved, rejected, processed)
 * @param {string} updates.adminNotes - Admin notes
 * @param {string} updates.refundTransactionHash - Transaction hash (for processed)
 * @returns {Promise<Object>} Updated refund
 */
export async function processRefund(refundId, updates) {
  if (!refundId) throw new Error('Refund ID is required');
  if (!updates.status) throw new Error('Status is required');

  const updateData = {
    status: updates.status,
    admin_notes: updates.adminNotes
  };

  if (updates.status === 'processed') {
    updateData.processed_at = new Date().toISOString();
    updateData.refund_transaction_hash = updates.refundTransactionHash;
  }

  const { data: refund, error } = await supabase
    .from('refunds')
    .update(updateData)
    .eq('id', refundId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to process refund: ${error.message}`);
  }

  // If refund is processed, mark payment as refunded
  if (updates.status === 'processed') {
    await supabase
      .from('payments')
      .update({
        refunded: true,
        refunded_at: new Date().toISOString()
      })
      .eq('id', refund.payment_id);
  }

  return refund;
}