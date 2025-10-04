# Referral & Rewards System Documentation

## Overview

The Referral & Rewards System allows users to earn bonuses by referring new users to the platform. The system includes unique referral codes, automatic bonus tracking, reward tiers, and milestone bonuses.

## Features

- **Unique Referral Codes**: Each user gets a unique 8-character referral code
- **Referral Tracking**: Track who referred whom with status management
- **Automatic Bonuses**: Referrer and referred users receive automatic bonuses
- **Reward Tiers**: Bronze, Silver, Gold, and Platinum tiers based on referral count
- **Milestone Bonuses**: Special bonuses at 5, 10, 25, and 50 referrals
- **Bonus History**: Complete transaction history for all bonuses earned

## Database Schema

### Tables

#### `referral_codes`
Stores unique referral codes for users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User who owns the code |
| code | VARCHAR(20) | Unique referral code |
| is_active | BOOLEAN | Whether code is active |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `referrals`
Tracks referral relationships.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| referrer_id | UUID | User who referred |
| referred_id | UUID | User who was referred |
| referral_code | VARCHAR(20) | Code used |
| status | VARCHAR(20) | pending/completed/cancelled |
| completed_at | TIMESTAMPTZ | Completion timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `reward_tiers`
Defines reward levels.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(50) | Tier name |
| slug | VARCHAR(50) | Tier slug |
| min_referrals | INTEGER | Minimum referrals |
| max_referrals | INTEGER | Maximum referrals (null for unlimited) |
| bonus_percentage | DECIMAL(5,2) | Bonus percentage |
| description | TEXT | Tier description |

#### `bonus_transactions`
Records all bonus credits awarded.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User receiving bonus |
| amount | DECIMAL(10,2) | Bonus amount |
| type | VARCHAR(50) | Bonus type |
| reason | TEXT | Reason for bonus |
| referral_id | UUID | Related referral (optional) |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `referral_stats`
Aggregated statistics for quick access.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | Primary key |
| total_referrals | INTEGER | Total referrals made |
| completed_referrals | INTEGER | Completed referrals |
| pending_referrals | INTEGER | Pending referrals |
| total_bonus_earned | DECIMAL(10,2) | Total bonuses earned |
| current_tier_id | UUID | Current reward tier |
| updated_at | TIMESTAMPTZ | Last update timestamp |

## Bonus Structure

### Referral Bonuses

- **Referrer Bonus**: $10.00 per successful referral
- **Welcome Bonus**: $5.00 for the referred user

### Milestone Bonuses

| Milestone | Bonus Amount |
|-----------|--------------|
| 5 referrals | $25.00 |
| 10 referrals | $50.00 |
| 25 referrals | $100.00 |
| 50 referrals | $250.00 |

### Reward Tiers

| Tier | Referrals | Bonus Percentage |
|------|-----------|------------------|
| Bronze | 1-5 | 5% |
| Silver | 6-15 | 10% |
| Gold | 16-30 | 15% |
| Platinum | 31+ | 20% |

## API Endpoints

### GET /api/referrals/code
Get or generate user's referral code.

**Response:**
```json
{
  "code": {
    "id": "uuid",
    "user_id": "uuid",
    "code": "ABC12345",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/referrals/track
Track a new referral.

**Request:**
```json
{
  "referralCode": "ABC12345"
}
```

**Response:**
```json
{
  "referral": {
    "id": "uuid",
    "referrer_id": "uuid",
    "referred_id": "uuid",
    "referral_code": "ABC12345",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/referrals/stats
Get user's referral statistics.

**Response:**
```json
{
  "stats": {
    "user_id": "uuid",
    "total_referrals": 10,
    "completed_referrals": 8,
    "pending_referrals": 2,
    "total_bonus_earned": "105.00",
    "current_tier_id": "uuid"
  },
  "tier": {
    "name": "Silver",
    "slug": "silver",
    "bonus_percentage": "10.00",
    "min_referrals": 6,
    "max_referrals": 15
  }
}
```

### GET /api/referrals/history
Get user's referral history.

**Query Parameters:**
- `status` (optional): Filter by status (pending/completed/cancelled)
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
{
  "history": [
    {
      "id": "uuid",
      "referrer_id": "uuid",
      "referred_id": "uuid",
      "referral_code": "ABC12345",
      "status": "completed",
      "completed_at": "2024-01-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/referrals/rewards
Get all reward tiers.

**Response:**
```json
{
  "tiers": [
    {
      "id": "uuid",
      "name": "Bronze",
      "slug": "bronze",
      "min_referrals": 1,
      "max_referrals": 5,
      "bonus_percentage": "5.00",
      "description": "First tier - 5% bonus on earnings"
    }
  ]
}
```

### GET /api/referrals/bonuses
Get user's bonus transactions.

**Query Parameters:**
- `type` (optional): Filter by type (referral_bonus/welcome_bonus/milestone_bonus/tier_bonus)
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
{
  "bonuses": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": "10.00",
      "type": "referral_bonus",
      "reason": "Referral bonus for successful referral",
      "referral_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Service Layer Functions

### `generateReferralCode(userId)`
Generate or retrieve a unique referral code for a user.

### `getReferralCode(userId)`
Get user's existing referral code.

### `trackReferral(referralCode, referredUserId)`
Track a new referral relationship.

### `completeReferral(referralId)`
Complete a referral and award bonuses.

### `calculateBonus(referrerId, referredId, role)`
Calculate bonus amount for referrer or referred user.

### `awardBonus(userId, amount, type, reason, referralId?)`
Award a bonus to a user.

### `getReferralStats(userId)`
Get aggregated referral statistics for a user.

### `getRewardTier(userId)`
Get user's current reward tier based on completed referrals.

### `getReferralHistory(userId, options?)`
Get user's referral history with optional filters.

### `getBonusTransactions(userId, options?)`
Get user's bonus transaction history with optional filters.

### `getRewardTiers()`
Get all available reward tiers.

## Database Triggers

### `update_referral_stats()`
Automatically updates referral statistics when a referral is created or updated.

### `update_bonus_totals()`
Automatically updates total bonus earned when a bonus transaction is created.

## Usage Example

```javascript
import {
  generateReferralCode,
  trackReferral,
  completeReferral,
  getReferralStats
} from '$lib/services/referral.js';

// Generate referral code for user
const code = await generateReferralCode(userId);
console.log(`Your referral code: ${code.code}`);

// Track a referral
const referral = await trackReferral('ABC12345', newUserId);

// Complete the referral (award bonuses)
await completeReferral(referral.id);

// Get stats
const stats = await getReferralStats(userId);
console.log(`Total referrals: ${stats.total_referrals}`);
console.log(`Total bonuses: $${stats.total_bonus_earned}`);
```

## Testing

Run the comprehensive test suite:

```bash
pnpm test tests/services/referral.test.js
```

The test suite includes:
- Referral code generation and uniqueness
- Referral tracking with validation
- Bonus calculation and awarding
- Referral completion workflow
- Statistics tracking
- Reward tier progression
- Milestone bonus awarding
- Error handling and edge cases

## Security

- All API endpoints require authentication
- Row Level Security (RLS) policies enforce data access
- Users can only view their own referral data
- Referral codes are unique and validated
- Self-referrals are prevented
- Duplicate referrals are prevented

## Future Enhancements

- Email notifications for referral events
- Social sharing integration
- Referral leaderboard
- Custom referral campaigns
- Referral analytics dashboard
- Tier progression notifications