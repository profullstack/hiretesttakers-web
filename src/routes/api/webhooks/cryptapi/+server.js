/**
 * CryptAPI Webhook Handler
 * 
 * Handles incoming webhook callbacks from CryptAPI when payments are received.
 * Updates payment status and logs all webhook events.
 * 
 * CryptAPI sends webhooks with the following parameters:
 * - address_in: The payment address
 * - address_out: The forwarding address
 * - txid_in: Transaction hash
 * - txid_out: Forwarding transaction hash
 * - value: Amount received
 * - value_forwarded: Amount forwarded
 * - confirmations: Number of confirmations
 */

import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const supabase = createClient(
  env.PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST handler for CryptAPI webhooks
 */
export async function POST({ request, url }) {
  try {
    // Parse webhook data
    const webhookData = await request.json();
    
    console.log('[CryptAPI Webhook] Received:', webhookData);
    
    // Extract required fields
    const {
      address_in: addressIn,
      txid_in: txidIn,
      value,
      value_forwarded: valueForwarded,
      confirmations = 0
    } = webhookData;
    
    // Validate required fields
    if (!addressIn) {
      console.error('[CryptAPI Webhook] Missing address_in');
      throw error(400, 'Missing required field: address_in');
    }
    
    // Process webhook using database function
    const { data, error: dbError } = await supabase.rpc(
      'process_cryptapi_webhook',
      {
        p_cryptapi_address: addressIn,
        p_transaction_hash: txidIn || null,
        p_value_received: parseFloat(value) || 0,
        p_value_forwarded: parseFloat(valueForwarded) || 0,
        p_confirmations: parseInt(confirmations) || 0,
        p_callback_data: webhookData
      }
    );
    
    if (dbError) {
      console.error('[CryptAPI Webhook] Database error:', dbError);
      throw error(500, `Database error: ${dbError.message}`);
    }
    
    console.log('[CryptAPI Webhook] Processed successfully:', data);
    
    // Return success response
    return json({
      success: true,
      webhookLogId: data,
      message: 'Webhook processed successfully'
    });
    
  } catch (err) {
    console.error('[CryptAPI Webhook] Error:', err);
    
    // Log error but return 200 to prevent CryptAPI from retrying
    // (we've already logged the webhook attempt)
    return json({
      success: false,
      error: err.message || 'Internal server error'
    }, {
      status: err.status || 500
    });
  }
}

/**
 * GET handler for webhook verification
 * CryptAPI may send GET requests to verify the endpoint
 */
export async function GET({ url }) {
  return json({
    status: 'ok',
    message: 'CryptAPI webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}