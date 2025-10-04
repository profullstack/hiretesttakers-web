# Setup Script Note

## Issue

The `pnpm run setup` script hangs at "Database Setup" because it tries to:
1. Clone Supabase repository
2. Start Docker containers
3. Prompt for user input

## Solution

Since Supabase is already initialized, you can skip the full setup and just:

### Option 1: Manual Setup (Recommended)

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your values
# Add your API keys manually

# 3. Start Supabase (if using Docker)
cd ../supabase/docker
docker compose up -d
cd ../../hiretesttakers-web

# 4. Apply migrations
pnpx supabase db push

# 5. Start development
pnpm run dev
```

### Option 2: Skip Database Setup

Comment out the database setup step in `scripts/setup.js` (lines 108-118) if you already have Supabase configured.

### Option 3: Use Individual Scripts

```bash
# Just run what you need
pnpm install              # Install dependencies
pnpm run db:export        # Backup database
pnpm run db:import        # Restore database
pnpm test                 # Run tests
pnpm run dev              # Start dev server
```

## Current State

✅ Dependencies installed
✅ Supabase initialized
✅ Migrations created
✅ Tests passing (38)
✅ Build working

**You can start developing immediately with:**
```bash
pnpm run dev
```

## For Production

Use Railway deployment:
```bash
railway init
railway up
```

See DEPLOYMENT.md for complete guide.