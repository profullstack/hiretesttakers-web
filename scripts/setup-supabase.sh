#!/bin/bash

# Supabase Email Confirmation Setup Script
# This script configures email confirmation settings for your Supabase project
# using the Supabase Management API

set -e

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
    echo ""
fi

echo "� Supabase Email Confirmation Setup"
echo "===================================="
echo ""

# Check if required environment variables are set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Error: SUPABASE_ACCESS_TOKEN is not set"
    echo ""
    echo "To get your access token:"
    echo "1. Go to https://supabase.com/dashboard/account/tokens"
    echo "2. Generate a new access token"
    echo "3. Export it: export SUPABASE_ACCESS_TOKEN='your-token-here'"
    echo ""
    exit 1
fi

if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "❌ Error: SUPABASE_PROJECT_REF is not set"
    echo ""
    echo "To find your project reference:"
    echo "1. Go to your project dashboard"
    echo "2. Look at the URL: https://supabase.com/dashboard/project/YOUR_PROJECT_REF"
    echo "3. Export it: export SUPABASE_PROJECT_REF='your-project-ref'"
    echo ""
    exit 1
fi

# Configuration options
ENABLE_CONFIRMATIONS=${ENABLE_CONFIRMATIONS:-false}
SITE_URL=${PUBLIC_SITE_URL:-"https://tutorlinkup.com"}

echo "Configuration:"
echo "  Project Ref: $SUPABASE_PROJECT_REF"
echo "  Site URL: $SITE_URL"
echo "  Email Confirmations: $ENABLE_CONFIRMATIONS"
echo ""

# Update auth configuration
echo "📝 Updating authentication settings..."

API_URL="https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF/config/auth"

# Prepare the JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "SITE_URL": "$SITE_URL",
  "MAILER_AUTOCONFIRM": $([ "$ENABLE_CONFIRMATIONS" = "true" ] && echo "false" || echo "true"),
  "EXTERNAL_EMAIL_ENABLED": true,
  "DISABLE_SIGNUP": false
}
EOF
)

# Make the API request
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$API_URL" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

# Extract HTTP status code
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
    echo "✅ Successfully updated authentication settings!"
    echo ""
    echo "Settings applied:"
    echo "  - Site URL: $SITE_URL"
    echo "  - Email Confirmations: $ENABLE_CONFIRMATIONS"
    echo ""
    echo "⚠️  Note: Changes may take a few minutes to propagate"
else
    echo "❌ Failed to update settings (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Wait a few minutes for changes to propagate"
echo "2. Test signup on your application"
if [ "$ENABLE_CONFIRMATIONS" = "true" ]; then
    echo "3. Check your email for confirmation link"
else
    echo "3. You should be able to log in immediately"
fi