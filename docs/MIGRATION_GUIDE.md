# Database Migration Guide

This guide explains how to run migrations against your Supabase database, whether it's self-hosted on Railway or using Supabase Cloud.

---

## Overview

The Supabase CLI can connect to any PostgreSQL database (local, self-hosted, or cloud) and apply migrations from your `supabase/migrations/` directory.

---

## Method 1: Using Supabase CLI with Database URL (Recommended for Railway)

This is the best approach for self-hosted databases on Railway or any remote PostgreSQL instance.

### Step 1: Link to Remote Database

You have two options:

#### Option A: Using `supabase link` (Recommended)

```bash
# Link to your remote database
pnpx supabase link --project-ref your-project-ref

# Or use the database URL directly
pnpx supabase link --db-url "postgresql://postgres:password@host:port/postgres"
```

#### Option B: Set Environment Variable

```bash
# Set the database URL
export DATABASE_URL="postgresql://postgres:password@host:port/postgres"

# Or add to your .env file
echo 'DATABASE_URL="postgresql://postgres:password@host:port/postgres"' >> .env
```

### Step 2: Apply Migrations

```bash
# Push all pending migrations to the remote database
pnpx supabase db push

# Or specify the database URL directly
pnpx supabase db push --db-url "$DATABASE_URL"
```

### Step 3: Verify Migrations

```bash
# Check migration status
pnpx supabase migration list

# View current database schema
pnpx supabase db diff
```

---

## Method 2: Using Direct PostgreSQL Connection

If you prefer to use standard PostgreSQL tools:

### Using psql

```bash
# Connect to your database
psql "$DATABASE_URL"

# Run migrations manually
\i supabase/migrations/20231201000000_initial_schema.sql
\i supabase/migrations/20231202000000_add_profiles.sql
# ... etc
```

### Using Node.js Script

We've provided a migration script in `scripts/run-migrations.js`:

```bash
# Run all pending migrations
node scripts/run-migrations.js

# Or with pnpm
pnpm run migrate
```

---

## Railway Deployment: Migration Workflow

### During Initial Deployment

```bash
# 1. Deploy your application to Railway
railway up

# 2. Get your database URL from Railway
railway variables get DATABASE_URL

# 3. Run migrations
pnpx supabase db push --db-url "$DATABASE_URL"

# Or use Railway's run command
railway run pnpx supabase db push
```

### For Subsequent Deployments

```bash
# Option 1: Run migrations from your local machine
pnpx supabase db push --db-url "$RAILWAY_DATABASE_URL"

# Option 2: SSH into Railway and run migrations
railway run bash
pnpx supabase db push

# Option 3: Add to Railway's build/deploy process
# (See railway.json configuration below)
```

---

## Automated Migrations in Railway

### Option A: Post-Deploy Hook (Recommended)

Add to your `railway.json`:

```json
{
  "build": {
    "buildCommand": "pnpm install && pnpm run build"
  },
  "deploy": {
    "startCommand": "node build/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  },
  "hooks": {
    "postDeploy": "pnpx supabase db push"
  }
}
```

### Option B: Custom Deploy Script

Create `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "Running database migrations..."
pnpx supabase db push

echo "Starting application..."
node build/index.js
```

Update `railway.json`:

```json
{
  "deploy": {
    "startCommand": "bash scripts/deploy.sh"
  }
}
```

---

## Migration Best Practices

### 1. Always Test Locally First

```bash
# Start local Supabase
pnpm run supabase:start

# Test migrations locally
pnpx supabase db push

# Verify everything works
pnpm run dev
```

### 2. Create Backups Before Migrations

```bash
# Export current database state
pnpm run db:export

# Or use pg_dump directly
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d-%H%M%S).sql
```

### 3. Use Transactions in Migrations

Always wrap your migrations in transactions:

```sql
-- supabase/migrations/20231201000000_example.sql
BEGIN;

-- Your migration code here
CREATE TABLE IF NOT EXISTS example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
```

### 4. Make Migrations Idempotent

Use `IF NOT EXISTS`, `IF EXISTS`, etc.:

```sql
-- Safe to run multiple times
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY
);

ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_users_email 
  ON users(email);
```

---

## Troubleshooting

### Connection Issues

```bash
# Test database connection
psql "$DATABASE_URL" -c "SELECT version();"

# Check if migrations table exists
psql "$DATABASE_URL" -c "SELECT * FROM supabase_migrations.schema_migrations;"
```

### Migration Conflicts

```bash
# View migration history
pnpx supabase migration list

# Repair migration history (if needed)
pnpx supabase migration repair --status applied <migration-version>
```

### Reset Database (Development Only)

```bash
# WARNING: This will delete all data!
pnpx supabase db reset

# For remote database (use with extreme caution)
pnpx supabase db reset --db-url "$DATABASE_URL"
```

---

## Environment-Specific Configurations

### Development (.env.local)

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
```

### Staging (.env.staging)

```bash
DATABASE_URL="postgresql://postgres:password@staging-db.railway.app:5432/railway"
```

### Production (.env.production)

```bash
DATABASE_URL="postgresql://postgres:password@production-db.railway.app:5432/railway"
```

---

## Migration Scripts Reference

### Available Commands

```bash
# Create new migration
pnpm run supabase:migration

# Apply migrations
pnpm run migrate              # Using custom script
pnpx supabase db push         # Using Supabase CLI

# View migration status
pnpm run supabase:status
pnpx supabase migration list

# Reset database (dev only)
pnpm run supabase:reset

# Export database
pnpm run db:export

# Import database
pnpm run db:import
```

---

## Security Considerations

1. **Never commit database credentials** to version control
2. **Use environment variables** for all database URLs
3. **Restrict database access** to specific IP addresses when possible
4. **Use SSL connections** in production
5. **Rotate credentials** regularly
6. **Backup before migrations** in production

---

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Railway Database Guide](https://docs.railway.app/databases/postgresql)

---

## Quick Reference

```bash
# Most common workflow for Railway deployment:

# 1. Create migration locally
pnpx supabase migration new feature_name

# 2. Write your SQL in the generated file
# Edit: supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql

# 3. Test locally
pnpx supabase db push

# 4. Deploy to Railway
railway up

# 5. Run migrations on Railway
railway run pnpx supabase db push

# Done! ✅