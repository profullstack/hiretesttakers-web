# Payment Flow with 3% Platform Commission

## Overview

HireTestTakers.com takes a 3% commission on all payments. The payment flow is designed to be **simple for users** (one payment) while automatically splitting funds between the test taker (97%) and the platform (3%).

## Supported Cryptocurrencies

- **BTC** (Bitcoin)
- **ETH** (Ethereum)
- **DOGE** (Dogecoin)
- **SOL** (Solana)

## Payment Flow (Simple for Users)

### Step 1: Test Completion
1. Test taker completes the test
2. Hirer marks test as completed
3. System initiates payment

### Step 2: Payment Generation
```javascript
// Backend calculates amounts
const totalAmount = 0.01; // Example: 0.01 BTC
const commissionRate = 0.03; // 3%
const commissionAmount = totalAmount * 0.03; // 0.0003 BTC
const testTakerAmount = totalAmount * 0.97; // 0.0097 BTC

// Use CryptAPI to create forwarding address
const response = await cryptapi.createForwardingAddress({
  coin: 'btc',
  destination: testTakerWalletAddress, // 97% goes here
  callback: 'https://hiretesttakers.com/api/webhooks/cryptapi',
  commission: {
    address: platformWalletBTC, // 3% goes here
    percentage: 3 // CryptAPI handles the split
  }
});

// Returns ONE address for the hirer to pay
const paymentAddress = response.address_in;
```

### Step 3: User Payment (SIMPLE!)
**Hirer sees:**
```
Pay 0.01 BTC to this address:
[QR Code]
bc1q...xyz

Amount: 0.01 BTC ($650 USD)
```

**That's it!** One address, one payment.

### Step 4: Automatic Split (Behind the Scenes)
When hirer sends 0.01 BTC to the address:
1. CryptAPI receives the payment
2. CryptAPI automatically forwards:
   - **97% (0.0097 BTC)** → Test taker's wallet
   - **3% (0.0003 BTC)** → Platform wallet
3. Both parties receive their funds
4. Webhooks confirm both transactions

### Step 5: Confirmation
- Test taker receives 97% in their wallet
- Platform receives 3% in platform wallet
- Both transactions recorded in database
- Payment marked as complete

## Technical Implementation

### Using CryptAPI Forwarding

```javascript
// src/lib/services/cryptapi.js

export async function createPaymentWithCommission(params) {
  const {
    cryptocurrency,
    totalAmount,
    testTakerWallet,
    platformWallet,
    commissionRate = 0.03
  } = params;
  
  // Calculate amounts
  const commission = totalAmount * commissionRate;
  const testTakerAmount = totalAmount - commission;
  
  // Create forwarding address with CryptAPI
  const response = await fetch(
    `https://api.cryptapi.io/${cryptocurrency}/create/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback: `${process.env.PUBLIC_APP_URL}/api/webhooks/cryptapi`,
        address: testTakerWallet,
        pending: 0,
        // Commission configuration
        commission: {
          address: platformWallet,
          percentage: commissionRate * 100 // 3
        },
        post: 1 // POST callback
      })
    }
  );
  
  const data = await response.json();
  
  return {
    paymentAddress: data.address_in, // Single address for hirer
    callbackUrl: data.callback_url,
    totalAmount,
    testTakerAmount,
    commissionAmount: commission
  };
}
```

### Database Records

```sql
-- Main payment record
INSERT INTO payments (
  test_id,
  hirer_id,
  test_taker_id,
  amount,              -- 0.01 BTC (full amount)
  cryptocurrency,      -- 'BTC'
  commission_rate,     -- 0.03
  commission_amount,   -- 0.0003 BTC (auto-calculated)
  test_taker_amount,   -- 0.0097 BTC (auto-calculated)
  payment_address,     -- Single address from CryptAPI
  platform_wallet_address, -- Platform BTC wallet
  status               -- 'pending'
);

-- Commission payment record (auto-created by trigger)
INSERT INTO commission_payments (
  payment_id,
  cryptocurrency,      -- 'BTC'
  commission_amount,   -- 0.0003 BTC
  platform_wallet_address, -- Platform BTC wallet
  status               -- 'pending'
);
```

## User Experience

### For Hirer (Payer)
1. Click "Pay Test Taker"
2. See payment details:
   ```
   Total Amount: 0.01 BTC ($650 USD)
   
   Send to this address:
   [QR Code]
   bc1q...xyz
   
   ✓ Test taker receives: 0.0097 BTC (97%)
   ✓ Platform fee: 0.0003 BTC (3%)
   ```
3. Send ONE payment to ONE address
4. Wait for confirmation
5. Done!

### For Test Taker (Receiver)
1. Notification: "Payment initiated"
2. Wait for blockchain confirmation
3. Receive 97% in their wallet automatically
4. Payment confirmed
5. Done!

### For Platform (Us)
1. Automatic 3% commission on every payment
2. Funds go directly to platform wallets
3. No manual intervention needed
4. Track all commissions in database

## Advantages of This Approach

### ✅ Simple for Users
- Hirer pays once to one address
- No complex multi-payment flows
- Clear breakdown of amounts

### ✅ Automatic Split
- CryptAPI handles the forwarding
- No manual splitting needed
- Instant distribution

### ✅ Transparent
- Users see exactly where money goes
- 97% to test taker clearly shown
- 3% platform fee disclosed upfront

### ✅ Secure
- No holding of funds
- Direct wallet-to-wallet transfers
- Blockchain-verified transactions

## Alternative Approach (If CryptAPI Doesn't Support Commission)

If CryptAPI doesn't support automatic commission splitting, we can use a simpler approach:

### Option 1: Two Separate Payments
```
Payment 1: Test Taker (97%)
Send 0.0097 BTC to: [test taker address]

Payment 2: Platform Fee (3%)
Send 0.0003 BTC to: [platform address]
```

### Option 2: Platform Receives Full Amount, Forwards to Test Taker
```
1. Hirer sends 0.01 BTC to platform address
2. Platform receives full amount
3. Platform automatically forwards 97% to test taker
4. Platform keeps 3%
```

## Recommended: CryptAPI Forwarding

The **best approach** is using CryptAPI's built-in forwarding with commission:

```
Hirer → [CryptAPI Address] → Auto-split:
                              ├─ 97% → Test Taker
                              └─ 3% → Platform
```

**Benefits:**
- ✅ One payment for hirer
- ✅ Automatic split
- ✅ No platform custody of funds
- ✅ Instant distribution
- ✅ Transparent and secure

## Implementation Notes

1. **Check CryptAPI Documentation** for commission/forwarding support
2. **If supported**: Use automatic forwarding (recommended)
3. **If not supported**: Implement two-payment flow or platform forwarding
4. **Always show** clear breakdown to users
5. **Track both** test taker and commission payments in database

## Environment Configuration

```env
# Commission rate (3%)
COMMISSION_RATE=0.03

# Platform wallets for each cryptocurrency
PLATFORM_WALLET_BTC=bc1q...
PLATFORM_WALLET_ETH=0x...
PLATFORM_WALLET_DOGE=D...
PLATFORM_WALLET_SOL=...
```

## Database Tracking

Every payment creates TWO records:
1. **Main payment** (full amount, test taker info)
2. **Commission payment** (3%, platform wallet)

Both tracked separately for accounting and transparency.