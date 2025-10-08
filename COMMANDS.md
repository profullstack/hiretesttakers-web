# Quick Command Reference

## Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Code Quality

```bash
# Lint code
pnpm run lint

# Fix linting issues automatically
pnpm run lint:fix

# Format code with Prettier
pnpm run format

# Check if code is formatted
pnpm run format:check

# Type check (if using TypeScript)
pnpm run check

# Type check in watch mode
pnpm run check:watch
```

## Database Management

```bash
# Initial automated setup (first time only)
pnpm run db:setup

# Export database (create backup)
pnpm run db:export

# Import database (restore from backup)
pnpm run db:import

# Import specific backup file
pnpm run db:import backups/filename.sql
```

## Supabase

```bash
# Start Supabase services (Docker)
pnpm run supabase:start

# Stop Supabase services
pnpm run supabase:stop

# Check Supabase service status
pnpm run supabase:status

# Create new migration (will hang - kill immediately)
pnpm run supabase:migration

# Push migrations to database
pnpm run supabase:push

# Reset database and reapply all migrations
pnpm run supabase:reset
```

## Docker (Supabase)

```bash
# Start Supabase services
cd ../supabase/docker
docker compose up -d

# Stop Supabase services
docker compose down

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Check service status
docker compose ps
```

## Package Management

```bash
# Install dependencies
pnpm install

# Add a dependency
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name

# Update dependencies
pnpm update

# Update specific package
pnpm update package-name
```

## Git

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to remote
git push origin main

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name

# View status
git status

# View commit history
git log --oneline
```

## Useful Shortcuts

```bash
# Install and run dev server in one command
pnpm install && pnpm run dev

# Format and lint before committing
pnpm run format && pnpm run lint

# Run all quality checks
pnpm run format:check && pnpm run lint && pnpm test

# Backup database before making changes
pnpm run db:export && pnpm run supabase:push
```

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
# or
code .env
```

## Troubleshooting

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear SvelteKit cache
rm -rf .svelte-kit

# Reset Supabase database
pnpm run supabase:reset

# View Supabase logs
cd ../supabase/docker
docker compose logs -f postgres
docker compose logs -f kong
```

## Access URLs

- **Development Server**: http://localhost:5173
- **Supabase Studio**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **API Gateway**: http://localhost:8000

## Quick Setup (First Time)

```bash
# 1. Install dependencies
pnpm install

# 2. Automated Supabase setup (recommended)
pnpm run db:setup

# 3. Configure external services in .env
# Add CryptAPI and Tatum credentials

# 4. Initialize Supabase CLI
pnpx supabase init

# 5. Start development
pnpm run dev
```

**Alternative Manual Setup:**
```bash
# 1. Install dependencies
pnpm install

# 2. Set up Supabase manually (in separate terminal)
cd ../supabase/docker
docker compose up -d
cd ../../tutorlinkup-web

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Initialize Supabase
pnpx supabase init

# 5. Start development
pnpm run dev
```

## Daily Workflow

```bash
# Morning: Start services
cd ../supabase/docker && docker compose up -d && cd ../../tutorlinkup-web
pnpm run dev

# During development: Run tests
pnpm test:watch

# Before committing: Quality checks
pnpm run format && pnpm run lint && pnpm test

# End of day: Backup database
pnpm run db:export

# Evening: Stop services
cd ../supabase/docker && docker compose down
```

---

For more detailed information, see:
- [SETUP.md](./SETUP.md) - Complete setup guide
- [README.md](./README.md) - Project documentation
- [TODO.md](./TODO.md) - Development tasks