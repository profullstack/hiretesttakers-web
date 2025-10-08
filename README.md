# TutorLinkup.com

A marketplace platform connecting individuals who need test-taking services with qualified test-takers, featuring secure cryptocurrency payments.

## 🎯 Overview

TutorLinkup.com enables users to:
- **Post test-taking opportunities** with cryptocurrency compensation
- **Apply to complete tests** and earn cryptocurrency
- **Communicate securely** between hirers and test-takers
- **Process payments** using multiple cryptocurrencies via CryptAPI.io
- **View real-time exchange rates** via Tatum.io

## 🚀 Features

### For Test Hirers
- Create and manage test listings
- Set prices in cryptocurrency (single price or range)
- View USD equivalent pricing
- Review and manage applicants
- Direct messaging with applicants
- Approve/reject applications
- Process cryptocurrency payments upon completion

### For Test Takers
- Browse available test opportunities
- Apply to tests with custom messages
- Track application status (pending, approved, rejected, hired)
- View tests in progress and completed
- Receive cryptocurrency payments
- Message with hirers

### Platform Features
- Supabase authentication with email verification
- Avatar upload and profile management
- Real-time exchange rate display (crypto to USD/other fiats)
- Secure cryptocurrency payment processing
- Application and payment tracking
- Message history

## 🛠️ Technology Stack

### Frontend
- **Framework**: SvelteKit
- **Styling**: TailwindCSS
- **Language**: JavaScript (ESM, Node.js 20+)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (avatars)
- **API Routes**: SvelteKit endpoints

### External Services
- **Payment Processing**: [CryptAPI.io](https://cryptapi.io)
- **Exchange Rates**: [Tatum.io](https://tatum.io)

### Development Tools
- **Package Manager**: pnpm
- **Testing**: Mocha + Chai
- **Linting**: ESLint
- **Formatting**: Prettier

## 📋 Prerequisites

- Node.js 20 or newer
- pnpm (install via `npm install -g pnpm`)
- Docker and Docker Compose (for self-hosted Supabase)
- CryptAPI.io account
- Tatum.io API key

## 🔧 Installation

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tutorlinkup-web.git
cd tutorlinkup-web
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up self-hosted Supabase with Docker:
```bash
# Clone Supabase Docker repository
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy the example environment file
cp .env.example .env

# Start Supabase services
docker compose up -d

# Return to project directory
cd ../../tutorlinkup-web
```

4. Run the automated setup script:
```bash
pnpm run setup
```

This will:
- Copy `.env.example` to `.env`
- Prompt you for required environment variables
- Initialize Supabase CLI
- Run database migrations
- Set up the database schema

Alternatively, you can set up manually:

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# Then initialize Supabase
pnpx supabase init
pnpx supabase db push
```

## 🚀 Development

Start the development server:
```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

### Database Management

Initial setup (automated):
```bash
pnpm run db:setup
```

Export database (backup):
```bash
pnpm run db:export
```

Import database (restore):
```bash
pnpm run db:import
```

View Supabase Studio (database UI):
```bash
# Supabase Studio is available at http://localhost:8000
```

## 🧪 Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with coverage:
```bash
pnpm test:coverage
```

## 🏗️ Building

Build for production:
```bash
pnpm run build
```

Preview production build:
```bash
pnpm run preview
```

## 📁 Project Structure

```
tutorlinkup-web/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── stores/         # Svelte stores
│   │   ├── utils/          # Utility functions
│   │   └── services/       # API service modules
│   ├── routes/             # SvelteKit routes
│   │   ├── api/            # API endpoints
│   │   ├── auth/           # Authentication pages
│   │   ├── tests/          # Test listing pages
│   │   ├── applications/   # Application pages
│   │   └── profile/        # User profile pages
│   └── app.html            # HTML template
├── supabase/
│   └── migrations/         # Database migrations
├── tests/                  # Test files
├── static/                 # Static assets
├── PRD.md                  # Product Requirements Document
├── TODO.md                 # Development task list
└── README.md               # This file
```

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles and authentication
- **tests**: Test listings created by hirers
- **applications**: Test taker applications
- **messages**: Direct messaging between users
- **payments**: Cryptocurrency payment tracking

See [PRD.md](./PRD.md) for detailed schema definitions.

## 🔐 Security

- Email verification required for all accounts
- Row Level Security (RLS) enabled on all tables
- Secure file uploads with size and type validation
- Input validation and sanitization
- Webhook signature verification for payments
- No storage of private keys or sensitive payment data

## 📚 API Documentation

### CryptAPI.io Integration
- **Ticker Create**: Generate payment addresses
- **Webhooks**: Receive payment confirmations
- **Supported Coins**: BTC, ETH, USDT, and more

### Tatum.io Integration
- **Exchange Rates**: Real-time crypto to fiat conversion
- **Supported Pairs**: BTC/USD, ETH/USD, USDT/USD, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the KISS principle (Keep It Simple, Stupid)
- Write tests first (TDD approach)
- Use ESM modules exclusively
- Follow ESLint and Prettier configurations
- Create new Supabase migrations (never modify existing ones)
- Use `pnpx supabase migrations new` for new migrations

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [CryptAPI.io](https://cryptapi.io) for payment processing
- [Tatum.io](https://tatum.io) for exchange rate data
- [SvelteKit](https://kit.svelte.dev) for the framework

## 📞 Support

For support, email support@tutorlinkup.com or open an issue in the repository.

## 🗺️ Roadmap

See [TODO.md](./TODO.md) for current development tasks and [PRD.md](./PRD.md) for future enhancements.

---

Built with ❤️ using SvelteKit and Supabase
