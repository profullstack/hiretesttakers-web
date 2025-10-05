# Railway Deployment Guide

## Overview

HireTestTakers.com is configured for deployment on Railway.app with persistent volumes for database and file uploads.

## Prerequisites

- Railway account (https://railway.app)
- Railway CLI installed (`npm install -g @railway/cli`)
- Git repository initialized
- All environment variables configured

## Persistent Volumes

The application uses two persistent volumes to maintain data across deployments:

### 1. Database Volume
- **Mount Path**: `/app/volumes/db`
- **Purpose**: PostgreSQL database files
- **Size**: Recommended 10GB minimum

### 2. Uploads Volume
- **Mount Path**: `/app/volumes/uploads`
- **Purpose**: User avatars and file uploads
- **Size**: Recommended 5GB minimum

## Deployment Steps

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Railway Project

```bash
# In your project directory
railway init

# Follow prompts to create or link project
```

### 4. Create Persistent Volumes

```bash
# Create database volume
railway volume create database --mount-path /app/volumes/db

# Create uploads volume
railway volume create uploads --mount-path /app/volumes/uploads
```

### 5. Set Environment Variables

```bash
# Set all required environment variables
railway variables set PUBLIC_SUPABASE_URL=your_value
railway variables set PUBLIC_SUPABASE_ANON_KEY=your_value
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_value
railway variables set DATABASE_URL=your_value
railway variables set CRYPTAPI_CALLBACK_URL=your_value
railway variables set COMMISSION_RATE=0.03
railway variables set PLATFORM_WALLET_BTC=your_value
railway variables set PLATFORM_WALLET_ETH=your_value
railway variables set PLATFORM_WALLET_DOGE=your_value
railway variables set PLATFORM_WALLET_SOL=your_value
railway variables set TATUM_API_KEY=your_value
railway variables set OPENAI_API_KEY=your_value
railway variables set NODE_ENV=production
```

Or use the Railway dashboard to set variables via UI.

### 6. Deploy

```bash
# Deploy to Railway
railway up

# Or link to GitHub for automatic deployments
railway link
```

## Configuration Files

### railway.json
Defines build and deployment configuration with volume mounts.

### railway.toml
Alternative configuration format (Railway supports both).

## Environment Variables Required

### Supabase
- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `DATABASE_URL` - PostgreSQL connection string

### Payment Processing
- `CRYPTAPI_CALLBACK_URL` - Webhook URL for payment notifications
- `COMMISSION_RATE` - Platform commission rate (default: 0.03)
- `PLATFORM_WALLET_BTC` - Bitcoin wallet for commission
- `PLATFORM_WALLET_ETH` - Ethereum wallet for commission
- `PLATFORM_WALLET_DOGE` - Dogecoin wallet for commission
- `PLATFORM_WALLET_SOL` - Solana wallet for commission

### External APIs
- `TATUM_API_KEY` - Tatum.io API key for exchange rates
- `OPENAI_API_KEY` - OpenAI API key for free tools

### Application
- `NODE_ENV` - Set to "production"
- `PUBLIC_APP_URL` - Your Railway app URL

## Post-Deployment

### 1. Run Database Migrations

You have several options for running migrations:

#### Option A: Using the migration script (Recommended)

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your_railway_database_url"

# Run migrations against production
pnpm run db:migrate:prod
```

#### Option B: Using Railway's run command

```bash
# Run migrations directly on Railway
railway run pnpm run db:migrate
```

#### Option C: SSH into Railway container

```bash
# SSH into Railway container
railway run bash

# Run migrations
pnpm run db:migrate
```

**For detailed migration instructions, see [`docs/MIGRATION_GUIDE.md`](docs/MIGRATION_GUIDE.md)**

### 2. Verify Volumes

```bash
# Check database volume
ls -la /app/volumes/db

# Check uploads volume
ls -la /app/volumes/uploads
```

### 3. Test Application

- Visit your Railway URL
- Test signup/login
- Upload an avatar
- Create a test listing
- Verify database persistence

## Monitoring

### View Logs

```bash
railway logs
```

### Check Deployment Status

```bash
railway status
```

### View Metrics

```bash
railway metrics
```

## Backup Strategy

### Database Backups

```bash
# Export database (run locally or via Railway)
railway run pnpm run db:export

# Download backup
railway run cat backups/latest.sql > local-backup.sql
```

### Volume Backups

Railway automatically backs up volumes, but you can also:

```bash
# Create manual snapshot
railway volume snapshot create database

# List snapshots
railway volume snapshot list
```

## Scaling

### Horizontal Scaling

Railway supports horizontal scaling:

```bash
railway scale --replicas 3
```

**Note**: With persistent volumes, ensure proper file locking and database connection pooling.

### Vertical Scaling

Upgrade your Railway plan for more resources:
- More CPU
- More RAM
- Larger volumes

## Troubleshooting

### Volume Not Mounting

1. Check volume exists: `railway volume list`
2. Verify mount path in railway.json
3. Restart deployment: `railway up --detach`

### Database Connection Issues

1. Check DATABASE_URL is correct
2. Verify Supabase is running
3. Check volume permissions

### Upload Failures

1. Verify uploads volume is mounted
2. Check directory permissions
3. Ensure sufficient volume space

## Cost Optimization

### Free Tier Limits
- $5/month credit
- 500 hours execution time
- 100GB bandwidth

### Paid Plans
- Starter: $5/month
- Pro: $20/month
- Custom: Contact sales

### Volume Pricing
- $0.25/GB/month for persistent volumes

## Security

### Environment Variables
- Never commit .env to git
- Use Railway's encrypted variable storage
- Rotate keys regularly

### Database
- Use strong passwords
- Enable SSL connections
- Regular backups

### Volumes
- Restrict file permissions
- Validate uploads
- Scan for malware

## CI/CD Integration

### GitHub Integration

```bash
# Link GitHub repository
railway link

# Enable automatic deployments
# Railway will deploy on every push to main branch
```

### Custom Workflows

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g @railway/cli
      - run: railway up --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: GitHub Issues

---

**Deployment checklist:**
- [ ] Railway CLI installed
- [ ] Project initialized
- [ ] Volumes created (database, uploads)
- [ ] Environment variables set
- [ ] Migrations applied
- [ ] Application tested
- [ ] Monitoring configured
- [ ] Backups scheduled