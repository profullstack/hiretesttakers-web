# Enhanced Payment & Commission System

## Overview

The Enhanced Payment & Commission System extends the basic payment functionality with configurable commission rates, multiple payment methods, refund management, and earnings tracking.

## Features Implemented

### 1. Configurable Commission Rates by Service Type

**Default Rates:**
- Homework Help: 15%
- Programming Help: 20%
- Assignment Writing: 15%
- Test Taking: 25%

**Database Tables:**
- `commission_rates` - Stores configurable rates per service type
- Enhanced `payments` table with `service_type` column

### 2. Payment Method Management

**Supported Methods:**
- Crypto Wallets (BTC, ETH, DOGE, SOL)
- PayPal
- Bank Transfer

**Database Tables:**
- `payment_methods` - User payment methods
- Support for default payment method selection

### 3. Refund System

**Features:**
- Request refunds with reason
- Track refund status (pending, approved, rejected, processed)
- Admin refund processing
- Automatic payment marking as refunded

**Database Tables:**
- `refunds` - Refund requests and processing

### 4. Earnings Summary

**Features:**
- Automatic calculation of earnings by period
- Track total earned, paid, pending, and refunded amounts
- Services completed count
- Average service value

**Database Tables:**
- `earnings_summary` - Aggregated earnings data
- Automatic updates via database triggers

## API Endpoints

### Commission Rates
- `GET /api/payments/commission-rates` - Get all commission rates

### Payment Methods
- `GET /api/payments/methods` - Get user's payment methods
- `POST /api/payments/methods` - Add new payment method
- `PUT /api/payments/methods/[id]` - Set as default
- `DELETE /api/payments/methods/[id]` - Delete payment method

### Refunds
- `POST /api/payments/refunds` - Request a refund
- `GET /api/payments/refunds/[id]` - Get refund status

### Earnings
- `GET /api/payments/earnings?start_date=...&end_date=...` - Get earnings summary

## Service Layer Functions

### [`payment-enhanced.js`](../src/lib/services/payment-enhanced.js)

**Commission Calculation:**
- `calculateCommissionByServiceType(amount, serviceType)` - Calculate commission split
- `splitPayment(paymentId)` - Split payment between platform and provider

**Refund Management:**
- `requestRefund(params)` - Create refund request
- `getRefundStatus(refundId)` - Get refund details
- `processRefund(refundId, updates)` - Process refund (admin)

**Earnings:**
- `getEarningsSummary(userId, startDate, endDate)` - Get earnings for period

**Payment Methods:**
- `addPaymentMethod(params)` - Add payment method
- `getPaymentMethods(userId)` - Get all payment methods
- `setDefaultPaymentMethod(userId, methodId)` - Set default
- `deletePaymentMethod(userId, methodId)` - Delete method

**Utility:**
- `getCommissionRates()` - Get all commission rates

## Database Schema

### New Tables

```sql
-- Commission rates by service type
CREATE TABLE commission_rates (
  id UUID PRIMARY KEY,
  service_type service_type NOT NULL UNIQUE,
  rate NUMERIC(5, 4) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- User payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  method_type TEXT NOT NULL,
  cryptocurrency TEXT,
  wallet_address TEXT,
  paypal_email TEXT,
  bank_details JSONB,
  is_default BOOLEAN,
  is_verified BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Refund requests
CREATE TABLE refunds (
  id UUID PRIMARY KEY,
  payment_id UUID NOT NULL,
  requester_id UUID NOT NULL,
  amount NUMERIC(20, 8),
  cryptocurrency TEXT,
  usd_equivalent NUMERIC(10, 2),
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  admin_notes TEXT,
  refund_address TEXT,
  refund_transaction_hash TEXT,
  requested_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- Earnings summary
CREATE TABLE earnings_summary (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  total_earned NUMERIC(10, 2),
  total_paid NUMERIC(10, 2),
  total_pending NUMERIC(10, 2),
  total_refunded NUMERIC(10, 2),
  services_completed INTEGER,
  average_service_value NUMERIC(10, 2),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Enhanced Tables

```sql
-- Added to payments table
ALTER TABLE payments
ADD COLUMN service_type service_type,
ADD COLUMN payment_method_id UUID,
ADD COLUMN refunded BOOLEAN,
ADD COLUMN refunded_at TIMESTAMPTZ;
```

## Database Functions

### Commission Calculation
```sql
get_commission_rate_for_service(service_type) - Get rate for service type
calculate_earnings_for_period(user_id, start_date, end_date) - Calculate earnings
```

### Automatic Updates
- `update_earnings_summary()` - Trigger function to update earnings on payment changes

## Testing

### Test Coverage
- 34 comprehensive tests covering all functionality
- All tests passing with Vitest
- Mock-based testing for database operations

### Test File
- [`tests/services/payment-enhanced.test.js`](../tests/services/payment-enhanced.test.js)

## Usage Examples

### Calculate Commission
```javascript
import { calculateCommissionByServiceType } from '$lib/services/payment-enhanced.js';

const result = calculateCommissionByServiceType(100, 'homework_help');
// {
//   totalAmount: 100,
//   commissionRate: 0.15,
//   commissionAmount: 15,
//   serviceProviderAmount: 85
// }
```

### Request Refund
```javascript
import { requestRefund } from '$lib/services/payment-enhanced.js';

const refund = await requestRefund({
  paymentId: 'payment-123',
  requesterId: 'user-123',
  reason: 'Service not satisfactory'
});
```

### Get Earnings Summary
```javascript
import { getEarningsSummary } from '$lib/services/payment-enhanced.js';

const summary = await getEarningsSummary(
  'user-123',
  '2024-01-01',
  '2024-01-31'
);
```

### Add Payment Method
```javascript
import { addPaymentMethod } from '$lib/services/payment-enhanced.js';

const method = await addPaymentMethod({
  userId: 'user-123',
  methodType: 'crypto_wallet',
  cryptocurrency: 'BTC',
  walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
});
```

## Migration

Migration file: [`supabase/migrations/20251004201515_enhanced_payment_system.sql`](../supabase/migrations/20251004201515_enhanced_payment_system.sql)

To apply:
```bash
pnpx supabase db push
```

## Next Steps

1. **UI Components** - Create Svelte components for:
   - Payment method management
   - Refund request forms
   - Earnings dashboard
   - Commission display

2. **Pages** - Create pages for:
   - `/payments/methods` - Manage payment methods
   - `/payments/earnings` - Earnings dashboard
   - `/payments/history` - Enhanced payment history

3. **E2E Tests** - Test complete payment flows

4. **Admin Interface** - For processing refunds and managing commission rates

## Design Principles

- **KISS** - Simple, focused functionality
- **DRY** - Reusable service functions
- **TDD** - Tests written first, all passing
- **Security** - RLS policies on all tables
- **Performance** - Database triggers for automatic updates

## Status

✅ **COMPLETE** - Core functionality implemented and tested
- Database schema ✅
- Service layer ✅
- API routes ✅
- Tests ✅

🚧 **IN PROGRESS** - UI components and pages
⏳ **PENDING** - E2E tests and admin interface