# Development Prompts for HireTestTakers.com

Use these prompts to continue development in focused sessions. Each prompt is designed to build one complete feature area with TDD.

---

## 👤 Prompt 2: User Profiles & Onboarding

```
Build the user profile and onboarding system for HireTestTakers.com using TDD.

Requirements:
- User profile management with avatar upload
- Public profile pages
- Settings page for profile updates
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Profile page (/profile) - edit mode
2. Public profile (/u/[username]) - view mode
3. Settings page (/settings)
4. Avatar upload functionality
5. Profile API routes

Database tables already exist:
- users (with avatar_url, full_name, user_type, bio)
- Supabase Storage for avatars

Deliverables:
- Tests for profile service
- Profile service implementation
- Profile pages
- Avatar upload component
- API routes for profile management

Use existing utilities:
- src/lib/supabaseClient.js for database access
```

---

## 📝 Prompt 3: Test Listings CRUD

```
Build the test listing system for HireTestTakers.com using TDD.

Requirements:
- Full CRUD for test listings
- Price in cryptocurrency (single or range)
- USD equivalent display using Tatum exchange rates
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Browse tests page (/tests)
2. Create test page (/tests/new)
3. Test details page (/tests/[id])
4. Edit test page (/tests/[id]/edit)
5. My tests page (/tests/my-tests)
6. Test filtering and search
7. Test API routes

Database tables already exist:
- tests table with RLS policies
- Supports BTC, ETH, DOGE, SOL
- Price can be fixed or range

Deliverables:
- Tests for test service
- Test service implementation
- Test CRUD API routes
- Test listing pages
- TestCard component
- TestForm component
- TestFilters component
- PriceInput component (with USD conversion)

Use existing services:
- src/lib/services/tatum.js for exchange rates
- src/lib/utils/commission.js for price calculations
```

---

## 📋 Prompt 4: Application System

```
Build the application workflow for HireTestTakers.com using TDD.

Requirements:
- Test takers can apply to tests
- Hirers can approve/reject/hire applicants
- Application status tracking
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Apply to test page (/tests/[id]/apply)
2. My applications page (/applications)
3. View applicants page (/tests/[id]/applicants)
4. Application management
5. Status updates (pending, approved, rejected, hired)
6. Application API routes

Database tables already exist:
- applications table with RLS policies
- Status enum: pending, approved, rejected, hired
- Unique constraint (one application per test per user)

Deliverables:
- Tests for application service
- Application service implementation
- Application API routes
- Application pages
- ApplicationForm component
- ApplicationCard component
- ApplicantCard component

Integration points:
- Links to messaging system
- Triggers payment flow when hired
```

---

## 💬 Prompt 5: Messaging System

```
Build the messaging system for HireTestTakers.com using TDD.

Requirements:
- Direct messaging between hirers and test takers
- Messages linked to applications
- Real-time or near-real-time updates
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Message inbox (/messages)
2. Conversation view (/messages/[applicationId])
3. Send messages
4. Mark messages as read
5. Message notifications
6. Messaging API routes

Database tables already exist:
- messages table with RLS policies
- Linked to applications
- Read/unread status

Deliverables:
- Tests for messaging service
- Messaging service implementation
- Messaging API routes
- Message pages
- MessageList component
- MessageThread component
- MessageInput component
- ConversationList component

Optional enhancement:
- Supabase Realtime for live updates
```

---

## 💰 Prompt 6: Payment System UI

```
Build the payment UI for HireTestTakers.com using TDD.

Requirements:
- Payment initiation when test is completed
- QR code display for crypto payments
- Payment status tracking
- 3% commission automatically handled
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Payment initiation page (/payments/[testId])
2. Payment status page (/payments/[id]/status)
3. Payment history page (/payments/history)
4. QR code generation
5. Payment webhook handler
6. Payment API routes

Database tables already exist:
- payments table with commission fields
- commission_payments table
- Automatic commission calculation triggers

Services already implemented:
- src/lib/services/cryptapi.js (payment address generation)
- src/lib/services/tatum.js (exchange rates)
- src/lib/utils/commission.js (commission calculation)

Deliverables:
- Tests for payment UI logic
- Payment API routes
- Payment pages
- PaymentForm component
- QRCode component
- PaymentStatus component
- PaymentHistory component
- Webhook handler (/api/webhooks/cryptapi)

Use existing:
- CryptAPI service for address generation
- Tatum service for USD conversion
- Commission utilities for calculations
```

---

## 🏆 Prompt 7: Leaderboard & Ratings

```
Build the leaderboard and rating system for HireTestTakers.com using TDD.

Requirements:
- Public leaderboard of top test takers
- Sortable by multiple metrics
- Privacy controls (opt-in/opt-out)
- Post-test rating system
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Leaderboard page (/leaderboard)
2. Leaderboard sorting and filtering
3. Rating submission after test completion
4. Rating display on profiles
5. Leaderboard API routes

Database tables already exist:
- test_taker_stats (with all metrics)
- ratings table
- leaderboard view (pre-configured)
- Automatic stat updates via triggers

Deliverables:
- Tests for leaderboard queries
- Leaderboard API routes
- Leaderboard page
- LeaderboardTable component
- LeaderboardFilters component
- RatingForm component
- UserStatsCard component

Features:
- Sort by: tests completed, success rate, rating, earnings
- Filter by: location, skills, languages
- Privacy: only show users with show_on_leaderboard=true
```

---

## 💼 Prompt 8: Job Offers System

```
Build the job offers system for HireTestTakers.com using TDD.

Requirements:
- Employers can make direct job offers to test takers
- "Hire Me" button on leaderboard profiles
- Offer management workflow
- Follow TDD, KISS, and DRY principles

Features to implement:
1. Job offers page (/job-offers)
2. Job offer details (/job-offers/[id])
3. Create job offer (from leaderboard)
4. Accept/reject offers
5. Offer expiration
6. Job offer API routes

Database tables already exist:
- job_offers table with RLS policies
- Status: pending, accepted, rejected, withdrawn, expired
- Employment types: full_time, part_time, contract, freelance
- Auto-expire trigger

Deliverables:
- Tests for job offer service
- Job offer API routes
- Job offer pages
- JobOfferForm component
- JobOfferCard component
- HireMeButton component
- Offer status management

Integration:
- Link from leaderboard profiles
- Require employer account
- Email notifications (optional)
```

---

## 🧪 Prompt 9: Integration & E2E Testing

```
Build comprehensive integration and end-to-end tests for HireTestTakers.com.

Requirements:
- Test complete user workflows
- Test API integrations
- Test payment flows
- Follow TDD principles

Test scenarios:
1. Complete hirer journey (signup → post test → hire → pay)
2. Complete test taker journey (signup → apply → complete → get paid)
3. Payment flow with commission split
4. Leaderboard updates
5. Job offer workflow
6. Message exchange
7. Avatar upload

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

## 🎨 Prompt 10: UI Polish & Components

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

## 🚀 Prompt 11: Production Deployment

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
2. 👤 Profiles & Onboarding (Prompt 2)
3. 📝 Test Listings (Prompt 3)
4. 📋 Applications (Prompt 4)
5. 💬 Messaging (Prompt 5)
6. 💰 Payments UI (Prompt 6)
7. 🏆 Leaderboard (Prompt 7)
8. 💼 Job Offers (Prompt 8)
9. 🧪 Testing (Prompt 9)
10. 🎨 UI Polish (Prompt 10)
11. 🚀 Deployment (Prompt 11)

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
- "Authentication is complete (see PROGRESS.md)"
- "Follow existing code patterns"
- "Use TDD, KISS, DRY principles"

---

## 🎯 Quick Start for Next Session

**Prompt for next session:**

```
Continue building HireTestTakers.com. Authentication is complete.

Next task: Build the user profiles and onboarding system using TDD.

[Paste Prompt 2 from PROMPTS.md]

Follow the existing code patterns from:
- tests/services/auth.test.js (test style)
- src/lib/services/auth.js (service style)
- Keep code DRY and KISS
```

---

**Each prompt is designed to be a focused 1-2 hour development session!**