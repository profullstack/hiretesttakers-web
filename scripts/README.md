# Supabase Setup Scripts

## setup-supabase.sh

This script configures email confirmation settings for your Supabase project using the Supabase Management API.

### Prerequisites

1. **Supabase Access Token**
   - Go to https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Give it a name (e.g., "Setup Script")
   - Copy the token

2. **Project Reference ID**
   - Go to your project dashboard
   - Look at the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
   - Copy the project reference ID

### Usage

#### Disable Email Confirmation (Users can sign up and log in immediately)

```bash
export SUPABASE_ACCESS_TOKEN="your-access-token-here"
export SUPABASE_PROJECT_REF="your-project-ref-here"
export PUBLIC_SITE_URL="https://tutorlinkup.com"
export ENABLE_CONFIRMATIONS="false"

./scripts/setup-supabase.sh
```

#### Enable Email Confirmation (Users must confirm email before logging in)

```bash
export SUPABASE_ACCESS_TOKEN="your-access-token-here"
export SUPABASE_PROJECT_REF="your-project-ref-here"
export PUBLIC_SITE_URL="https://tutorlinkup.com"
export ENABLE_CONFIRMATIONS="true"

./scripts/setup-supabase.sh
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPABASE_ACCESS_TOKEN` | Yes | - | Your Supabase access token |
| `SUPABASE_PROJECT_REF` | Yes | - | Your project reference ID |
| `PUBLIC_SITE_URL` | No | `https://tutorlinkup.com` | Your production site URL |
| `ENABLE_CONFIRMATIONS` | No | `false` | Enable/disable email confirmations |

### What It Does

The script:
1. Validates required environment variables
2. Configures the Site URL for email redirects
3. Enables or disables email confirmation based on `ENABLE_CONFIRMATIONS`
4. Updates your Supabase project settings via the Management API

### Notes

- Changes may take a few minutes to propagate
- The script uses the Supabase Management API, not the CLI
- Make sure your access token has the necessary permissions
- For security, never commit your access token to git

### Troubleshooting

**Error: SUPABASE_ACCESS_TOKEN is not set**
- Make sure you've exported the token: `export SUPABASE_ACCESS_TOKEN="your-token"`

**Error: SUPABASE_PROJECT_REF is not set**
- Make sure you've exported the project ref: `export SUPABASE_PROJECT_REF="your-ref"`

**HTTP 401 Unauthorized**
- Your access token may be invalid or expired
- Generate a new token from the dashboard

**HTTP 403 Forbidden**
- Your access token doesn't have permission to modify project settings
- Make sure you're using a token with admin permissions