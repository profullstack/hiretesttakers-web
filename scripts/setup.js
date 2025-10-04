#!/usr/bin/env node

/**
 * Setup Script for HireTestTakers.com
 * 
 * Uses Supabase CLI for local development.
 * Prompts for API keys and creates working .env file.
 * 
 * Usage: pnpm run setup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const question = (rl, query) => new Promise((resolve) => rl.question(query, resolve));

const setup = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 HireTestTakers.com - Setup');
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
    
    // Prompt for API keys
    console.log('\n🔑 Step 4: API Configuration\n');
    console.log('Press Enter to skip optional keys\n');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const tatumKey = await question(rl, 'Tatum.io API Key (optional): ');
    const openaiKey = await question(rl, 'OpenAI API Key (optional): ');
    
    console.log('\n💰 Platform Wallet Addresses (for 3% commission)\n');
    const btcWallet = await question(rl, 'Bitcoin (BTC) wallet (optional): ');
    const ethWallet = await question(rl, 'Ethereum (ETH) wallet (optional): ');
    const dogeWallet = await question(rl, 'Dogecoin (DOGE) wallet (optional): ');
    const solWallet = await question(rl, 'Solana (SOL) wallet (optional): ');
    
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
    
    if (!tatumKey || !openaiKey) {
      console.log('💡 Tip: Add missing API keys to .env later:');
      if (!tatumKey) console.log('   - Tatum.io key (for exchange rates)');
      if (!openaiKey) console.log('   - OpenAI key (for free tools)');
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