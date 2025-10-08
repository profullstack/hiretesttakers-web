#!/usr/bin/env node

/**
 * Update Supabase Site URL using Management API
 * This fixes email confirmation redirects pointing to localhost
 * 
 * Usage:
 *   node scripts/update-supabase-site-url.js
 */

import 'dotenv/config';

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://tutorlinkup.com';
const ENABLE_CONFIRMATIONS = process.env.ENABLE_CONFIRMATIONS === 'true';

console.log('🔧 Updating Supabase Site URL Configuration');
console.log('===========================================\n');

if (!SUPABASE_ACCESS_TOKEN || !SUPABASE_PROJECT_REF) {
	console.error('❌ Error: Missing required environment variables');
	console.error('   SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF must be set in .env\n');
	process.exit(1);
}

console.log('Configuration:');
console.log(`  Project Ref: ${SUPABASE_PROJECT_REF}`);
console.log(`  Site URL: ${SITE_URL}`);
console.log(`  Email Confirmations: ${ENABLE_CONFIRMATIONS}\n`);

const apiUrl = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/config/auth`;

// First, get current config
console.log('🔍 Fetching current configuration...\n');

try {
	const getCurrentConfig = await fetch(apiUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
			'Content-Type': 'application/json'
		}
	});

	if (!getCurrentConfig.ok) {
		const error = await getCurrentConfig.text();
		throw new Error(`Failed to fetch current config: HTTP ${getCurrentConfig.status}: ${error}`);
	}

	const currentConfig = await getCurrentConfig.json();
	console.log('Current configuration:');
	console.log(JSON.stringify(currentConfig, null, 2));
	console.log('');

	// Update with correct field names (lowercase with underscores)
	const payload = {
		site_url: SITE_URL,
		uri_allow_list: `${SITE_URL}/**,${SITE_URL}/auth/callback`,
		mailer_autoconfirm: !ENABLE_CONFIRMATIONS,
		external_email_enabled: true,
		disable_signup: false
	};

	console.log('📝 Applying new configuration...\n');

	const response = await fetch(apiUrl, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`HTTP ${response.status}: ${error}`);
	}

	const result = await response.json();

	console.log('✅ Successfully updated authentication settings!\n');
	console.log('Settings applied:');
	console.log(`  - Site URL: ${SITE_URL}`);
	console.log(`  - URI Allow List: ${SITE_URL}/**,${SITE_URL}/auth/callback`);
	console.log(`  - Email Confirmations: ${ENABLE_CONFIRMATIONS}`);
	console.log(`  - Auto Confirm: ${!ENABLE_CONFIRMATIONS}\n`);
	console.log('⚠️  Note: Changes may take a few minutes to propagate\n');
	console.log('🎉 Setup complete!\n');
	console.log('Next steps:');
	console.log('1. Wait a few minutes for changes to propagate');
	console.log('2. Test signup on your application');
	if (ENABLE_CONFIRMATIONS) {
		console.log('3. Check your email for confirmation link');
		console.log(`   (should redirect to ${SITE_URL}/auth/callback)`);
	} else {
		console.log('3. You should be able to log in immediately');
	}
} catch (error) {
	console.error('❌ Failed to update settings');
	console.error(`Error: ${error.message}\n`);
	process.exit(1);
}