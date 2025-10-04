# HireTestTakers.com - Project Summary

## Overview

HireTestTakers.com is a marketplace platform that connects individuals who need test-taking services with qualified test-takers. The platform features secure cryptocurrency payments via CryptAPI.io and real-time exchange rates via Tatum.io.

## Documentation Structure

### 📘 [README.md](./README.md)
Main project documentation with:
- Project overview and features
- Technology stack
- Installation instructions
- Development commands
- Project structure

### 📋 [PRD.md](./PRD.md)
Comprehensive Product Requirements Document including:
- Executive summary and vision
- Detailed feature specifications
- Database schema design
- User flows and workflows
- API integration details
- Security considerations
- Success metrics

### ✅ [TODO.md](./TODO.md)
Development task tracker organized by phases:
- Phase 1: Project Foundation
- Phase 2: Database Schema & Migrations
- Phase 3: Authentication & User Management
- Phase 4: Test Listing Management
- Phase 5: Application System
- Phase 6: Messaging System
- Phase 7: Payment Integration
- Phase 8: User Interface & Experience
- Phase 9: Testing & Quality Assurance
- Phase 10: Deployment & Documentation

### 🔧 [SETUP.md](./SETUP.md)
Step-by-step setup guide covering:
- Prerequisites installation
- Self-hosted Supabase with Docker
- Environment configuration
- Database initialization
- Development workflow
- Troubleshooting

## Key Features

### For Test Hirers
- Create and manage test listings
- Set cryptocurrency prices (single or range)
- Review and manage applicants
- Direct messaging with test-takers
- Process payments upon completion

### For Test Takers
- Browse available opportunities
- Apply to tests
- Track application status
- Complete tests and receive payment
- Message with hirers

### Platform Features
- Supabase authentication
- Avatar upload
- Real-time exchange rates
- Secure cryptocurrency payments
- Application tracking
- Message history

## Technology Stack

### Frontend
- **SvelteKit** - Modern web framework
- **TailwindCSS** - Utility-first CSS
- **JavaScript (ESM)** - Modern ES2024+ features

### Backend
- **Supabase** - Self-hosted with Docker
- **PostgreSQL** - Database
- **Node.js 20+** - Runtime environment

### External Services
- **CryptAPI.io** - Payment processing
- **Tatum.io** - Exchange rates

### Development Tools
- **pnpm** - Package manager
- **Mocha + Chai** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Project Structure

```
hiretesttakers-web/
├── src/                    # Source code
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── stores/         # State management
│   │   ├── utils/          # Utility functions
│   │   └── services/       # API services
│   └── routes/             # SvelteKit routes
├── supabase/
│   └── migrations/         # Database migrations
├── scripts/
│   ├── db-export.js        # Database backup script
│   └── db-import.js        # Database restore script
├── tests/                  # Test files
├── backups/                # Database backups (gitignored)
├── static/                 # Static assets
├── PRD.md                  # Product requirements
├── TODO.md                 # Task tracker
├── SETUP.md                # Setup guide
├── README.md               # Main documentation
└── package.json            # Dependencies and scripts
```

## Database Schema

### Core Tables
1. **users** - User profiles and authentication
2. **tests** - Test listings created by hirers
3. **applications** - Test taker applications
4. **messages** - Direct messaging
5. **payments** - Cryptocurrency transactions

See [PRD.md](./PRD.md) for detailed schema definitions.

## Development Workflow

### 1. Setup Environment
```bash
# Install dependencies
pnpm install

# Set up Supabase with Docker
# See SETUP.md for detailed instructions

# Configure environment variables
cp .env.example .env
```

### 2. Database Management
```bash
# Create migration
pnpm run supabase:migration

# Apply migrations
pnpm run supabase:push

# Backup database
pnpm run db:export

# Restore database
pnpm run db:import
```

### 3. Development
```bash
# Start dev server
pnpm run dev

# Run tests
pnpm test

# Lint code
pnpm run lint

# Format code
pnpm run format
```

### 4. Build & Deploy
```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Key Principles

### KISS (Keep It Simple, Stupid)
- Favor simplicity over complexity
- Implement bare minimum to succeed
- Avoid over-engineering

### Test-Driven Development (TDD)
- Write tests first
- Implement code to pass tests
- Refactor with confidence

### Code Quality
- Modern JavaScript (ES2024+)
- ESLint for consistency
- Prettier for formatting
- Comprehensive error handling

### Database Management
- Never modify existing migrations
- Always create new migrations
- Use Supabase CLI for migrations
- Regular backups with db:export

## External Service Setup

### CryptAPI.io
1. Sign up at https://cryptapi.io
2. Configure webhook URL
3. Set destination wallet address

### Tatum.io
1. Sign up at https://tatum.io
2. Get API key from dashboard
3. Add to environment variables

## Security Features

- Email verification required
- Row Level Security (RLS) on all tables
- Secure file uploads
- Input validation and sanitization
- Webhook signature verification
- No storage of private keys

## Next Steps

1. ✅ Review all documentation
2. ⏳ Follow SETUP.md to initialize project
3. ⏳ Install dependencies with pnpm
4. ⏳ Set up self-hosted Supabase
5. ⏳ Configure environment variables
6. ⏳ Create initial database migrations
7. ⏳ Start implementing features per TODO.md

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **SvelteKit Docs**: https://kit.svelte.dev/docs
- **CryptAPI Docs**: https://docs.cryptapi.io
- **Tatum Docs**: https://docs.tatum.io

## Support

- Open issues on GitHub
- Review documentation
- Check troubleshooting in SETUP.md

---

**Project Status**: Planning & Documentation Complete ✅

**Ready for Development**: Yes 🚀