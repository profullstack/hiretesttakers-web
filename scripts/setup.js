#!/usr/bin/env node

/**
 * Master Setup Script
 * 
 * Orchestrates the complete project setup:
 * 1. Installs dependencies
 * 2. Sets up Supabase with Docker
 * 3. Configures environment variables
 * 4. Initializes database
 * 
 * Usage: pnpm run setup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Check if command exists
const commandExists = async (command) => {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch {
    return false;
  }
};

// Run a script and display output
const runScript = async (scriptPath, description) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 ${description}`);
  console.log('='.repeat(60) + '\n');
  
  try {
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`, {
      cwd: projectRoot,
      env: process.env
    });
    
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

// Main setup function
const setup = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 HireTestTakers.com - Complete Project Setup');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Step 1: Check prerequisites
    console.log('📋 Step 1: Checking prerequisites...\n');
    
    const hasNode = await commandExists('node');
    const hasPnpm = await commandExists('pnpm');
    const hasDocker = await commandExists('docker');
    
    if (!hasNode) {
      console.error('❌ Node.js is not installed');
      console.error('   Download from: https://nodejs.org/');
      process.exit(1);
    }
    console.log('✅ Node.js is installed');
    
    if (!hasPnpm) {
      console.error('❌ pnpm is not installed');
      console.error('   Install with: npm install -g pnpm');
      process.exit(1);
    }
    console.log('✅ pnpm is installed');
    
    if (!hasDocker) {
      console.error('❌ Docker is not installed');
      console.error('   Download from: https://www.docker.com/products/docker-desktop');
      process.exit(1);
    }
    console.log('✅ Docker is installed');
    
    // Step 2: Install dependencies
    console.log('\n📦 Step 2: Installing project dependencies...\n');
    
    if (!existsSync(path.join(projectRoot, 'node_modules'))) {
      console.log('Installing dependencies with pnpm...');
      const { stdout } = await execAsync('pnpm install', { cwd: projectRoot });
      console.log(stdout);
      console.log('✅ Dependencies installed');
    } else {
      console.log('✅ Dependencies already installed');
    }
    
    // Step 3: Set up environment
    console.log('\n🗄️  Step 3: Setting up environment...\n');
    
    // Check if .env exists
    const envPath = path.join(projectRoot, '.env');
    if (!existsSync(envPath)) {
      console.log('Creating .env file from template...');
      const envExamplePath = path.join(projectRoot, '.env.example');
      if (existsSync(envExamplePath)) {
        const { copyFile } = await import('fs/promises');
        await copyFile(envExamplePath, envPath);
        console.log('✅ .env file created');
        console.log('⚠️  Please edit .env and add your API keys');
      } else {
        console.warn('⚠️  .env.example not found, skipping .env creation');
      }
    } else {
      console.log('✅ .env file already exists');
    }
    
    console.log('\n💡 Note: If you need to set up Supabase with Docker,');
    console.log('   run: pnpm run db:setup');
    console.log('   Or follow SETUP.md for manual setup');
    
    // Step 4: Initialize Supabase CLI
    console.log('\n🔧 Step 4: Initializing Supabase CLI...\n');
    
    if (!existsSync(path.join(projectRoot, 'supabase', 'config.toml'))) {
      console.log('Initializing Supabase...');
      await execAsync('pnpx supabase init', { cwd: projectRoot });
      console.log('✅ Supabase CLI initialized');
    } else {
      console.log('✅ Supabase CLI already initialized');
    }
    
    // Step 5: Apply migrations
    console.log('\n📊 Step 5: Applying database migrations...\n');
    
    try {
      console.log('Pushing migrations to database...');
      const { stdout } = await execAsync('pnpx supabase db push', { cwd: projectRoot });
      console.log(stdout);
      console.log('✅ Migrations applied successfully');
    } catch (error) {
      console.warn('⚠️  Could not apply migrations automatically');
      console.warn('   You may need to run: pnpx supabase db push');
      console.warn('   Error:', error.message);
    }
    
    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Setup Complete!');
    console.log('='.repeat(60));
    
    console.log('\n📍 Next Steps:\n');
    console.log('1. Review your .env file and add any missing API keys:');
    console.log('   - Tatum.io API key (for exchange rates)');
    console.log('   - OpenAI API key (for free tools)');
    console.log('   - CryptAPI credentials (for payments)\n');
    
    console.log('2. Start the development server:');
    console.log('   pnpm run dev\n');
    
    console.log('3. Access your services:');
    console.log('   - App: http://localhost:8080');
    console.log('   - Supabase Studio: http://localhost:8000 (if using Docker)\n');
    
    console.log('4. Useful commands:');
    console.log('   - pnpm run db:export  (backup database)');
    console.log('   - pnpm run db:import  (restore database)');
    console.log('   - pnpm test           (run tests)');
    console.log('   - pnpm run lint       (check code quality)\n');
    
    console.log('📚 Documentation:');
    console.log('   - README.md          (project overview)');
    console.log('   - SETUP.md           (detailed setup guide)');
    console.log('   - PRD.md             (product requirements)');
    console.log('   - TODO.md            (development tasks)');
    console.log('   - FREE_TOOLS.md      (free tools strategy)\n');
    
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure Docker is running');
    console.error('   2. Check if ports 5432 and 8000 are available');
    console.error('   3. Review error messages above');
    console.error('   4. See SETUP.md for detailed instructions\n');
    process.exit(1);
  }
};

// Run setup
setup();