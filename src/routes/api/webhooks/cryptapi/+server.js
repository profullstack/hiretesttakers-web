/**
 * CryptAPI Webhook Handler
 * 
 * POST /api/webhooks/cryptapi - Handle payment confirmations from CryptAPI
 */

import { json } from '@sveltejs/kit';
import { updatePaymentStatus } from '$lib/services/payment.js';

/**
 * POST /api/webhooks/cryptapi
 * Handle payment confirmation webhook from CryptAPI
 * 
 * CryptAPI sends POST requests with payment confirmation data
 */
export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Extract payment information from webhook
    const {
      address_in,
      address_out,
      txid_in,
      txid_out,
      value,
      value_coin,
      confirmations,
      pending
    } = data;

    // Log webhook data for debugging
    console.log('CryptAPI webhook received:', {
      address_in,
      txid_in,
      value_coin,
      confirmations,
      pending
    });

    // Find payment by address
    const { supabase } = await import('$lib/supabaseClient.js');
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_address', address_in)
      .single();

    if (findError || !payment) {
      console.error('Payment not found for address:', address_in);
      return json({ error: 'Payment not found' }, { status: 404 });
    }

    // Determine payment status based on confirmations
    let status = 'pending';
    if (pending === 0 && confirmations >= 1) {
      status = 'confirmed';
    } else if (pending === 1) {
      status = 'pending';
    }

    // Update payment status
    await updatePaymentStatus(payment.id, {
      status,
      transaction_hash: txid_in,
      confirmed_at: status === 'confirmed' ? new Date().toISOString() : null
    });

    // If commission transaction exists, update it too
    if (txid_out) {
      await supabase
        .from('commission_payments')
        .update({
          transaction_hash: txid_out,
          status,
          confirmed_at: status === 'confirmed' ? new Date().toISOString() : null
        })
        .eq('payment_id', payment.id);
    }

    console.log(`Payment ${payment.id} updated to status: ${status}`);

    // Return success response
    return json({ success: true, status });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/webhooks/cryptapi
 * Health check endpoint
 */
export async function GET() {
  return json({ status: 'ok', message: 'CryptAPI webhook endpoint is active' });
}