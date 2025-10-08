#!/bin/bash

# Check current Supabase auth configuration

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "🔍 Checking Supabase Auth Configuration"
echo "========================================"
echo ""

if [ -z "$SUPABASE_ACCESS_TOKEN" ] || [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "❌ Missing required environment variables"
    echo "Please set SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF in .env"
    exit 1
fi

echo "📡 Fetching current auth settings..."
echo ""

API_URL="https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF/config/auth"

RESPONSE=$(curl -s "$API_URL" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json")

echo "Current Configuration:"
echo "====================="
echo "$RESPONSE" | jq -r '
  "Site URL: \(.SITE_URL // "not set")",
  "Auto Confirm: \(.MAILER_AUTOCONFIRM // "not set")",
  "Email Enabled: \(.EXTERNAL_EMAIL_ENABLED // "not set")",
  "Disable Signup: \(.DISABLE_SIGNUP // "not set")"
'

echo ""
echo "Expected Configuration:"
echo "======================"
echo "Site URL: https://tutorlinkup.com"
echo "Auto Confirm: false (email confirmation enabled)"
echo ""

CURRENT_SITE_URL=$(echo "$RESPONSE" | jq -r '.SITE_URL // "not set"')

if [ "$CURRENT_SITE_URL" = "http://localhost:8080" ]; then
    echo "⚠️  WARNING: Site URL is still set to localhost!"
    echo ""
    echo "To fix this, run:"
    echo "  ./scripts/setup-supabase.sh"
    echo ""
    echo "Or update manually in the dashboard:"
    echo "  https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/auth/url-configuration"
elif [ "$CURRENT_SITE_URL" = "https://tutorlinkup.com" ]; then
    echo "✅ Site URL is correctly configured!"
else
    echo "⚠️  Site URL is set to: $CURRENT_SITE_URL"
    echo "Expected: https://tutorlinkup.com"
fi