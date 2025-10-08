# Product Requirements Document v2: TutorLinkup.com

## 1. Executive Summary

TutorLinkup.com is a comprehensive academic assistance marketplace connecting students with expert tutors and test-takers. The platform offers homework help, programming assistance, assignment writing, and test-taking services with secure cryptocurrency payments via CryptAPI.io and real-time exchange rates via Tatum.io.

## 2. Product Overview

### 2.1 Vision
Create a simple, secure, and efficient marketplace for academic assistance services with cryptocurrency payment integration, focusing on quality, reliability, and student success.

### 2.2 Target Users
- **Students**: Individuals needing academic help across various subjects
- **Test Hirers**: Students or organizations needing test-taking services
- **Test Takers/Tutors**: Qualified individuals offering academic assistance services
- **Programmers**: Expert coders offering programming help
- **Writers**: Academic writers offering assignment help

## 3. Core Features

### 3.1 User Authentication & Profile Management

#### 3.1.1 Account Creation (Supabase Auth)
- Email/password registration
- Email verification
- Secure authentication flow
- Avatar upload capability (post-registration)
- Password reset functionality

#### 3.1.2 User Profiles
- Basic information (name, email, username)
- Avatar image
- User type (Student/Tutor/Test Taker/Programmer/Writer)
- Bio and skills
- Location
- Account creation date
- Profile completion status
- Public profile pages (u/[username])

### 3.2 Homework Help Services

#### 3.2.1 Homework Request System
- Create homework help requests
- Subject selection (Math, Science, English, History, etc.)
- Difficulty level (Elementary, Middle School, High School, College, Graduate)
- Deadline specification
- File attachments (PDFs, DOCX, images)
- Price range or fixed price
- Cryptocurrency payment options

#### 3.2.2 Homework Categories
- Mathematics (Algebra, Calculus, Statistics, etc.)
- Sciences (Physics, Chemistry, Biology, etc.)
- English & Literature
- History & Social Studies
- Geography
- Economics
- Biostatistics
- Engineering subjects
- Nursing

#### 3.2.3 Homework Features
- 100% original papers guarantee
- 24/7 availability
- Referral bonus system
- Free revisions
- On-time delivery (12-24 hour options)
- Sample papers and blogs access
- Step-by-step solutions with explanations

### 3.3 Programming Help Services

#### 3.3.1 Programming Request System
- Code homework requests
- Programming language selection
- Project type (homework, assignment, debugging, mini-project)
- Code file attachments
- Specific requirements and constraints
- Deadline (same-day, overnight, standard)
- Price negotiation

#### 3.3.2 Supported Languages & Technologies
- C, C++, Java, Python
- JavaScript, TypeScript, Node.js
- MATLAB, R, SQL
- Web Development (HTML, CSS, React, etc.)
- Data Structures & Algorithms
- Machine Learning
- Database Management

#### 3.3.3 Programming Features
- 100% human-written code (no AI-generated)
- Annotated code with detailed explanations
- Debugging & error fixing
- Code optimization
- Syntax and logical error explanations
- Step-by-step guidance
- Learning-focused solutions
- Code comments and documentation
- Quality reports included

### 3.4 Assignment Writing Services

#### 3.4.1 Assignment Request System
- "Do My Assignment" requests
- Subject and topic specification
- Academic level (High School, Undergraduate, Graduate)
- Citation style (APA, MLA, Chicago, Harvard)
- Word count requirements
- Research requirements
- Deadline options (3-6 hours urgent, standard)

#### 3.4.2 Assignment Features
- Plagiarism-free guarantee (checked with advanced tools)
- Expert writers across subjects
- Affordable rates starting at $9/page
- Student discounts
- Flexible pricing
- Safe & confidential
- Money-back guarantee
- Free revisions (unlimited)
- 24/7 support

#### 3.4.3 Assignment Types
- Essays
- Research papers
- Case studies
- Lab reports
- Dissertations
- Thesis papers
- Book reports
- Presentations

### 3.5 Test Taking Services (Original Features)

#### 3.5.1 Test Management
- Create new test listings
- Edit existing test listings
- Delete test listings
- View all posted tests
- Test categories and tags

#### 3.5.2 Test Listing Details
- Test title
- Test description
- Test requirements
- Price (single price or price range)
- Cryptocurrency type (BTC, ETH, USDT, etc.)
- USD equivalent display (via Tatum.io exchange rates)
- Test status (Open, In Progress, Completed, Cancelled)
- Application deadline (optional)

#### 3.5.3 Applicant Management
- View all applicants for each test
- Review applicant profiles
- Message applicants
- Approve/reject applications
- Hire selected test taker
- Mark test as completed
- Initiate payment upon completion

### 3.6 Service Discovery & Filtering

#### 3.6.1 Browse Services
- Browse all available services
- Filter by service type:
  - Homework Help
  - Programming Help
  - Assignment Writing
  - Test Taking
- Search by subject/topic
- Filter by price range
- Filter by deadline
- Filter by cryptocurrency type
- Sort by date posted, price, rating

#### 3.6.2 Application Management
- Apply to available services
- View application status (Pending, Approved, Rejected, Hired)
- Track services in progress
- View completed services
- Application history

### 3.7 Messaging System

#### 3.7.1 Direct Messaging
- Student-to-tutor messaging
- Real-time or near-real-time communication
- Message history
- Notification of new messages
- Unread message count
- File attachments in messages
- Message threading by application

### 3.8 Payment Integration

#### 3.8.1 CryptAPI.io Integration
- Generate payment addresses via Ticker Create API
- Support multiple cryptocurrencies
- Payment confirmation webhooks
- Transaction tracking
- Commission split (platform fee)

#### 3.8.2 Tatum.io Exchange Rates
- Real-time cryptocurrency to USD conversion
- Display exchange rates on service listings
- Update rates periodically
- Multi-currency support

#### 3.8.3 Payment Flow
1. Student marks service as completed
2. System generates payment request
3. Student sends cryptocurrency to generated address
4. System confirms payment via CryptAPI webhook
5. Tutor receives payment confirmation (minus platform commission)
6. Transaction recorded in database

#### 3.8.4 Pricing Structure
- Homework Help: Starting at $9/page
- Programming Help: Custom quotes based on complexity
- Assignment Writing: Starting at $9/page
- Test Taking: Custom pricing
- Platform commission: Configurable percentage
- Secure payment gateways (PayPal, VISA, MasterCard, crypto)

### 3.9 Leaderboard System

#### 3.9.1 Public Leaderboard
- Display top-performing tutors/test takers
- Sortable by:
  - Services completed
  - Success rate
  - Average rating
  - Total earnings
  - Response time
- User profiles with:
  - Bio and skills
  - Location
  - Performance metrics
  - Recent activity

#### 3.9.2 Privacy Settings
- Users can opt out of leaderboard
- Toggle visibility in profile settings
- Hidden users excluded from public rankings

#### 3.9.3 Performance Metrics
- Services completed count
- Success rate percentage
- Average rating (1-5 stars)
- Total earnings
- Average response time
- Last active timestamp
- Subject expertise tags

### 3.10 Job Offers System

#### 3.10.1 Direct Hiring
- Employers can make job offers to tutors
- "Hire Me" button on leaderboard profiles
- Requires employer account creation

#### 3.10.2 Job Offer Details
- Job title and description
- Employment type (full-time, part-time, contract, freelance)
- Salary range
- Location and remote options
- Requirements and benefits
- Offer expiration date

#### 3.10.3 Offer Management
- Tutors can accept/reject offers
- Employers can withdraw offers
- Auto-expire old offers
- Offer status tracking

### 3.11 Rating & Review System

#### 3.11.1 Post-Service Ratings
- Students rate tutors after completion
- 1-5 star rating scale
- Optional written review
- One rating per service
- Rating categories:
  - Quality of work
  - Communication
  - Timeliness
  - Value for money

#### 3.11.2 Rating Display
- Average rating on profile
- Individual ratings visible to public
- Ratings contribute to leaderboard ranking
- Response to reviews (optional)

### 3.12 Quality Assurance Features

#### 3.12.1 Plagiarism Checking
- Automatic plagiarism detection
- Plagiarism reports included
- 100% originality guarantee

#### 3.12.2 Quality Reports
- Detailed quality assessments
- Grammar and style checking
- Citation verification
- Code quality metrics (for programming)

#### 3.12.3 Revision System
- Free unlimited revisions
- Revision request workflow
- Revision deadline tracking
- Satisfaction guarantee

### 3.13 Support & Resources

#### 3.13.1 24/7 Customer Support
- Live chat support
- Email support
- FAQ section
- Help center

#### 3.13.2 Learning Resources
- Sample papers library
- Blog articles
- Study guides
- Tutorial videos
- Subject-specific resources

#### 3.13.3 Referral Program
- Referral bonus system
- Unique referral codes
- Track referral earnings
- Automatic bonus credits

## 4. Technical Architecture

### 4.1 Technology Stack

#### Frontend
- **Framework**: SvelteKit
- **Styling**: TailwindCSS
- **State Management**: Svelte stores
- **File Upload**: Supabase Storage

#### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for files, avatars)
- **API**: SvelteKit API routes

#### External Services
- **Payment Processing**: CryptAPI.io
- **Exchange Rates**: Tatum.io
- **Email**: Supabase Email or SendGrid
- **Plagiarism Detection**: TBD (Copyscape, Turnitin API, etc.)

### 4.2 Enhanced Database Schema

#### Users Table
```sql
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- username (text, unique)
- avatar_url (text, nullable)
- user_type (enum: 'student', 'tutor', 'test_taker', 'programmer', 'writer', 'both')
- bio (text, nullable)
- skills (text[], nullable)
- location (text, nullable)
- show_on_leaderboard (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Services Table (replaces Tests Table)
```sql
- id (uuid, primary key)
- creator_id (uuid, foreign key -> users.id)
- service_type (enum: 'homework', 'programming', 'assignment', 'test_taking')
- title (text)
- description (text)
- requirements (text)
- subject (text)
- difficulty_level (text, nullable)
- price_min (numeric, nullable)
- price_max (numeric, nullable)
- price_fixed (numeric, nullable)
- cryptocurrency (text)
- status (enum: 'open', 'in_progress', 'completed', 'cancelled')
- deadline (timestamp, nullable)
- files (text[], nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Applications Table
```sql
- id (uuid, primary key)
- service_id (uuid, foreign key -> services.id)
- applicant_id (uuid, foreign key -> users.id)
- status (enum: 'pending', 'approved', 'rejected', 'hired')
- application_message (text)
- proposed_price (numeric, nullable)
- applied_at (timestamp)
- updated_at (timestamp)
```

#### Messages Table
```sql
- id (uuid, primary key)
- application_id (uuid, foreign key -> applications.id)
- sender_id (uuid, foreign key -> users.id)
- message_text (text)
- attachments (text[], nullable)
- read (boolean, default false)
- created_at (timestamp)
```

#### Payments Table
```sql
- id (uuid, primary key)
- service_id (uuid, foreign key -> services.id)
- payer_id (uuid, foreign key -> users.id)
- receiver_id (uuid, foreign key -> users.id)
- amount (numeric)
- cryptocurrency (text)
- usd_equivalent (numeric)
- platform_commission (numeric)
- payment_address (text)
- transaction_hash (text, nullable)
- status (enum: 'pending', 'confirmed', 'failed')
- created_at (timestamp)
- confirmed_at (timestamp, nullable)
```

#### Ratings Table
```sql
- id (uuid, primary key)
- service_id (uuid, foreign key -> services.id)
- rater_id (uuid, foreign key -> users.id)
- rated_user_id (uuid, foreign key -> users.id)
- rating (integer, 1-5)
- quality_rating (integer, 1-5, nullable)
- communication_rating (integer, 1-5, nullable)
- timeliness_rating (integer, 1-5, nullable)
- value_rating (integer, 1-5, nullable)
- review_text (text, nullable)
- created_at (timestamp)
```

#### Revisions Table
```sql
- id (uuid, primary key)
- service_id (uuid, foreign key -> services.id)
- requester_id (uuid, foreign key -> users.id)
- revision_notes (text)
- status (enum: 'pending', 'in_progress', 'completed')
- created_at (timestamp)
- completed_at (timestamp, nullable)
```

#### Referrals Table
```sql
- id (uuid, primary key)
- referrer_id (uuid, foreign key -> users.id)
- referred_id (uuid, foreign key -> users.id)
- referral_code (text, unique)
- bonus_amount (numeric)
- status (enum: 'pending', 'completed')
- created_at (timestamp)
```

## 5. User Flows

### 5.1 Student (Homework Help) Flow
1. Sign up / Log in
2. Browse homework help services or create request
3. Select subject and difficulty level
4. Upload files (if needed)
5. Set deadline and price range
6. Receive applications from tutors
7. Review tutor profiles and ratings
8. Message tutors
9. Hire selected tutor
10. Receive completed homework
11. Request revisions (if needed)
12. Approve work
13. Make payment via cryptocurrency
14. Rate and review tutor

### 5.2 Student (Programming Help) Flow
1. Sign up / Log in
2. Create programming help request
3. Select language and project type
4. Upload code files
5. Describe requirements
6. Set deadline (urgent/standard)
7. Receive quotes from programmers
8. Review programmer profiles
9. Hire programmer
10. Receive annotated code with explanations
11. Request debugging/fixes if needed
12. Approve work
13. Make payment
14. Rate programmer

### 5.3 Student (Assignment Writing) Flow
1. Sign up / Log in
2. Request "Do My Assignment" service
3. Specify topic, academic level, word count
4. Select citation style
5. Set deadline
6. Receive quote
7. Pay securely
8. Receive plagiarism-free assignment
9. Review quality report
10. Request free revisions if needed
11. Download final assignment
12. Rate writer

### 5.4 Tutor/Test Taker Flow
1. Sign up / Log in
2. Complete profile with skills and bio
3. Browse available service requests
4. Apply to relevant services
5. Receive approval/rejection
6. Message students
7. Complete service
8. Submit work
9. Receive payment (minus platform commission)
10. Build reputation through ratings
11. Appear on leaderboard
12. Receive job offers

## 6. Success Metrics

- User registration rate
- Service request creation rate
- Application submission rate
- Successful hire rate
- Payment completion rate
- User retention rate
- Average time to hire
- Platform transaction volume
- Customer satisfaction score (CSAT)
- Net Promoter Score (NPS)
- Revision request rate
- Plagiarism detection rate

## 7. Future Enhancements

- Escrow service for payments
- Video tutoring sessions
- Live chat for real-time help
- Mobile applications (iOS/Android)
- AI-powered tutor matching
- Automated plagiarism detection
- Multi-language support
- Advanced analytics dashboard
- Subscription plans for students
- Tutor certification program
- Integration with learning management systems (LMS)
- Automated test proctoring

## 8. Assumptions and Constraints

### Assumptions
- Users have basic cryptocurrency knowledge
- Users have cryptocurrency wallets
- External APIs (CryptAPI, Tatum) maintain uptime
- Service completion is verified by both parties
- Quality is maintained through rating system

### Constraints
- No fiat currency payments (crypto only initially)
- No built-in escrow (direct payments with commission)
- Basic identity verification (email verification only)
- Manual quality review (no automated proctoring initially)

## 9. Glossary

- **Student**: User who requests academic services
- **Tutor**: User who provides homework help or tutoring
- **Test Taker**: User who completes tests for students
- **Programmer**: User who provides coding assistance
- **Writer**: User who provides assignment writing services
- **Service**: Any academic assistance request (homework, programming, assignment, test)
- **Application**: Request from service provider to complete a service
- **Commission**: Platform fee deducted from payments
- **Revision**: Request to modify or improve completed work
- **Leaderboard**: Public ranking of top service providers