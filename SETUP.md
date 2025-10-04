# HireTestTakers.com - Setup Guide

This guide will walk you through setting up the HireTestTakers.com development environment from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+**: [Download](https://nodejs.org/)
- **pnpm**: Install with `npm install -g pnpm`
- **Docker & Docker Compose**: [Download](https://www.docker.com/products/docker-desktop)
- **Git**: [Download](https://git-scm.com/)
- **PostgreSQL Client Tools** (for database backups):
  - Ubuntu/Debian: `sudo apt-get install postgresql-client`
  - macOS: `brew install postgresql`
  - Windows: [Download](https://www.postgresql.org/download/)

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/hiretesttakers-web.git
cd hiretesttakers-web

# Install dependencies
pnpm install
```

## Step 2: Set Up Self-Hosted Supabase

### 2.1 Clone Supabase Docker Setup

```bash
# Clone Supabase repository (in a separate directory)
cd ..
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
```

### 2.2 Configure Supabase Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set secure passwords
# Important variables to configure:
# - POSTGRES_PASSWORD
# - JWT_SECRET
# - ANON_KEY
# - SERVICE_ROLE_KEY
```

**Generate secure keys:**

```bash
# Generate JWT secret (use this for JWT_SECRET)
openssl rand -base64 32

# For ANON_KEY and SERVICE_ROLE_KEY, you can use the Supabase CLI
# or generate them at https://supabase.com/docs/guides/self-hosting#api-keys
```

### 2.3 Start Supabase Services

```bash
# Start all Supabase services
docker compose up -d

# Check status
docker compose ps

# View logs (optional)
docker compose logs -f
```

**Services will be available at:**
- Supabase Studio (Database UI): http://localhost:8000
- PostgreSQL Database: localhost:5432
- API Gateway: http://localhost:8000
- Auth: http://localhost:8000/auth/v1

### 2.4 Return to Project Directory

```bash
cd ../../hiretesttakers-web
```

## Step 3: Configure Project Environment

### 3.1 Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

### 3.2 Edit .env File

Open `.env` and configure the following:

```env
# Supabase Configuration (from supabase/docker/.env)
PUBLIC_SUPABASE_URL=http://localhost:8000
PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_docker_env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_docker_env

# Database Connection (for backups)
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/postgres

# CryptAPI.io Configuration
CRYPTAPI_CALLBACK_URL=http://localhost:5173/api/webhooks/cryptapi
CRYPTAPI_DESTINATION_ADDRESS=your_crypto_wallet_address

# Tatum.io Configuration
TATUM_API_KEY=your_tatum_api_key

# Application Configuration
NODE_ENV=development
PUBLIC_APP_URL=http://localhost:5173
```

**To get Supabase keys:**
1. Open Supabase Studio at http://localhost:8000
2. Go to Settings → API
3. Copy the `anon` and `service_role` keys

## Step 4: Initialize Database

### 4.1 Initialize Supabase CLI

```bash
# Initialize Supabase in the project
pnpx supabase init
```

This creates a `supabase/` directory with:
- `config.toml` - Supabase configuration
- `migrations/` - Database migration files

### 4.2 Link to Local Supabase

```bash
# Link to your local Supabase instance
pnpx supabase link --project-ref local
```

### 4.3 Create Initial Migration

```bash
# Create your first migration
pnpx supabase migration new initial_schema

# Note: The command will hang - just kill it (Ctrl+C)
# The migration file will be created in supabase/migrations/
```

## Step 5: Run the Application

### 5.1 Start Development Server

```bash
# Start the SvelteKit development server
pnpm run dev
```

The application will be available at: http://localhost:5173

### 5.2 Access Supabase Studio

Open http://localhost:8000 to access the Supabase Studio interface where you can:
- View and edit database tables
- Run SQL queries
- Manage authentication
- View API logs

## Step 6: Database Management

### Create a Backup

```bash
# Export the database to a timestamped SQL file
pnpm run db:export
```

Backups are saved to `backups/` directory.

### Restore from Backup

```bash
# Import a database backup (interactive selection)
pnpm run db:import

# Or specify a file directly
pnpm run db:import backups/hiretesttakers_2024-01-01_12-00-00.sql
```

### Create New Migration

```bash
# Generate a new migration file
pnpm run supabase:migration

# Kill the process immediately (Ctrl+C)
# Edit the generated file in supabase/migrations/
```

### Apply Migrations

```bash
# Push migrations to the database
pnpm run supabase:push
```

### Reset Database

```bash
# Reset database and reapply all migrations
pnpm run supabase:reset
```

## Step 7: Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Code Quality

```bash
# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format

# Check formatting
pnpm run format:check
```

### Building for Production

```bash
# Build the application
pnpm run build

# Preview production build
pnpm run preview
```

## Step 8: External Service Setup

### 8.1 CryptAPI.io

1. Sign up at https://cryptapi.io
2. No API key required for basic usage
3. Configure webhook URL in `.env`:
   ```
   CRYPTAPI_CALLBACK_URL=https://yourdomain.com/api/webhooks/cryptapi
   ```

### 8.2 Tatum.io

1. Sign up at https://tatum.io
2. Get your API key from the dashboard
3. Add to `.env`:
   ```
   TATUM_API_KEY=your_api_key_here
   ```

## Troubleshooting

### Supabase Services Not Starting

```bash
# Check Docker status
docker compose ps

# View logs
docker compose logs

# Restart services
docker compose restart

# Stop and remove all containers
docker compose down
docker compose up -d
```

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   docker compose ps postgres
   ```

2. Check connection string in `.env`

3. Test connection:
   ```bash
   psql postgresql://postgres:your_password@localhost:5432/postgres
   ```

### Port Conflicts

If ports 5432 or 8000 are already in use:

1. Edit `supabase/docker/.env`
2. Change port mappings in `docker-compose.yml`
3. Update `.env` in your project

### Migration Issues

```bash
# Check migration status
pnpx supabase migration list

# Repair migrations
pnpx supabase migration repair

# Reset and reapply
pnpm run supabase:reset
```

## Useful Commands

```bash
# Supabase
pnpm run supabase:start      # Start Supabase services
pnpm run supabase:stop       # Stop Supabase services
pnpm run supabase:status     # Check service status

# Database
pnpm run db:export           # Backup database
pnpm run db:import           # Restore database

# Development
pnpm run dev                 # Start dev server
pnpm run build               # Build for production
pnpm run preview             # Preview production build

# Testing
pnpm test                    # Run tests
pnpm test:watch              # Run tests in watch mode
pnpm test:coverage           # Run tests with coverage

# Code Quality
pnpm run lint                # Lint code
pnpm run lint:fix            # Fix linting issues
pnpm run format              # Format code
```

## Next Steps

1. Review the [PRD.md](./PRD.md) for product requirements
2. Check [TODO.md](./TODO.md) for development tasks
3. Read the [README.md](./README.md) for project overview
4. Start implementing features following the TODO list

## Getting Help

- **Documentation**: See [README.md](./README.md) and [PRD.md](./PRD.md)
- **Issues**: Open an issue on GitHub
- **Supabase Docs**: https://supabase.com/docs
- **SvelteKit Docs**: https://kit.svelte.dev/docs

---

**Happy coding! 🚀**