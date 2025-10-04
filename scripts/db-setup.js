#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * Automates the initial setup of self-hosted Supabase with Docker:
 * 1. Clones Supabase repository (if needed)
 * 2. Generates secure passwords and keys
 * 3. Configures Supabase Docker environment
 * 4. Starts Supabase services
 * 5. Updates project .env file with credentials
 * 
 * Usage: pnpm run db:setup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import readline from 'readline';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const supabaseDir = path.join(projectRoot, '..', 'supabase');
const supabaseDockerDir = path.join(supabaseDir, 'docker');

// Generate secure random string
const generateSecret = (length = 32) => {
  return randomBytes(length).toString('base64').replace(/[+/=]/g, '').substring(0, length);
};

// Generate JWT secret (base64 encoded)
const generateJwtSecret = () => {
  return randomBytes(32).toString('base64');
};

// Prompt user for confirmation
const confirm = async (question) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(`${question} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
};

// Check if Docker is running
const checkDocker = async () => {
  try {
    await execAsync('docker info');
    return true;
  } catch (error) {
    return false;
  }
};

// Clone Supabase repository
const cloneSupabase = async () => {
  console.log('📦 Cloning Supabase repository...');
  
  const parentDir = path.join(projectRoot, '..');
  await execAsync(`git clone --depth 1 https://github.com/supabase/supabase`, {
    cwd: parentDir
  });
  
  console.log('✅ Supabase repository cloned');
};

// Generate Supabase environment configuration
const generateSupabaseEnv = async () => {
  console.log('🔐 Generating secure credentials...');
  
  const postgresPassword = generateSecret(32);
  const jwtSecret = generateJwtSecret();
  const anonKey = generateSecret(64);
  const serviceRoleKey = generateSecret(64);
  const dashboardPassword = generateSecret(16);
  
  const envContent = `
# Postgres
POSTGRES_PASSWORD=${postgresPassword}

# JWT
JWT_SECRET=${jwtSecret}
JWT_EXPIRY=3600

# API Keys
ANON_KEY=${anonKey}
SERVICE_ROLE_KEY=${serviceRoleKey}

# Dashboard
DASHBOARD_USERNAME=supabase
DASHBOARD_PASSWORD=${dashboardPassword}

# Database
POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432

# API
API_EXTERNAL_URL=http://localhost:8000
SUPABASE_PUBLIC_URL=http://localhost:8000

# Studio
STUDIO_PORT=8000

# Kong
KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443

# Auth
SITE_URL=http://localhost:5173
ADDITIONAL_REDIRECT_URLS=
JWT_EXPIRY=3600
DISABLE_SIGNUP=false
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false
ENABLE_PHONE_SIGNUP=false
ENABLE_PHONE_AUTOCONFIRM=false

# SMTP (optional - configure if you want email)
SMTP_ADMIN_EMAIL=admin@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SENDER_NAME=Supabase

# Storage
STORAGE_BACKEND=file
FILE_SIZE_LIMIT=52428800
`;

  const envPath = path.join(supabaseDockerDir, '.env');
  await writeFile(envPath, envContent.trim());
  
  console.log('✅ Supabase environment configured');
  
  return {
    postgresPassword,
    jwtSecret,
    anonKey,
    serviceRoleKey,
    dashboardPassword
  };
};

// Start Supabase services
const startSupabase = async () => {
  console.log('🚀 Starting Supabase services...');
  console.log('   This may take a few minutes on first run...\n');
  
  try {
    const { stdout } = await execAsync('docker compose up -d', {
      cwd: supabaseDockerDir
    });
    
    console.log(stdout);
    
    // Wait for services to be ready
    console.log('⏳ Waiting for services to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('✅ Supabase services started');
    return true;
  } catch (error) {
    console.error('❌ Failed to start Supabase services:', error.message);
    return false;
  }
};

// Prompt for external API keys
const promptForApiKeys = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => {
    rl.question(query, resolve);
  });
  
  console.log('\n🔑 External API Configuration');
  console.log('   Press Enter to skip any optional keys\n');
  
  const cryptapiCallback = await question('CryptAPI Callback URL (optional, press Enter to skip): ');
  const tatumApiKey = await question('Tatum.io API Key (optional, press Enter to skip): ');
  const openaiApiKey = await question('OpenAI API Key (optional, press Enter to skip): ');
  
  console.log('\n💰 Platform Commission Wallets (3% commission)');
  console.log('   Supported: BTC, ETH, DOGE, SOL\n');
  
  const walletBtc = await question('Bitcoin (BTC) wallet address (optional): ');
  const walletEth = await question('Ethereum (ETH) wallet address (optional): ');
  const walletDoge = await question('Dogecoin (DOGE) wallet address (optional): ');
  const walletSol = await question('Solana (SOL) wallet address (optional): ');
  
  rl.close();
  
  return {
    cryptapiCallback: cryptapiCallback || 'http://localhost:5173/api/webhooks/cryptapi',
    tatumApiKey: tatumApiKey || 'your_tatum_api_key_here',
    openaiApiKey: openaiApiKey || 'your_openai_api_key_here',
    walletBtc: walletBtc || 'your_bitcoin_address_here',
    walletEth: walletEth || 'your_ethereum_address_here',
    walletDoge: walletDoge || 'your_dogecoin_address_here',
    walletSol: walletSol || 'your_solana_address_here'
  };
};

// Update project .env file
const updateProjectEnv = async (credentials, apiKeys) => {
  console.log('\n📝 Creating project .env file...');
  
  const envPath = path.join(projectRoot, '.env');
  const envExamplePath = path.join(projectRoot, '.env.example');
  
  let envContent = '';
  
  // Read existing .env or use .env.example as template
  if (existsSync(envPath)) {
    const shouldOverwrite = await confirm('⚠️  .env file already exists. Overwrite?');
    if (!shouldOverwrite) {
      console.log('ℹ️  Skipping .env update. Manual configuration required.');
      return;
    }
    envContent = await readFile(envPath, 'utf-8');
  } else if (existsSync(envExamplePath)) {
    envContent = await readFile(envExamplePath, 'utf-8');
  }
  
  // Update or add all configuration
  const updates = {
    'PUBLIC_SUPABASE_URL': 'http://localhost:8000',
    'PUBLIC_SUPABASE_ANON_KEY': credentials.anonKey,
    'SUPABASE_SERVICE_ROLE_KEY': credentials.serviceRoleKey,
    'DATABASE_URL': `postgresql://postgres:${credentials.postgresPassword}@localhost:5432/postgres`,
    'CRYPTAPI_CALLBACK_URL': apiKeys.cryptapiCallback,
    'COMMISSION_RATE': '0.03',
    'PLATFORM_WALLET_BTC': apiKeys.walletBtc,
    'PLATFORM_WALLET_ETH': apiKeys.walletEth,
    'PLATFORM_WALLET_DOGE': apiKeys.walletDoge,
    'PLATFORM_WALLET_SOL': apiKeys.walletSol,
    'TATUM_API_KEY': apiKeys.tatumApiKey,
    'OPENAI_API_KEY': apiKeys.openaiApiKey,
    'NODE_ENV': 'development',
    'PUBLIC_APP_URL': 'http://localhost:5173'
  };
  
  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }
  
  await writeFile(envPath, envContent);
  
  console.log('✅ Project .env file created');
  console.log('\n📋 Configuration Summary:');
  console.log('\n🗄️  Supabase:');
  console.log(`   URL: http://localhost:8000`);
  console.log(`   Anon Key: ${credentials.anonKey.substring(0, 20)}...`);
  console.log(`   Service Role Key: ${credentials.serviceRoleKey.substring(0, 20)}...`);
  console.log(`   Database Password: ${credentials.postgresPassword.substring(0, 20)}...`);
  console.log(`   Dashboard Password: ${credentials.dashboardPassword}`);
  
  console.log('\n🔌 External APIs:');
  console.log(`   CryptAPI Callback: ${apiKeys.cryptapiCallback}`);
  console.log(`   Tatum API Key: ${apiKeys.tatumApiKey === 'your_tatum_api_key_here' ? '(not set)' : apiKeys.tatumApiKey.substring(0, 20) + '...'}`);
  console.log(`   OpenAI API Key: ${apiKeys.openaiApiKey === 'your_openai_api_key_here' ? '(not set)' : apiKeys.openaiApiKey.substring(0, 20) + '...'}`);
  
  console.log('\n💰 Platform Wallets (3% commission):');
  console.log(`   BTC: ${apiKeys.walletBtc === 'your_bitcoin_address_here' ? '(not set)' : apiKeys.walletBtc.substring(0, 20) + '...'}`);
  console.log(`   ETH: ${apiKeys.walletEth === 'your_ethereum_address_here' ? '(not set)' : apiKeys.walletEth.substring(0, 20) + '...'}`);
  console.log(`   DOGE: ${apiKeys.walletDoge === 'your_dogecoin_address_here' ? '(not set)' : apiKeys.walletDoge.substring(0, 20) + '...'}`);
  console.log(`   SOL: ${apiKeys.walletSol === 'your_solana_address_here' ? '(not set)' : apiKeys.walletSol.substring(0, 20) + '...'}`);
  
  const hasAllWallets = apiKeys.walletBtc !== 'your_bitcoin_address_here' &&
                        apiKeys.walletEth !== 'your_ethereum_address_here' &&
                        apiKeys.walletDoge !== 'your_dogecoin_address_here' &&
                        apiKeys.walletSol !== 'your_solana_address_here';
  
  if (!hasAllWallets) {
    console.log('\n💡 Tip: Add platform wallet addresses to receive 3% commission on payments');
  }
  
  if (apiKeys.tatumApiKey === 'your_tatum_api_key_here' || apiKeys.openaiApiKey === 'your_openai_api_key_here') {
    console.log('💡 Tip: You can add missing API keys later by editing .env file');
  }
};

// Display access information
const displayInfo = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Supabase Setup Complete!');
  console.log('='.repeat(60));
  console.log('\n📍 Access URLs:');
  console.log('   Supabase Studio: http://localhost:8000');
  console.log('   PostgreSQL: localhost:5432');
  console.log('   API Gateway: http://localhost:8000');
  console.log('\n🔑 Login to Studio:');
  console.log('   Username: supabase');
  console.log('   Password: (check .env file for DASHBOARD_PASSWORD)');
  console.log('\n📚 Next Steps:');
  console.log('   1. Open Supabase Studio at http://localhost:8000');
  console.log('   2. Run: pnpx supabase init');
  console.log('   3. Create your first migration');
  console.log('   4. Start development: pnpm run dev');
  console.log('\n💡 Useful Commands:');
  console.log('   pnpm run db:export    - Backup database');
  console.log('   pnpm run db:import    - Restore database');
  console.log('   docker compose ps     - Check service status');
  console.log('   docker compose logs   - View logs');
  console.log('='.repeat(60) + '\n');
};

// Main setup function
const setup = async () => {
  try {
    console.log('\n🏗️  HireTestTakers.com - Database Setup\n');
    
    // Check Docker
    console.log('🔍 Checking Docker...');
    const dockerRunning = await checkDocker();
    if (!dockerRunning) {
      console.error('❌ Docker is not running. Please start Docker and try again.');
      console.error('   Download Docker: https://www.docker.com/products/docker-desktop');
      process.exit(1);
    }
    console.log('✅ Docker is running\n');
    
    // Check if Supabase directory exists
    if (!existsSync(supabaseDockerDir)) {
      const shouldClone = await confirm('📦 Supabase repository not found. Clone it now?');
      if (!shouldClone) {
        console.log('❌ Setup cancelled. Please clone Supabase manually.');
        process.exit(0);
      }
      await cloneSupabase();
    } else {
      console.log('✅ Supabase repository found\n');
    }
    
    // Check if already configured
    const envPath = path.join(supabaseDockerDir, '.env');
    if (existsSync(envPath)) {
      const shouldReconfigure = await confirm('⚠️  Supabase is already configured. Reconfigure?');
      if (!shouldReconfigure) {
        console.log('ℹ️  Using existing configuration');
        
        // Try to start services
        const started = await startSupabase();
        if (started) {
          displayInfo();
        }
        return;
      }
    }
    
    // Generate configuration
    const credentials = await generateSupabaseEnv();
    
    // Start services
    const started = await startSupabase();
    if (!started) {
      console.error('❌ Failed to start services. Check Docker logs for details.');
      process.exit(1);
    }
    
    // Prompt for API keys
    const apiKeys = await promptForApiKeys();
    
    // Update project .env
    await updateProjectEnv(credentials, apiKeys);
    
    // Display information
    displayInfo();
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure Docker is running');
    console.error('   2. Check if ports 5432 and 8000 are available');
    console.error('   3. Try running: docker compose down (in supabase/docker)');
    console.error('   4. Check Docker logs: docker compose logs');
    process.exit(1);
  }
};

// Run setup
setup();