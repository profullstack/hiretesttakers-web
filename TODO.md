# HireTestTakers.com - Development TODO

## Project Status: Planning Phase

This document tracks all development tasks for the HireTestTakers.com platform. Tasks are organized by feature area and priority.

---

## Phase 1: Project Foundation

### 1.1 Project Setup
- [ ] Initialize SvelteKit project with `pnpm create svelte@latest`
- [ ] Configure `package.json` with proper scripts
- [ ] Set up `.gitignore` for Node.js/SvelteKit
- [ ] Create `.env.example` template
- [ ] Install core dependencies (SvelteKit, Supabase client)
- [ ] Configure `svelte.config.js` for adapter and preprocessing

### 1.2 Development Tools Configuration
- [ ] Set up ESLint configuration (`.eslintrc.cjs`)
- [ ] Set up Prettier configuration (`.prettierrc`)
- [ ] Configure `.editorconfig` for consistent formatting
- [ ] Add pre-commit hooks with husky (optional)
- [ ] Create npm scripts for linting and formatting

### 1.3 Supabase Setup (Self-Hosted with Docker)
- [ ] Clone Supabase Docker repository
- [ ] Configure `docker-compose.yml` for local setup
- [ ] Start Supabase services with Docker (`docker compose up -d`)
- [ ] Initialize Supabase CLI (`pnpx supabase init`)
- [ ] Configure Supabase connection in `.env`
- [ ] Create Supabase client utility (`src/lib/supabaseClient.js`)
- [ ] Set up Supabase types/helpers
- [ ] Create database backup/restore scripts
- [ ] Add `db:export` script to package.json
- [ ] Add `db:import` script to package.json

### 1.4 Testing Infrastructure
- [ ] Install Mocha and Chai (`pnpm add -D mocha chai`)
- [ ] Create test directory structure (`tests/`)
- [ ] Configure Mocha test runner (`.mocharc.json`)
- [ ] Add test scripts to `package.json`
- [ ] Create sample test to verify setup

---

## Phase 2: Database Schema & Migrations

### 2.1 Users Table
- [ ] Create migration: `users` table
  - id (uuid, primary key)
  - email (text, unique)
  - full_name (text)
  - avatar_url (text, nullable)
  - user_type (enum: 'hirer', 'test_taker', 'both')
  - created_at (timestamp)
  - updated_at (timestamp)
- [ ] Add RLS policies for users table
- [ ] Create indexes for performance

### 2.2 Tests Table
- [ ] Create migration: `tests` table
  - id (uuid, primary key)
  - hirer_id (uuid, foreign key)
  - title (text)
  - description (text)
  - requirements (text)
  - price_min (numeric, nullable)
  - price_max (numeric, nullable)
  - price_fixed (numeric, nullable)
  - cryptocurrency (text)
  - status (enum: 'open', 'in_progress', 'completed', 'cancelled')
  - deadline (timestamp, nullable)
  - created_at (timestamp)
  - updated_at (timestamp)
- [ ] Add RLS policies for tests table
- [ ] Create indexes for queries

### 2.3 Applications Table
- [ ] Create migration: `applications` table
  - id (uuid, primary key)
  - test_id (uuid, foreign key)
  - test_taker_id (uuid, foreign key)
  - status (enum: 'pending', 'approved', 'rejected', 'hired')
  - application_message (text)
  - applied_at (timestamp)
  - updated_at (timestamp)
- [ ] Add RLS policies for applications table
- [ ] Create indexes and constraints

### 2.4 Messages Table
- [ ] Create migration: `messages` table
  - id (uuid, primary key)
  - application_id (uuid, foreign key)
  - sender_id (uuid, foreign key)
  - message_text (text)
  - read (boolean, default false)
  - created_at (timestamp)
- [ ] Add RLS policies for messages table
- [ ] Create indexes for message queries

### 2.5 Payments Table
- [ ] Create migration: `payments` table
  - id (uuid, primary key)
  - test_id (uuid, foreign key)
  - hirer_id (uuid, foreign key)
  - test_taker_id (uuid, foreign key)
  - amount (numeric)
  - cryptocurrency (text)
  - usd_equivalent (numeric)
  - payment_address (text)
  - transaction_hash (text, nullable)
  - status (enum: 'pending', 'confirmed', 'failed')
  - created_at (timestamp)
  - confirmed_at (timestamp, nullable)
- [ ] Add RLS policies for payments table
- [ ] Create indexes for payment tracking

### 2.6 Database Functions & Triggers
- [ ] Create trigger for `updated_at` timestamp
- [ ] Create function to check user permissions
- [ ] Create function to validate application status transitions
- [ ] Create function to calculate payment totals

---

## Phase 3: Authentication & User Management

### 3.1 Authentication Pages
- [ ] Create `/auth/login` page
- [ ] Create `/auth/signup` page
- [ ] Create `/auth/verify-email` page
- [ ] Create `/auth/reset-password` page
- [ ] Create `/auth/callback` handler for OAuth

### 3.2 Authentication Logic
- [ ] Implement signup with email/password
- [ ] Implement login with email/password
- [ ] Implement email verification flow
- [ ] Implement password reset flow
- [ ] Implement logout functionality
- [ ] Create auth store for session management

### 3.3 User Profile
- [ ] Create `/profile` page
- [ ] Implement profile view
- [ ] Implement profile edit form
- [ ] Add user type selection (hirer/test_taker/both)
- [ ] Create profile update API endpoint

### 3.4 Avatar Upload
- [ ] Configure Supabase Storage bucket for avatars
- [ ] Create avatar upload component
- [ ] Implement image validation (size, type)
- [ ] Implement image upload to Supabase Storage
- [ ] Update user profile with avatar URL
- [ ] Add avatar display component

### 3.5 Authentication Tests
- [ ] Write tests for signup flow
- [ ] Write tests for login flow
- [ ] Write tests for email verification
- [ ] Write tests for password reset
- [ ] Write tests for profile updates
- [ ] Write tests for avatar upload

---

## Phase 4: Test Listing Management

### 4.1 Test Listing Pages
- [ ] Create `/tests` page (browse all tests)
- [ ] Create `/tests/new` page (create test)
- [ ] Create `/tests/[id]` page (view test details)
- [ ] Create `/tests/[id]/edit` page (edit test)
- [ ] Create `/tests/my-tests` page (hirer's tests)

### 4.2 Test CRUD Operations
- [ ] Create API endpoint: POST `/api/tests` (create)
- [ ] Create API endpoint: GET `/api/tests` (list)
- [ ] Create API endpoint: GET `/api/tests/[id]` (read)
- [ ] Create API endpoint: PUT `/api/tests/[id]` (update)
- [ ] Create API endpoint: DELETE `/api/tests/[id]` (delete)

### 4.3 Test Listing Components
- [ ] Create `TestCard` component
- [ ] Create `TestList` component
- [ ] Create `TestForm` component (create/edit)
- [ ] Create `TestDetails` component
- [ ] Create `TestFilters` component

### 4.4 Test Listing Features
- [ ] Implement price input (single or range)
- [ ] Implement cryptocurrency selector
- [ ] Implement USD price display
- [ ] Implement test status management
- [ ] Implement deadline picker
- [ ] Add search functionality
- [ ] Add filter by price/crypto/status

### 4.5 Test Listing Tests
- [ ] Write tests for test creation
- [ ] Write tests for test listing
- [ ] Write tests for test updates
- [ ] Write tests for test deletion
- [ ] Write tests for test filtering
- [ ] Write tests for price calculations

---

## Phase 5: Application System

### 5.1 Application Pages
- [ ] Create `/tests/[id]/apply` page
- [ ] Create `/applications` page (test taker's applications)
- [ ] Create `/tests/[id]/applicants` page (hirer's view)
- [ ] Create `/applications/[id]` page (application details)

### 5.2 Application API Endpoints
- [ ] Create API endpoint: POST `/api/applications` (apply)
- [ ] Create API endpoint: GET `/api/applications` (list)
- [ ] Create API endpoint: GET `/api/applications/[id]` (read)
- [ ] Create API endpoint: PUT `/api/applications/[id]` (update status)

### 5.3 Application Components
- [ ] Create `ApplicationForm` component
- [ ] Create `ApplicationCard` component
- [ ] Create `ApplicationList` component
- [ ] Create `ApplicantCard` component
- [ ] Create `ApplicantList` component

### 5.4 Application Features
- [ ] Implement application submission
- [ ] Implement application status tracking
- [ ] Implement approve/reject functionality
- [ ] Implement hire functionality
- [ ] Add application notifications
- [ ] Add application history

### 5.5 Application Tests
- [ ] Write tests for application submission
- [ ] Write tests for status updates
- [ ] Write tests for approval/rejection
- [ ] Write tests for hiring process
- [ ] Write tests for application queries

---

## Phase 6: Messaging System

### 6.1 Messaging Pages
- [ ] Create `/messages` page (inbox)
- [ ] Create `/messages/[applicationId]` page (conversation)

### 6.2 Messaging API Endpoints
- [ ] Create API endpoint: POST `/api/messages` (send)
- [ ] Create API endpoint: GET `/api/messages` (list)
- [ ] Create API endpoint: PUT `/api/messages/[id]/read` (mark read)

### 6.3 Messaging Components
- [ ] Create `MessageList` component
- [ ] Create `MessageThread` component
- [ ] Create `MessageInput` component
- [ ] Create `ConversationList` component

### 6.4 Messaging Features
- [ ] Implement message sending
- [ ] Implement message display
- [ ] Implement read/unread status
- [ ] Add real-time updates (optional: Supabase Realtime)
- [ ] Add message notifications
- [ ] Add conversation grouping

### 6.5 Messaging Tests
- [ ] Write tests for sending messages
- [ ] Write tests for retrieving messages
- [ ] Write tests for read status
- [ ] Write tests for conversation queries

---

## Phase 7: Payment Integration

### 7.1 CryptAPI.io Integration
- [ ] Create CryptAPI service module (`src/lib/services/cryptapi.js`)
- [ ] Implement Ticker Create API call
- [ ] Implement payment address generation
- [ ] Create webhook endpoint: POST `/api/webhooks/cryptapi`
- [ ] Implement webhook signature verification
- [ ] Implement payment confirmation logic

### 7.2 Tatum.io Integration
- [ ] Create Tatum service module (`src/lib/services/tatum.js`)
- [ ] Implement exchange rate API call
- [ ] Create rate caching mechanism
- [ ] Implement rate update scheduler
- [ ] Create API endpoint: GET `/api/exchange-rates`

### 7.3 Payment Pages
- [ ] Create `/payments/[testId]` page (payment initiation)
- [ ] Create `/payments/[id]/status` page (payment status)
- [ ] Create `/payments/history` page (payment history)

### 7.4 Payment Components
- [ ] Create `PaymentForm` component
- [ ] Create `PaymentStatus` component
- [ ] Create `PaymentHistory` component
- [ ] Create `ExchangeRateDisplay` component
- [ ] Create `CryptoAddressDisplay` component

### 7.5 Payment Features
- [ ] Implement payment initiation flow
- [ ] Implement payment address display
- [ ] Implement QR code generation for addresses
- [ ] Implement payment status tracking
- [ ] Implement payment confirmation
- [ ] Add payment notifications
- [ ] Add transaction history

### 7.6 Payment Tests
- [ ] Write tests for CryptAPI integration
- [ ] Write tests for Tatum integration
- [ ] Write tests for payment creation
- [ ] Write tests for webhook handling
- [ ] Write tests for exchange rate fetching
- [ ] Write tests for payment status updates

---

## Phase 8: User Interface & Experience

### 8.1 Layout & Navigation
- [ ] Create main layout component
- [ ] Create navigation header
- [ ] Create footer component
- [ ] Create sidebar navigation
- [ ] Implement responsive design
- [ ] Add mobile menu

### 8.2 Common Components
- [ ] Create `Button` component
- [ ] Create `Input` component
- [ ] Create `Select` component
- [ ] Create `Modal` component
- [ ] Create `Alert` component
- [ ] Create `Loading` component
- [ ] Create `Pagination` component

### 8.3 Dashboard Pages
- [ ] Create `/dashboard` page (main dashboard)
- [ ] Create hirer dashboard view
- [ ] Create test taker dashboard view
- [ ] Add statistics and metrics
- [ ] Add recent activity feed

### 8.4 Styling & Theming
- [ ] Set up TailwindCSS
- [ ] Define color palette
- [ ] Define typography scale
- [ ] Create utility classes
- [ ] Implement dark mode (optional)

### 8.5 Accessibility
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Add focus indicators
- [ ] Test with screen readers
- [ ] Ensure color contrast compliance

---

## Phase 9: Testing & Quality Assurance

### 9.1 Unit Tests
- [ ] Write tests for all utility functions
- [ ] Write tests for all service modules
- [ ] Write tests for all API endpoints
- [ ] Achieve 80%+ code coverage

### 9.2 Integration Tests
- [ ] Test authentication flows
- [ ] Test test listing workflows
- [ ] Test application workflows
- [ ] Test messaging workflows
- [ ] Test payment workflows

### 9.3 End-to-End Tests
- [ ] Test complete hirer journey
- [ ] Test complete test taker journey
- [ ] Test payment completion flow
- [ ] Test error scenarios

### 9.4 Performance Testing
- [ ] Test page load times
- [ ] Test API response times
- [ ] Optimize database queries
- [ ] Implement caching where needed

### 9.5 Security Testing
- [ ] Verify RLS policies
- [ ] Test authentication security
- [ ] Test input validation
- [ ] Test webhook security
- [ ] Perform security audit

---

## Phase 10: Deployment & Documentation

### 10.1 Deployment Setup
- [ ] Configure production environment variables
- [ ] Set up hosting (Vercel/Netlify)
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets

### 10.2 Database Deployment
- [ ] Run migrations on production database
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Set up monitoring

### 10.3 External Services Configuration
- [ ] Configure CryptAPI production webhooks
- [ ] Configure Tatum API production keys
- [ ] Set up Supabase production project
- [ ] Configure email service

### 10.4 Documentation
- [ ] Write API documentation
- [ ] Create user guide
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Document environment variables

### 10.5 Monitoring & Analytics
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (optional)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Create alerting rules

---

## Future Enhancements (Post-MVP)

- [ ] Escrow service for payments
- [ ] Rating and review system
- [ ] Test categories and tags
- [ ] Advanced search with filters
- [ ] Dispute resolution system
- [ ] Multi-language support
- [ ] Mobile applications
- [ ] Additional payment providers
- [ ] Automated test verification
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Push notifications
- [ ] Social media integration
- [ ] Referral program
- [ ] Premium features/subscriptions

---

## Notes

- Follow TDD approach: write tests first, then implementation
- Use `pnpx supabase migrations new` for all database changes
- Never modify existing migrations, always create new ones
- Keep components small and focused (KISS principle)
- Minimize external dependencies
- Use ESM modules exclusively
- Follow ESLint and Prettier configurations
- Test thoroughly before marking tasks complete

---

**Last Updated**: 2025-10-04
**Project Start Date**: 2025-10-04
**Target MVP Completion**: TBD