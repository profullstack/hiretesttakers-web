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

const payload = {
	SITE_URL: SITE_URL,
	MAILER_AUTOCONFIRM: !ENABLE_CONFIRMATIONS, // false = confirmations enabled
	EXTERNAL_EMAIL_ENABLED: true,
	DISABLE_SIGNUP: false
};

console.log('📝 Updating authentication settings...\n');

try {
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
	console.log(`  - Email Confirmations: ${ENABLE_CONFIRMATIONS}`);
	console.log(`  - Auto Confirm: ${!ENABLE_CONFIRMATIONS}\n`);
	console.log('⚠️  Note: Changes may take a few minutes to propagate\n');
	console.log('🎉 Setup complete!\n');
	console.log('Next steps:');
	console.log('1. Wait a few minutes for changes to propagate');
	console.log('2. Test signup on your application');
	if (ENABLE_CONFIRMATIONS) {
		console.log('3. Check your email for confirmation link');
		console.log(`   (should redirect to ${SITE_URL})`);
	} else {
		console.log('3. You should be able to log in immediately');
	}
} catch (error) {
	console.error('❌ Failed to update settings');
	console.error(`Error: ${error.message}\n`);
	process.exit(1);
}