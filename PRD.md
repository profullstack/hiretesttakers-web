# Product Requirements Document: TutorLinkup.com

## 1. Executive Summary

TutorLinkup.com is a marketplace platform connecting individuals who need to hire test-takers with qualified test-takers willing to complete tests for compensation. The platform facilitates secure cryptocurrency payments via CryptAPI.io and provides real-time exchange rate information via Tatum.io.

## 2. Product Overview

### 2.1 Vision
Create a simple, secure, and efficient marketplace for test-taking services with cryptocurrency payment integration.

### 2.2 Target Users
- **Test Hirers**: Individuals or organizations needing test-taking services
- **Test Takers**: Qualified individuals offering test-taking services

## 3. Core Features

### 3.1 User Authentication & Profile Management

#### 3.1.1 Account Creation (Supabase Auth)
- Email/password registration
- Email verification
- Secure authentication flow
- Avatar upload capability (post-registration)

#### 3.1.2 User Profiles
- Basic information (name, email)
- Avatar image
- User type (Hirer/Test Taker)
- Account creation date
- Profile completion status

### 3.2 Test Hirer Features

#### 3.2.1 Test Management
- Create new test listings
- Edit existing test listings
- Delete test listings
- View all posted tests

#### 3.2.2 Test Listing Details
- Test title
- Test description
- Test requirements
- Price (single price or price range)
- Cryptocurrency type (BTC, ETH, USDT, etc.)
- USD equivalent display (via Tatum.io exchange rates)
- Optional: Display price in other fiat currencies
- Test status (Open, In Progress, Completed, Cancelled)
- Application deadline (optional)

#### 3.2.3 Applicant Management
- View all applicants for each test
- Review applicant profiles
- Message applicants
- Approve/reject applications
- Hire selected test taker
- Mark test as completed
- Initiate payment upon completion

### 3.3 Test Taker Features

#### 3.3.1 Test Discovery
- Browse available tests
- Search/filter tests by:
  - Price range
  - Cryptocurrency type
  - Test category (if applicable)
  - Date posted

#### 3.3.2 Application Management
- Apply to available tests
- View application status:
  - Pending
  - Approved
  - Rejected
  - Hired
- Track tests in progress
- View completed tests
- Application history

#### 3.3.3 Test Completion
- Mark test as completed
- Await payment confirmation
- View payment history

### 3.4 Messaging System

#### 3.4.1 Direct Messaging
- Hirer-to-applicant messaging
- Real-time or near-real-time communication
- Message history
- Notification of new messages

### 3.5 Payment Integration

#### 3.5.1 CryptAPI.io Integration
- Generate payment addresses via Ticker Create API
- Support multiple cryptocurrencies
- Payment confirmation webhooks
- Transaction tracking

#### 3.5.2 Tatum.io Exchange Rates
- Real-time cryptocurrency to USD conversion
- Optional: Support for multiple fiat currencies (EUR, GBP, etc.)
- Display exchange rates on test listings
- Update rates periodically

#### 3.5.3 Payment Flow
1. Hirer marks test as completed
2. System generates payment request
3. Hirer sends cryptocurrency to generated address
4. System confirms payment via CryptAPI webhook
5. Test taker receives payment confirmation
6. Transaction recorded in database

## 4. Technical Architecture

### 4.1 Technology Stack

#### Frontend
- **Framework**: SvelteKit (assumed based on project context)
- **Styling**: TailwindCSS or similar
- **State Management**: Svelte stores

#### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for avatars)
- **API**: SvelteKit API routes

#### External Services
- **Payment Processing**: CryptAPI.io
- **Exchange Rates**: Tatum.io

### 4.2 Database Schema

#### Users Table
```sql
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- avatar_url (text, nullable)
- user_type (enum: 'hirer', 'test_taker', 'both')
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tests Table
```sql
- id (uuid, primary key)
- hirer_id (uuid, foreign key -> users.id)
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
```

#### Applications Table
```sql
- id (uuid, primary key)
- test_id (uuid, foreign key -> tests.id)
- test_taker_id (uuid, foreign key -> users.id)
- status (enum: 'pending', 'approved', 'rejected', 'hired')
- application_message (text)
- applied_at (timestamp)
- updated_at (timestamp)
```

#### Messages Table
```sql
- id (uuid, primary key)
- application_id (uuid, foreign key -> applications.id)
- sender_id (uuid, foreign key -> users.id)
- message_text (text)
- read (boolean, default false)
- created_at (timestamp)
```

#### Payments Table
```sql
- id (uuid, primary key)
- test_id (uuid, foreign key -> tests.id)
- hirer_id (uuid, foreign key -> users.id)
- test_taker_id (uuid, foreign key -> users.id)
- amount (numeric)
- cryptocurrency (text)
- usd_equivalent (numeric)
- payment_address (text)
- transaction_hash (text, nullable)
- status (enum: 'pending', 'confirmed', 'failed')
- created_at (timestamp)
- confirmed_at (timestamp, nullable)
```

## 5. User Flows

### 5.1 Hirer Flow
1. Sign up / Log in
2. Upload avatar (optional)
3. Create test listing
4. Receive applications
5. Review applicants
6. Message applicants (optional)
7. Approve/reject applications
8. Hire test taker
9. Monitor test progress
10. Mark test as completed
11. Make payment via cryptocurrency
12. Confirm payment completion

### 5.2 Test Taker Flow
1. Sign up / Log in
2. Upload avatar (optional)
3. Browse available tests
4. Apply to tests
5. Receive approval/rejection
6. Message hirer (if approved)
7. Complete test
8. Mark test as completed
9. Receive payment
10. Confirm payment received

## 6. API Integrations

### 6.1 CryptAPI.io

#### Ticker Create API
- **Endpoint**: `https://api.cryptapi.io/{coin}/create/`
- **Purpose**: Generate payment addresses
- **Parameters**:
  - `callback`: Webhook URL for payment notifications
  - `address`: Destination wallet address
  - `pending`: Minimum confirmations

#### Payment Callback
- Receive webhook notifications
- Verify payment status
- Update payment records

### 6.2 Tatum.io

#### Exchange Rates API
- **Endpoint**: `https://api.tatum.io/v3/tatum/rate/{currency}`
- **Purpose**: Get real-time exchange rates
- **Supported Currencies**: BTC, ETH, USDT, etc. to USD/EUR/GBP

## 7. Security Considerations

### 7.1 Authentication
- Secure password hashing (handled by Supabase)
- Email verification required
- Session management
- JWT tokens for API authentication

### 7.2 Data Protection
- Row Level Security (RLS) in Supabase
- User data isolation
- Secure file uploads (avatars)
- Input validation and sanitization

### 7.3 Payment Security
- No storage of private keys
- Webhook signature verification
- Payment confirmation before release
- Transaction logging

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load time < 2 seconds
- Real-time messaging latency < 1 second
- Exchange rate updates every 5 minutes

### 8.2 Scalability
- Support for 10,000+ users
- Concurrent test listings: 1,000+
- Message throughput: 100 messages/second

### 8.3 Availability
- 99.9% uptime target
- Graceful degradation for external API failures
- Error handling and user feedback

### 8.4 Usability
- Mobile-responsive design
- Intuitive navigation
- Clear call-to-action buttons
- Helpful error messages

### 3.6 Leaderboard System

#### 3.6.1 Public Leaderboard
- Display top-performing test takers
- Sortable by:
  - Tests completed
  - Success rate
  - Average rating
  - Total earnings
- User profiles with:
  - Bio and skills
  - Location
  - Performance metrics
  - Recent activity

#### 3.6.2 Privacy Settings
- Users can opt out of leaderboard
- Toggle visibility in profile settings
- Hidden users excluded from public rankings

#### 3.6.3 Performance Metrics
- Tests completed count
- Tests passed count
- Success rate percentage
- Average rating (1-5 stars)
- Total earnings
- Average response time
- Last active timestamp

### 3.7 Job Offers System

#### 3.7.1 Direct Hiring
- Employers can make job offers to test takers
- "Hire Me" button on leaderboard profiles
- Requires employer account creation

#### 3.7.2 Job Offer Details
- Job title and description
- Employment type (full-time, part-time, contract, freelance)
- Salary range
- Location and remote options
- Requirements and benefits
- Offer expiration date

#### 3.7.3 Offer Management
- Test takers can accept/reject offers
- Employers can withdraw offers
- Auto-expire old offers
- Offer status tracking

### 3.8 Rating System

#### 3.8.1 Post-Test Ratings
- Hirers rate test takers after completion
- 1-5 star rating scale
- Optional written review
- One rating per test

#### 3.8.2 Rating Display
- Average rating on profile
- Individual ratings visible to public
- Ratings contribute to leaderboard ranking

## 9. Future Enhancements (Out of Scope for MVP)

- Escrow service for payments
- Rating and review system
- Test categories and tags
- Advanced search and filtering
- Dispute resolution system
- Multi-language support
- Mobile applications (iOS/Android)
- Integration with additional payment providers
- Automated test verification
- Analytics dashboard

## 10. Success Metrics

- User registration rate
- Test listing creation rate
- Application submission rate
- Successful hire rate
- Payment completion rate
- User retention rate
- Average time to hire
- Platform transaction volume

## 11. Development Phases

### Phase 1: Foundation (MVP)
- User authentication and profiles
- Avatar upload
- Basic test listing CRUD
- Application system
- Simple messaging

### Phase 2: Payment Integration
- CryptAPI.io integration
- Tatum.io exchange rates
- Payment flow implementation
- Transaction tracking

### Phase 3: Enhancement
- UI/UX improvements
- Performance optimization
- Bug fixes and refinements
- User feedback implementation

## 12. Assumptions and Constraints

### Assumptions
- Users have basic cryptocurrency knowledge
- Users have cryptocurrency wallets
- External APIs (CryptAPI, Tatum) maintain uptime
- Test completion is self-reported (honor system)

### Constraints
- No fiat currency payments (crypto only)
- No built-in escrow (direct payments)
- No identity verification (basic email verification only)
- No automated test proctoring

## 13. Glossary

- **Hirer**: User who posts test listings and hires test takers
- **Test Taker**: User who applies to and completes tests
- **Application**: Request from test taker to complete a specific test
- **Cryptocurrency**: Digital currency used for payments (BTC, ETH, USDT, etc.)
- **Exchange Rate**: Conversion rate between cryptocurrency and fiat currency
- **Webhook**: Automated callback for payment notifications