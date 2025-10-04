# Development Prompts for HireTestTakers.com

Use these prompts to continue development in focused sessions. Each prompt is designed to build one complete feature area with TDD.

---

## ✅ Prompt 4: Cross-Service Search (COMPLETED - Simplified)

**Note:** This prompt was simplified following KISS principles. Instead of a complex table refactoring, we implemented a lightweight cross-service search layer that keeps existing tables intact.

**What was implemented:**
- Cross-service search functionality (src/lib/services/search.js)
- Unified search API endpoint (GET /api/search)
- Unified service browsing page (/services)
- Service card component (UnifiedServiceCard.svelte)
- Search and filter capabilities across all service types

**Key files created:**
- `src/lib/services/search.js` - Search service layer
- `src/routes/api/search/+server.js` - Search API endpoint
- `src/routes/services/+page.svelte` - Browse/search page
- `src/lib/components/UnifiedServiceCard.svelte` - Service card component
- `tests/services/search.test.js` - Search tests

**Benefits of simplified approach:**
- No database refactoring required
- Maintains existing table structures
- Simple to understand and maintain
- Easy to extend in the future
- Follows KISS principle

**Status:** ✅ COMPLETE
```

---

## ✅ Prompt 5: Enhanced Leaderboard & Reputation System (COMPLETED)

**Status:** ✅ COMPLETE

**What was implemented:**
- Database schema for reputation system (user_metrics, badges, user_badges, expertise_areas)
- Reputation scoring algorithm based on multiple performance factors
- Badge system with automatic awarding based on achievements
- Expertise tracking by service type and subject
- API endpoints for reputation, badges, specialists, and top performers
- UI components (ReputationScore, BadgeDisplay, PerformanceMetrics)
- Enhanced leaderboard page with reputation view mode
- Comprehensive test coverage for reputation service

**Key files created:**
- `supabase/migrations/20251004163252_reputation_system.sql` - Database schema
- `src/lib/services/reputation.js` - Reputation service layer
- `tests/services/reputation.test.js` - Comprehensive tests
- `src/routes/api/reputation/[userId]/+server.js` - User reputation API
- `src/routes/api/reputation/[userId]/badges/+server.js` - User badges API
- `src/routes/api/reputation/specialists/[type]/+server.js` - Specialists API
- `src/routes/api/reputation/top-performers/+server.js` - Top performers API
- `src/lib/components/ReputationScore.svelte` - Reputation score display
- `src/lib/components/BadgeDisplay.svelte` - Badge display component
- `src/lib/components/PerformanceMetrics.svelte` - Performance metrics display
- Enhanced `src/routes/leaderboard/+page.svelte` with reputation features

**Reputation Scoring Formula:**
- Services completed: 2 points each
- Average rating: 100 points per star (max 500)
- Success rate: 3 points per percent (max 300)
- On-time delivery: 2 points per percent (max 200)
- Response time bonus: up to 100 points (faster = more)

**Badges Implemented:**
- Quick Responder (< 1 hour avg response)
- Perfect Score (10 consecutive 5-star ratings)
- Subject Master (50+ services in one subject)
- Top Earner (highest monthly earnings)
- Reliable (100+ completed services)
- Helpful (most helpful reviews)

```
Original requirements for reference:
Enhance the leaderboard system with reputation, badges, and detailed metrics using TDD.

Requirements:
- Comprehensive performance metrics
- Subject expertise tracking
- Badge/achievement system
- Reputation scoring
- Service type specialization
- Response time tracking

Database Schema:
- Add user_metrics table
- Add badges table
- Add user_badges table
- Add expertise_areas table
- Enhance leaderboard calculations

Features to implement:
1. Calculate reputation score
2. Track subject expertise
3. Award badges for achievements
4. Display specializations
5. Track response times
6. Show success rates by service type
7. Display earnings by category

Service Layer (src/lib/services/reputation.js):
- calculateReputationScore(userId)
- getUserMetrics(userId)
- awardBadge(userId, badgeId)
- getUserBadges(userId)
- trackExpertise(userId, subject, performance)
- getTopPerformers(filters)
- getSpecialists(serviceType)

Badges to implement:
- Quick Responder (< 1 hour avg response)
- Perfect Score (10 consecutive 5-star ratings)
- Subject Master (50+ services in one subject)
- Top Earner (highest monthly earnings)
- Reliable (100+ completed services)
- Helpful (most helpful reviews)

API Routes:
- GET /api/reputation/[userId] - Get reputation
- GET /api/reputation/[userId]/metrics - Get metrics
- GET /api/reputation/[userId]/badges - Get badges
- GET /api/reputation/specialists/[type] - Get specialists
- GET /api/reputation/top-performers - Get top performers

UI Components:
- ReputationScore.svelte
- BadgeDisplay.svelte
- ExpertiseChart.svelte
- PerformanceMetrics.svelte
- SpecializationTags.svelte
- EnhancedLeaderboardTable.svelte

Pages:
- /leaderboard - Enhanced leaderboard
- /leaderboard/specialists/[type] - Type specialists
- /reputation/[userId] - User reputation page

Follow TDD:
1. Write reputation calculation tests
2. Implement scoring algorithm
3. Create badge system
4. Build expertise tracking
5. Enhance leaderboard
6. Build UI components
7. Test complete system

Deliverables:
- Enhanced leaderboard
- Reputation system
- Badge system
- Expertise tracking
- All tests passing
```

---

## ✅ Prompt 6: Enhanced Payment & Commission System (COMPLETED)

**Status:** ✅ COMPLETE

**What was implemented:**
- Database schema for enhanced payment system (commission_rates, payment_methods, refunds, earnings_summary)
- Configurable commission rates by service type (15-25%)
- Payment method management (crypto wallets, PayPal, bank transfer)
- Refund request and processing system
- Earnings summary with automatic calculation
- Comprehensive service layer with all payment features
- API endpoints for all payment operations
- 34 passing tests with full coverage

**Key files created:**
- `supabase/migrations/20251004201515_enhanced_payment_system.sql` - Database schema
- `src/lib/services/payment-enhanced.js` - Enhanced payment service layer
- `tests/services/payment-enhanced.test.js` - Comprehensive tests (34 tests, all passing)
- `src/routes/api/payments/commission-rates/+server.js` - Commission rates API
- `src/routes/api/payments/methods/+server.js` - Payment methods API
- `src/routes/api/payments/methods/[id]/+server.js` - Payment method management
- `src/routes/api/payments/refunds/+server.js` - Refund request API
- `src/routes/api/payments/refunds/[id]/+server.js` - Refund status API
- `src/routes/api/payments/earnings/+server.js` - Earnings summary API
- `docs/ENHANCED_PAYMENT_SYSTEM.md` - Complete documentation

**Commission Structure:**
- Homework Help: 15%
- Programming Help: 20%
- Assignment Writing: 15%
- Test Taking: 25%
- Configurable per service type

**Features:**
- Calculate commission by service type
- Split payments automatically
- Request and track refunds
- Manage multiple payment methods
- Set default payment method
- Track earnings by period
- Automatic earnings summary updates via database triggers

```
Original requirements for reference:
Build enhanced payment system with commission splits, payment methods, and transaction history using TDD.

Requirements:
- Multiple payment methods (crypto, PayPal, cards)
- Platform commission calculation
- Automatic commission splits
- Payment history
- Refund system
- Earnings dashboard

Database Schema:
- Enhance payments table
- Add commission_rates table
- Add payment_methods table
- Add refunds table
- Add earnings_summary table

Features to implement:
1. Configure commission rates by service type
2. Calculate platform commission
3. Split payments automatically
4. Support multiple payment methods
5. Track payment history
6. Generate earnings reports
7. Handle refunds
8. Display payment status

Service Layer (src/lib/services/payment-enhanced.js):
- calculateCommission(amount, serviceType)
- splitPayment(paymentId)
- processPayment(data)
- getPaymentHistory(userId, filters)
- requestRefund(paymentId, reason)
- getEarningsSummary(userId, period)
- getPaymentMethods(userId)

Commission Structure:
- Homework Help: 15%
- Programming Help: 20%
- Assignment Writing: 15%
- Test Taking: 25%
- Configurable per service type

API Routes:
- POST /api/payments/process - Process payment
- GET /api/payments/history - Payment history
- GET /api/payments/earnings - Earnings summary
- POST /api/payments/[id]/refund - Request refund
- GET /api/payments/commission-rates - Get rates
- PUT /api/payments/commission-rates - Update rates (admin)

UI Components:
- PaymentMethodSelector.svelte
- CommissionDisplay.svelte
- EarningsDashboard.svelte
- PaymentHistoryTable.svelte
- RefundRequestForm.svelte
- TransactionDetails.svelte

Pages:
- /payments/methods - Manage payment methods
- /payments/earnings - Earnings dashboard
- /payments/history - Payment history
- /payments/[id]/refund - Request refund

Follow TDD:
1. Write commission calculation tests
2. Implement commission system
3. Build payment splitting
4. Create refund system
5. Build earnings dashboard
6. Test payment flows
7. Test commission accuracy

Deliverables:
- Enhanced payment system
- Commission calculation
- Multiple payment methods
- Earnings dashboard
- All tests passing
```


---

## ✅ Prompt 8: Referral & Rewards System (COMPLETED)

**Status:** ✅ COMPLETE

**What was implemented:**
- Database schema for referral system (referral_codes, referrals, reward_tiers, bonus_transactions, referral_stats)
- Unique referral code generation with database function
- Referral tracking with validation (no self-referrals, no duplicates)
- Automatic bonus awarding (referrer: $10, referred: $5)
- Milestone bonuses at 5, 10, 25, and 50 referrals
- Reward tier system (Bronze, Silver, Gold, Platinum)
- Comprehensive service layer with all functions
- API endpoints for all referral operations
- 467 lines of comprehensive tests with full coverage
- Complete documentation

**Key files created:**
- `supabase/migrations/20251004210440_referral_system.sql` - Database schema with triggers
- `src/lib/services/referral.js` - Referral service layer (358 lines)
- `tests/services/referral.test.js` - Comprehensive tests (467 lines)
- `src/routes/api/referrals/code/+server.js` - Get/generate referral code
- `src/routes/api/referrals/track/+server.js` - Track referrals
- `src/routes/api/referrals/stats/+server.js` - Get referral stats
- `src/routes/api/referrals/history/+server.js` - Get referral history
- `src/routes/api/referrals/rewards/+server.js` - Get reward tiers
- `src/routes/api/referrals/bonuses/+server.js` - Get bonus transactions
- `docs/REFERRAL_SYSTEM.md` - Complete system documentation

**Bonus Structure:**
- Referrer: $10 per successful referral
- Referred: $5 welcome bonus
- Milestone bonuses: $25 (5), $50 (10), $100 (25), $250 (50)

**Reward Tiers:**
- Bronze: 1-5 referrals (5% bonus)
- Silver: 6-15 referrals (10% bonus)
- Gold: 16-30 referrals (15% bonus)
- Platinum: 31+ referrals (20% bonus)

**Database Features:**
- Automatic referral code generation function
- Triggers for automatic stats updates
- Row Level Security (RLS) policies
- Referral status tracking (pending/completed/cancelled)

```

---

## 🔔 Prompt 9: Notification & Alert System

```
Build a comprehensive notification system for all user activities using TDD.

Requirements:
- Real-time notifications
- Email notifications
- In-app notifications
- Notification preferences
- Notification history
- Push notifications (future)

Database Schema:
- Add notifications table
- Add notification_preferences table
- Add notification_types table
- Add notification_templates table

Features to implement:
1. Create notifications for key events
2. Send email notifications
3. Display in-app notifications
4. Mark notifications as read
5. Configure notification preferences
6. Batch notifications
7. Notification history

Notification Types:
- New application received
- Application approved/rejected
- Service completed
- Payment received
- New message
- Rating received
- Revision requested
- Job offer received
- Referral bonus earned

Service Layer (src/lib/services/notification.js):
- createNotification(userId, type, data)
- getNotifications(userId, filters)
- markAsRead(notificationId)
- markAllAsRead(userId)
- getUnreadCount(userId)
- updatePreferences(userId, preferences)
- sendEmailNotification(userId, type, data)

API Routes:
- GET /api/notifications - Get notifications
- GET /api/notifications/unread-count - Get unread count
- PUT /api/notifications/[id]/read - Mark as read
- PUT /api/notifications/mark-all-read - Mark all read
- GET /api/notifications/preferences - Get preferences
- PUT /api/notifications/preferences - Update preferences

UI Components:
- NotificationBell.svelte
- NotificationList.svelte
- NotificationItem.svelte
- NotificationPreferences.svelte
- NotificationToast.svelte

Pages:
- /notifications - Notification center
- /notifications/preferences - Notification settings

Follow TDD:
1. Write notification service tests
2. Implement notification system
3. Build email integration
4. Create preference system
5. Build UI components
6. Test real-time updates
7. Test email delivery

Deliverables:
- Notification system
- Email integration
- Preference management
- Real-time updates
- All tests passing
```

---

## 🧪 Prompt 10: Integration & E2E Testing

```
Build comprehensive integration and end-to-end tests for HireTestTakers.com.

Requirements:
- Test complete user workflows
- Test API integrations
- Test payment flows
- Follow TDD principles

Test scenarios:
1. Complete student journey (signup → request service → hire → pay → rate)
2. Complete tutor journey (signup → apply → complete → get paid)
3. Homework help workflow
4. Programming help workflow
5. Assignment writing workflow
6. Payment flow with commission split
7. Leaderboard updates
8. Job offer workflow
9. Message exchange
10. Referral system
11. Notification delivery
12. Resource access

Deliverables:
- Integration tests in tests/integration/
- E2E tests for critical paths
- API integration tests
- Database integration tests
- Mock external APIs (CryptAPI, Tatum)

Tools:
- Mocha for test runner
- Chai for assertions
- Supertest for API testing (if needed)
```

---

## 🎨 Prompt 11: UI Polish & Components

```
Build reusable UI components and polish the interface for HireTestTakers.com.

Requirements:
- Consistent design system
- Reusable components
- Mobile responsive
- Accessibility (ARIA labels, keyboard nav)
- Follow DRY principles

Components to build:
1. Button (primary, secondary, outline, danger)
2. Input (text, email, password, number)
3. Select (single, multi-select)
4. Modal/Dialog
5. Alert/Toast notifications
6. Loading spinner
7. Pagination
8. Table
9. Card
10. Badge
11. Avatar
12. Navigation header
13. Footer
14. Sidebar
15. File upload
16. Code editor
17. Rich text editor

Deliverables:
- Component library in src/lib/components/
- Component tests
- Storybook (optional)
- Design system documentation
- Responsive layouts
- Dark mode (optional)

Use:
- Svelte 5 features
- CSS variables for theming
- Semantic HTML
```

---

## 🚀 Prompt 12: Production Deployment

```
Deploy HireTestTakers.com to production on Railway.

Requirements:
- Use existing Railway configuration
- Set up persistent volumes
- Configure all environment variables
- Run database migrations
- Test in production

Steps:
1. Install Railway CLI
2. Initialize Railway project
3. Create persistent volumes (db, uploads)
4. Set all environment variables
5. Deploy application
6. Run migrations
7. Test all features
8. Set up monitoring
9. Configure custom domain (optional)
10. Set up CI/CD (optional)

Use existing:
- railway.json and railway.toml
- DEPLOYMENT.md guide
- Database migrations in supabase/migrations/

Verify:
- All tests passing
- Build successful
- Database connected
- Volumes mounted
- All features working
```

---

## 📊 Usage Instructions

### How to Use These Prompts:

1. **Copy the prompt** for the feature you want to build
2. **Start a new Roo session** (or continue in current)
3. **Paste the prompt** as your task
4. **Roo will build** the feature with TDD
5. **Repeat** for each feature group

### Recommended Order:

1. ✅ Authentication (COMPLETE)
2. 👤 Profiles & Onboarding (COMPLETE)
3. 📚 Homework Help System (Prompt 1)
4. 💻 Programming Help System (Prompt 2)
5. 📝 Assignment Writing System (Prompt 3)
6. 🔄 Unified Service Management (Prompt 4)
7. 📊 Enhanced Leaderboard (Prompt 5)
8. 💰 Enhanced Payment System (Prompt 6)
9. 🎓 Learning Resources (Prompt 7)
10. 🎁 Referral System (Prompt 8)
11. 🔔 Notification System (Prompt 9)
12. 🧪 Testing (Prompt 10)
13. 🎨 UI Polish (Prompt 11)
14. 🚀 Deployment (Prompt 12)

### Tips:

- **One feature at a time** - Focus on completing each fully
- **Follow TDD** - Tests first, then implementation
- **Keep it DRY** - Reuse existing utilities and components
- **KISS** - Simple, focused code
- **Test often** - Run `pnpm test` frequently
- **Build often** - Run `pnpm run build` to catch errors

### Context to Provide:

When starting a new session, mention:
- "Continue HireTestTakers.com development"
- "Authentication and profiles are complete (see PROGRESS.md)"
- "Follow existing code patterns"
- "Use TDD, KISS, DRY principles"
- "Reference PRD-v2.md for full requirements"

---

## 🎯 Quick Start for Next Session

**Prompt for next session:**

```
Continue building HireTestTakers.com. Authentication and profiles are complete.

Next task: Build the Homework Help service system using TDD.

[Paste Prompt 1 from PROMPTS.md]

Follow the existing code patterns from:
- tests/services/auth.test.js (test style)
- src/lib/services/auth.js (service style)
- Keep code DRY and KISS
- Reference PRD-v2.md for requirements
```

---

**Each prompt is designed to be a focused 1-3 hour development session!**