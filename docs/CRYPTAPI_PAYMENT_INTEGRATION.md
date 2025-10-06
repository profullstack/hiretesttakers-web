# CryptAPI Payment Integration

Complete implementation of CryptAPI payment system with QR code display, USD exchange rates, and automatic commission splitting.

## Overview

This integration enables cryptocurrency payments between users (hirers and test takers/job workers) using CryptAPI's forwarding service. The system automatically splits payments with a 3% platform commission.

## Features

✅ **QR Code Display** - Easy payment scanning with mobile wallets
✅ **USD Exchange Rate** - Real-time cryptocurrency to USD conversion
✅ **Payment Address** - Unique address for each transaction
✅ **Automatic Commission Split** - 97% to recipient, 3% to platform
✅ **Webhook Integration** - Real-time payment confirmation
✅ **Multi-Currency Support** - BTC, ETH, DOGE, SOL

## Architecture

### Components

1. **CryptAPI Service** (`src/lib/services/cryptapi.js`)
   - Exchange rate fetching
   - Payment address creation
   - Commission calculation
   - QR code URL generation

2. **Payment Display Component** (`src/lib/components/CryptoPaymentDisplay.svelte`)
   - QR code visualization
   - Payment details display
   - USD conversion
   - Commission breakdown

3. **API Endpoints**
   - `POST /api/payments/create` - Create new payment
   - `POST /api/webhooks/cryptapi` - Handle payment confirmations
   - `GET /api/webhooks/cryptapi` - Webhook verification

4. **Database Schema** (`supabase/migrations/20251006134707_cryptapi_payment_tracking.sql`)
   - Enhanced payments table
   - Webhook logs table
   - Payment processing functions

## Usage

### Creating a Payment

```javascript
import { createPaymentWithExchangeRate } from '$lib/services/cryptapi.js';

const payment = await createPaymentWithExchangeRate({
  cryptocurrency: 'BTC',
  amount: 0.01,
  testTakerWallet: 'bc1q...',
  platformWallet: 'bc1q...',
  callbackUrl: 'https://yoursite.com/api/webhooks/cryptapi'
});

// Returns:
// {
//   paymentAddress: 'bc1q...',
//   qrCodeUrl: 'https://api.cryptapi.io/btc/qrcode/...',
//   totalAmount: 0.01,
//   testTakerAmount: 0.0097,
//   commissionAmount: 0.0003,
//   cryptocurrency: 'BTC',
//   exchangeRate: 65000,
//   usdEquivalent: 650
// }
```

### Displaying Payment Details

```svelte
<script>
  import CryptoPaymentDisplay from '$lib/components/CryptoPaymentDisplay.svelte';
</script>

<CryptoPaymentDisplay
  paymentAddress={payment.paymentAddress}
  amount={payment.amount}
  cryptocurrency={payment.cryptocurrency}
  usdEquivalent={payment.usdEquivalent}
  exchangeRate={payment.exchangeRate}
  qrCodeUrl={payment.qrCodeUrl}
  testTakerAmount={payment.testTakerAmount}
  commissionAmount={payment.commissionAmount}
  showBreakdown={true}
/>
```

## Payment Flow

### 1. Payment Creation

```
User → Payment Form → API → CryptAPI → Database
                                ↓
                         Payment Address
                         QR Code URL
                         Exchange Rate
```

### 2. User Payment

```
User Wallet → CryptAPI Address → Automatic Split:
                                  ├─ 97% → Recipient
                                  └─ 3% → Platform
```

### 3. Confirmation

```
CryptAPI → Webhook → Database → Status Update
                      ↓
                 Notification
```

## Database Schema

### Enhanced Payments Table

```sql
ALTER TABLE payments ADD COLUMN:
- cryptapi_address TEXT
- cryptapi_callback_url TEXT
- qr_code_url TEXT
- exchange_rate_usd NUMERIC(20, 8)
- confirmations INTEGER
- transaction_hash TEXT
- blockchain_confirmed_at TIMESTAMPTZ
```

### Webhook Logs Table

```sql
CREATE TABLE cryptapi_webhook_logs (
  id UUID PRIMARY KEY,
  payment_id UUID REFERENCES payments(id),
  cryptapi_address TEXT NOT NULL,
  transaction_hash TEXT,
  value_received NUMERIC(20, 8),
  value_forwarded NUMERIC(20, 8),
  confirmations INTEGER,
  callback_data JSONB,
  processed BOOLEAN,
  created_at TIMESTAMPTZ
);
```

## Environment Variables

Required environment variables in `.env`:

```env
# CryptAPI Configuration
PUBLIC_APP_URL=https://yoursite.com

# Platform Wallets
PLATFORM_WALLET_BTC=bc1q...
PLATFORM_WALLET_ETH=0x...
PLATFORM_WALLET_DOGE=D...
PLATFORM_WALLET_SOL=...

# Supabase
PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

## API Reference

### Create Payment

**Endpoint:** `POST /api/payments/create`

**Request Body:**
```json
{
  "testId": "uuid",
  "jobId": "uuid",
  "amount": 0.01,
  "cryptocurrency": "BTC",
  "recipientId": "uuid",
  "recipientWallet": "bc1q..."
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "uuid",
    "paymentAddress": "bc1q...",
    "qrCodeUrl": "https://...",
    "amount": 0.01,
    "cryptocurrency": "BTC",
    "usdEquivalent": 650,
    "exchangeRate": 65000,
    "testTakerAmount": 0.0097,
    "commissionAmount": 0.0003,
    "status": "pending"
  }
}
```

### Webhook Handler

**Endpoint:** `POST /api/webhooks/cryptapi`

**CryptAPI Payload:**
```json
{
  "address_in": "bc1q...",
  "txid_in": "transaction_hash",
  "value": "0.01",
  "value_forwarded": "0.0097",
  "confirmations": 1
}
```

## Testing

Run tests with:

```bash
pnpm test tests/services/cryptapi-enhanced.test.js
```

Test coverage includes:
- Exchange rate fetching
- USD conversion
- Payment creation with exchange rates
- Error handling
- Full payment flow integration

## Security Considerations

1. **Webhook Verification** - All webhooks are logged and validated
2. **Database Functions** - Use SECURITY DEFINER for controlled access
3. **RLS Policies** - Row-level security on all payment tables
4. **Service Role Key** - Used only in server-side API routes
5. **No Private Keys** - Platform never holds user private keys

## Supported Cryptocurrencies

| Currency | Code | Network |
|----------|------|---------|
| Bitcoin | BTC | Bitcoin |
| Ethereum | ETH | Ethereum |
| Dogecoin | DOGE | Dogecoin |
| Solana | SOL | Solana |

## Commission Structure

- **Platform Fee:** 3%
- **Recipient Amount:** 97%
- **Automatic Split:** Handled by CryptAPI forwarding

## Troubleshooting

### Payment Not Confirming

1. Check webhook logs in `cryptapi_webhook_logs` table
2. Verify CryptAPI callback URL is accessible
3. Ensure sufficient blockchain confirmations (default: 1)

### Exchange Rate Issues

1. CryptAPI info endpoint may be temporarily unavailable
2. Fallback to cached rates if needed
3. Check network connectivity

### QR Code Not Displaying

1. Verify QR code URL is generated correctly
2. Check CryptAPI API status
3. Ensure proper image loading in component

## Future Enhancements

- [ ] Real-time payment status updates via WebSocket
- [ ] Multiple confirmation threshold options
- [ ] Payment expiration handling
- [ ] Refund automation
- [ ] Additional cryptocurrency support

## References

- [CryptAPI Documentation](https://docs.cryptapi.io/)
- [Payment Flow Documentation](../PAYMENT_FLOW.md)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

For issues or questions:
1. Check webhook logs in database
2. Review CryptAPI dashboard
3. Verify environment variables
4. Test with small amounts first

---

**Last Updated:** 2025-10-06
**Version:** 1.0.0