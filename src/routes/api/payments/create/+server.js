/**
 * Payment Creation API Endpoint
 * 
 * Creates a new payment using CryptAPI with automatic commission splitting.
 * Returns payment details including QR code and USD exchange rate.
 */

import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { createPaymentWithExchangeRate } from '$lib/services/cryptapi.js';

const supabase = createClient(
  env.PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/payments/create
 * Create a new cryptocurrency payment
 */
export async function POST({ request, locals }) {
  try {
    const session = await locals.getSession();
    
    if (!session) {
      throw error(401, 'Unauthorized');
    }
    
    const userId = session.user.id;
    
    // Parse request body
    const {
      testId,
      jobId,
      amount,
      cryptocurrency,
      recipientId,
      recipientWallet
    } = await request.json();
    
    // Validate required fields
    if (!amount || amount <= 0) {
      throw error(400, 'Valid amount is required');
    }
    
    if (!cryptocurrency) {
      throw error(400, 'Cryptocurrency is required');
    }
    
    if (!recipientId) {
      throw error(400, 'Recipient ID is required');
    }
    
    if (!recipientWallet) {
      throw error(400, 'Recipient wallet address is required');
    }
    
    // Get platform wallet for the cryptocurrency
    const platformWallets = {
      BTC: env.PLATFORM_WALLET_BTC,
      ETH: env.PLATFORM_WALLET_ETH,
      DOGE: env.PLATFORM_WALLET_DOGE,
      SOL: env.PLATFORM_WALLET_SOL
    };
    
    const platformWallet = platformWallets[cryptocurrency.toUpperCase()];
    
    if (!platformWallet) {
      throw error(400, `Platform wallet not configured for ${cryptocurrency}`);
    }
    
    // Create callback URL
    const callbackUrl = `${env.PUBLIC_APP_URL}/api/webhooks/cryptapi`;
    
    // Create payment address with CryptAPI
    const paymentDetails = await createPaymentWithExchangeRate({
      cryptocurrency,
      amount,
      testTakerWallet: recipientWallet,
      platformWallet,
      callbackUrl
    });
    
    // Insert payment record into database
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        hirer_id: userId,
        test_taker_id: recipientId,
        test_id: testId || null,
        job_id: jobId || null,
        amount: paymentDetails.totalAmount,
        cryptocurrency: paymentDetails.cryptocurrency,
        usd_equivalent: paymentDetails.usdEquivalent,
        test_taker_amount: paymentDetails.testTakerAmount,
        commission_amount: paymentDetails.commissionAmount,
        commission_rate: 0.03,
        cryptapi_address: paymentDetails.paymentAddress,
        cryptapi_callback_url: paymentDetails.callbackUrl,
        qr_code_url: paymentDetails.qrCodeUrl,
        exchange_rate_usd: paymentDetails.exchangeRate,
        status: 'pending'
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('[Payment Creation] Database error:', dbError);
      throw error(500, `Failed to create payment record: ${dbError.message}`);
    }
    
    console.log('[Payment Creation] Payment created:', payment.id);
    
    // Return payment details
    return json({
      success: true,
      payment: {
        id: payment.id,
        paymentAddress: payment.cryptapi_address,
        qrCodeUrl: payment.qr_code_url,
        amount: payment.amount,
        cryptocurrency: payment.cryptocurrency,
        usdEquivalent: payment.usd_equivalent,
        exchangeRate: payment.exchange_rate_usd,
        testTakerAmount: payment.test_taker_amount,
        commissionAmount: payment.commission_amount,
        status: payment.status,
        createdAt: payment.created_at
      }
    });
    
  } catch (err) {
    console.error('[Payment Creation] Error:', err);
    
    if (err.status) {
      throw err;
    }
    
    throw error(500, err.message || 'Failed to create payment');
  }
}