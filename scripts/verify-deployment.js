#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the application is ready for deployment to Railway.
 * It checks:
 * - Build succeeds
 * - Required environment variables are documented
 * - Railway configuration files exist
 * - Database migrations are present
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`)
};

let hasErrors = false;
let hasWarnings = false;

/**
 * Check if a file exists
 */
function checkFile(filePath, description) {
  const fullPath = join(rootDir, filePath);
  if (existsSync(fullPath)) {
    log.success(`${description} exists: ${filePath}`);
    return true;
  } else {
    log.error(`${description} missing: ${filePath}`);
    hasErrors = true;
    return false;
  }
}

/**
 * Check Railway configuration files
 */
function checkRailwayConfig() {
  log.section('Checking Railway Configuration');
  
  const hasJson = checkFile('railway.json', 'Railway JSON config');
  const hasToml = checkFile('railway.toml', 'Railway TOML config');
  
  if (!hasJson && !hasToml) {
    log.error('At least one Railway configuration file is required');
    hasErrors = true;
  }
  
  // Verify railway.json structure if it exists
  if (hasJson) {
    try {
      const config = JSON.parse(readFileSync(join(rootDir, 'railway.json'), 'utf-8'));
      
      if (config.build?.buildCommand) {
        log.success('Build command configured');
      } else {
        log.warning('Build command not configured in railway.json');
        hasWarnings = true;
      }
      
      if (config.deploy?.startCommand) {
        log.success('Start command configured');
      } else {
        log.error('Start command not configured in railway.json');
        hasErrors = true;
      }
      
      if (config.volumes && config.volumes.length > 0) {
        log.success(`${config.volumes.length} volume(s) configured`);
      } else {
        log.warning('No volumes configured');
        hasWarnings = true;
      }
    } catch (error) {
      log.error(`Failed to parse railway.json: ${error.message}`);
      hasErrors = true;
    }
  }
}

/**
 * Check environment variables documentation
 */
function checkEnvDocumentation() {
  log.section('Checking Environment Variables');
  
  if (checkFile('.env.example', 'Environment variables template')) {
    const envExample = readFileSync(join(rootDir, '.env.example'), 'utf-8');
    
    const requiredVars = [
      'PUBLIC_SUPABASE_URL',
      'PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DATABASE_URL',
      'NODE_ENV'
    ];
    
    const missingVars = requiredVars.filter(v => !envExample.includes(v));
    
    if (missingVars.length === 0) {
      log.success('All required environment variables documented');
    } else {
      log.error(`Missing environment variables in .env.example: ${missingVars.join(', ')}`);
      hasErrors = true;
    }
  }
}

/**
 * Check deployment documentation
 */
function checkDeploymentDocs() {
  log.section('Checking Deployment Documentation');
  
  checkFile('DEPLOYMENT.md', 'Deployment guide');
  checkFile('README.md', 'README');
}

/**
 * Verify build process
 */
function verifyBuild() {
  log.section('Verifying Build Process');
  
  try {
    log.info('Running build command...');
    execSync('pnpm run build', { 
      cwd: rootDir,
      stdio: 'pipe'
    });
    log.success('Build completed successfully');
  } catch (error) {
    log.error('Build failed');
    log.error(error.message);
    hasErrors = true;
  }
}

/**
 * Check database migrations
 */
function checkMigrations() {
  log.section('Checking Database Migrations');
  
  const migrationsDir = join(rootDir, 'supabase', 'migrations');
  
  if (existsSync(migrationsDir)) {
    log.success('Migrations directory exists');
    
    try {
      const { readdirSync } = require('fs');
      const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
      
      if (files.length > 0) {
        log.success(`Found ${files.length} migration file(s)`);
      } else {
        log.warning('No migration files found');
        hasWarnings = true;
      }
    } catch (error) {
      log.warning('Could not read migrations directory');
      hasWarnings = true;
    }
  } else {
    log.warning('Migrations directory not found');
    hasWarnings = true;
  }
}

/**
 * Check package.json configuration
 */
function checkPackageJson() {
  log.section('Checking Package Configuration');
  
  try {
    const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
    
    if (pkg.type === 'module') {
      log.success('ESM modules configured');
    } else {
      log.warning('Not using ESM modules');
      hasWarnings = true;
    }
    
    if (pkg.engines?.node) {
      log.success(`Node.js version specified: ${pkg.engines.node}`);
    } else {
      log.warning('Node.js version not specified in engines');
      hasWarnings = true;
    }
    
    const requiredScripts = ['build', 'dev'];
    const missingScripts = requiredScripts.filter(s => !pkg.scripts?.[s]);
    
    if (missingScripts.length === 0) {
      log.success('Required scripts present');
    } else {
      log.error(`Missing scripts: ${missingScripts.join(', ')}`);
      hasErrors = true;
    }
  } catch (error) {
    log.error(`Failed to parse package.json: ${error.message}`);
    hasErrors = true;
  }
}

/**
 * Display deployment checklist
 */
function displayChecklist() {
  log.section('Deployment Checklist');
  
  console.log(`
Before deploying to Railway, ensure:

1. Railway CLI installed:
   ${colors.cyan}npm install -g @railway/cli${colors.reset}

2. Login to Railway:
   ${colors.cyan}railway login${colors.reset}

3. Initialize Railway project:
   ${colors.cyan}railway init${colors.reset}

4. Create volumes (if needed):
   ${colors.cyan}railway volume create database --mount-path /app/volumes/db${colors.reset}
   ${colors.cyan}railway volume create uploads --mount-path /app/volumes/uploads${colors.reset}

5. Set environment variables:
   ${colors.cyan}railway variables set KEY=value${colors.reset}
   Or use the Railway dashboard

6. Deploy:
   ${colors.cyan}railway up${colors.reset}

7. Run migrations (after deployment):
   ${colors.cyan}railway run pnpx supabase db push${colors.reset}

For detailed instructions, see DEPLOYMENT.md
  `);
}

/**
 * Main verification function
 */
async function main() {
  console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════╗
║   TutorLinkup.com - Deployment Verification       ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}`);

  checkRailwayConfig();
  checkEnvDocumentation();
  checkDeploymentDocs();
  checkPackageJson();
  checkMigrations();
  verifyBuild();
  
  // Summary
  log.section('Verification Summary');
  
  if (hasErrors) {
    log.error('Verification failed with errors');
    log.error('Please fix the errors above before deploying');
    displayChecklist();
    process.exit(1);
  } else if (hasWarnings) {
    log.warning('Verification completed with warnings');
    log.warning('Review the warnings above before deploying');
    displayChecklist();
    process.exit(0);
  } else {
    log.success('All checks passed!');
    log.success('Application is ready for deployment');
    displayChecklist();
    process.exit(0);
  }
}

// Run verification
main().catch(error => {
  log.error(`Verification failed: ${error.message}`);
  process.exit(1);
});