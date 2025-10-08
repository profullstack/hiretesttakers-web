#!/bin/bash

# Supabase Email Confirmation Setup Script (using CLI)
# This script configures email confirmation settings using pnpx supabase CLI

set -e

echo "🔧 Supabase Email Confirmation Setup (CLI)"
echo "==========================================="
echo ""

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
    echo ""
fi

# Configuration
SITE_URL=${PUBLIC_SITE_URL:-"https://tutorlinkup.com"}
ENABLE_CONFIRMATIONS=${ENABLE_CONFIRMATIONS:-"true"}

echo "Configuration:"
echo "  Site URL: $SITE_URL"
echo "  Email Confirmations: $ENABLE_CONFIRMATIONS"
echo ""

# Check if supabase is linked
echo "🔗 Checking Supabase project link..."
if ! pnpx supabase status &>/dev/null; then
    echo "⚠️  Project not linked. Linking now..."
    echo ""
    echo "You'll need your project reference: $SUPABASE_PROJECT_REF"
    pnpx supabase link --project-ref "$SUPABASE_PROJECT_REF"
fi

echo ""
echo "📝 Updating auth configuration..."
echo ""

# Update auth settings using CLI
# Note: The CLI doesn't have direct commands for all auth settings,
# so we'll use the secrets command to update the site URL
pnpx supabase secrets set SITE_URL="$SITE_URL"

echo ""
echo "✅ Site URL updated to: $SITE_URL"
echo ""
echo "⚠️  Additional Configuration Required:"
echo ""
echo "To complete the setup, you need to update these settings in the Supabase Dashboard:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/auth/url-configuration"
echo "2. Set 'Site URL' to: $SITE_URL"
echo "3. Add redirect URLs:"
echo "   - $SITE_URL/**"
echo "   - $SITE_URL/auth/callback"
echo ""
echo "4. Go to: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/auth/providers"
echo "5. Under 'Email' provider settings:"
if [ "$ENABLE_CONFIRMATIONS" = "true" ]; then
    echo "   - Enable 'Confirm email'"
else
    echo "   - Disable 'Confirm email'"
fi
echo ""
echo "🎉 CLI setup complete!"
echo ""
echo "After updating the dashboard settings:"
echo "1. Wait a few minutes for changes to propagate"
echo "2. Test signup on your application"
if [ "$ENABLE_CONFIRMATIONS" = "true" ]; then
    echo "3. Check your email for confirmation link (should redirect to $SITE_URL)"
else
    echo "3. You should be able to log in immediately"
fi