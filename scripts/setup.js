#!/usr/bin/env node

/**
 * Setup Script for TutorLinkup.com
 * 
 * Uses Supabase CLI for local development.
 * Prompts for API keys and creates working .env file.
 * 
 * Usage: pnpm run setup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const question = (rl, query) => new Promise((resolve) => rl.question(query, resolve));

// Parse existing .env file
const parseEnvFile = (content) => {
  const env = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
  return env;
};

const setup = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 TutorLinkup.com - Setup');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Check prerequisites
    console.log('📋 Step 1: Checking prerequisites...\n');
    
    try {
      await execAsync('node --version');
      console.log('✅ Node.js installed');
    } catch {
      console.error('❌ Node.js not found. Install from: https://nodejs.org/');
      process.exit(1);
    }
    
    try {
      await execAsync('pnpm --version');
      console.log('✅ pnpm installed');
    } catch {
      console.error('❌ pnpm not found. Install with: npm install -g pnpm');
      process.exit(1);
    }
    
    // Install dependencies
    console.log('\n📦 Step 2: Installing dependencies...\n');
    if (!existsSync(path.join(projectRoot, 'node_modules'))) {
      await execAsync('pnpm install', { cwd: projectRoot });
      console.log('✅ Dependencies installed');
    } else {
      console.log('✅ Dependencies already installed');
    }
    
    // Initialize Supabase
    console.log('\n🗄️  Step 3: Initializing Supabase...\n');
    if (!existsSync(path.join(projectRoot, 'supabase', 'config.toml'))) {
      await execAsync('pnpx supabase init', { cwd: projectRoot });
      console.log('✅ Supabase initialized');
    } else {
      console.log('✅ Supabase already initialized');
    }
    
    // Check for existing .env file
    console.log('\n🔑 Step 4: API Configuration\n');
    
    const envPath = path.join(projectRoot, '.env');
    let existingEnv = {};
    let overwriteAll = false;
    
    if (existsSync(envPath)) {
      const envContent = await readFile(envPath, 'utf-8');
      existingEnv = parseEnvFile(envContent);
      
      console.log('⚠️  Existing .env file found!\n');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const overwrite = await question(rl, 'Overwrite all values? [y/N]: ');
      overwriteAll = overwrite.toLowerCase() === 'y';
      rl.close();
      
      if (!overwriteAll) {
        console.log('\n✓ Will only prompt for undefined variables\n');
      } else {
        console.log('\n✓ Will prompt for all variables\n');
      }
    }
    
    console.log('Press Enter to skip optional keys\n');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Helper to conditionally prompt
    const conditionalPrompt = async (key, prompt, defaultValue = '') => {
      if (!overwriteAll && existingEnv[key] && existingEnv[key] !== defaultValue) {
        console.log(`${prompt}[using existing: ${existingEnv[key].substring(0, 20)}...]`);
        return existingEnv[key];
      }
      return await question(rl, prompt);
    };
    
    const tatumKey = await conditionalPrompt('TATUM_API_KEY', 'Tatum.io API Key (optional): ', 'your_tatum_api_key_here');
    const openaiKey = await conditionalPrompt('OPENAI_API_KEY', 'OpenAI API Key (optional): ', 'your_openai_api_key_here');
    
    console.log('\n📧 Mailgun Configuration (for email notifications)\n');
    console.log('Sign up at https://mailgun.com to get your API credentials\n');
    const mailgunKey = await conditionalPrompt('MAILGUN_API_KEY', 'Mailgun API Key (optional): ', 'your_mailgun_api_key_here');
    const mailgunDomain = await conditionalPrompt('MAILGUN_DOMAIN', 'Mailgun Domain (optional): ', 'your_mailgun_domain_here');
    const mailgunFrom = await conditionalPrompt('MAILGUN_FROM_EMAIL', 'Mailgun From Email (optional): ', 'noreply@yourdomain.com');
    
    console.log('\n💰 Platform Wallet Addresses (for 3% commission)\n');
    const btcWallet = await conditionalPrompt('PLATFORM_WALLET_BTC', 'Bitcoin (BTC) wallet (optional): ', 'your_bitcoin_address_here');
    const ethWallet = await conditionalPrompt('PLATFORM_WALLET_ETH', 'Ethereum (ETH) wallet (optional): ', 'your_ethereum_address_here');
    const dogeWallet = await conditionalPrompt('PLATFORM_WALLET_DOGE', 'Dogecoin (DOGE) wallet (optional): ', 'your_dogecoin_address_here');
    const solWallet = await conditionalPrompt('PLATFORM_WALLET_SOL', 'Solana (SOL) wallet (optional): ', 'your_solana_address_here');
    
    rl.close();
    
    // Create .env file
    console.log('\n📝 Step 5: Creating .env file...\n');
    
    const envContent = `# Supabase Configuration (Local CLI)
# These are the default local development keys
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Database Connection (Local)
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# CryptAPI Configuration
CRYPTAPI_CALLBACK_URL=http://localhost:8080/api/webhooks/cryptapi

# Platform Commission (3%)
COMMISSION_RATE=0.03

# Platform Wallet Addresses
PLATFORM_WALLET_BTC=${btcWallet || 'your_bitcoin_address_here'}
PLATFORM_WALLET_ETH=${ethWallet || 'your_ethereum_address_here'}
PLATFORM_WALLET_DOGE=${dogeWallet || 'your_dogecoin_address_here'}
PLATFORM_WALLET_SOL=${solWallet || 'your_solana_address_here'}

# External APIs
TATUM_API_URL=https://api.tatum.io/v3
TATUM_API_KEY=${tatumKey || 'your_tatum_api_key_here'}
OPENAI_API_KEY=${openaiKey || 'your_openai_api_key_here'}

# Mailgun Configuration (for email notifications)
MAILGUN_API_KEY=${mailgunKey || 'your_mailgun_api_key_here'}
MAILGUN_DOMAIN=${mailgunDomain || 'your_mailgun_domain_here'}
MAILGUN_FROM_EMAIL=${mailgunFrom || 'noreply@yourdomain.com'}

# Application Configuration
NODE_ENV=development
PORT=8080
PUBLIC_APP_URL=http://localhost:8080
`;
    
    await writeFile(path.join(projectRoot, '.env'), envContent);
    console.log('✅ .env file created with Supabase CLI defaults');
    
    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Setup Complete!');
    console.log('='.repeat(60));
    
    console.log('\n📍 Next Steps:\n');
    console.log('1. Start Supabase (local):');
    console.log('   pnpx supabase start\n');
    
    console.log('2. Apply database migrations:');
    console.log('   pnpx supabase db push\n');
    
    console.log('3. Start development server:');
    console.log('   pnpm run dev\n');
    
    console.log('4. Access your services:');
    console.log('   - App: http://localhost:8080');
    console.log('   - Supabase Studio: http://localhost:54323');
    console.log('   - Database: localhost:54322\n');
    
    console.log('5. Run tests:');
    console.log('   pnpm test  (38 tests should pass)\n');
    
    if (!tatumKey || !openaiKey || !mailgunKey) {
      console.log('💡 Tip: Add missing API keys to .env later:');
      if (!tatumKey) console.log('   - Tatum.io key (for exchange rates)');
      if (!openaiKey) console.log('   - OpenAI key (for free tools)');
      if (!mailgunKey) console.log('   - Mailgun credentials (for email notifications)');
      console.log('');
    }
    
    console.log('📚 Documentation:');
    console.log('   - PROMPTS.md  (13 feature development prompts)');
    console.log('   - PROGRESS.md (current status)');
    console.log('   - README.md   (project overview)\n');
    
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure Node.js and pnpm are installed');
    console.error('   2. Check error message above');
    console.error('   3. See SETUP.md for manual setup\n');
    process.exit(1);
  }
};

setup();