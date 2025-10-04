#!/usr/bin/env node

/**
 * Database Import Script
 * 
 * Imports a PostgreSQL database from a SQL dump file.
 * Uses psql to restore a database backup.
 * 
 * Usage: pnpm run db:import [filename]
 * If no filename is provided, lists available backups and prompts for selection.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  console.error('Please set DATABASE_URL in your .env file');
  process.exit(1);
}

// Parse database URL
const parseDbUrl = (url) => {
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5]
  };
};

// Get list of backup files
const getBackupFiles = async () => {
  const backupsDir = path.join(__dirname, '..', 'backups');
  
  if (!existsSync(backupsDir)) {
    return [];
  }
  
  const files = await readdir(backupsDir);
  return files
    .filter(file => file.endsWith('.sql'))
    .sort()
    .reverse(); // Most recent first
};

// Prompt user to select a backup file
const selectBackupFile = async (files) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('\n📋 Available backups:\n');
    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    console.log('');
    
    rl.question('Select backup number to restore (or 0 to cancel): ', (answer) => {
      rl.close();
      const selection = parseInt(answer, 10);
      
      if (selection === 0 || isNaN(selection)) {
        console.log('❌ Import cancelled');
        process.exit(0);
      }
      
      if (selection < 1 || selection > files.length) {
        console.error('❌ Invalid selection');
        process.exit(1);
      }
      
      resolve(files[selection - 1]);
    });
  });
};

// Confirm import action
const confirmImport = async (filename) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('\n⚠️  WARNING: This will overwrite the current database!');
    console.log(`📄 File to import: ${filename}\n`);
    
    rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
};

const importDatabase = async () => {
  try {
    console.log('🔄 Starting database import...\n');
    
    // Parse database connection details
    const dbConfig = parseDbUrl(DATABASE_URL);
    
    // Get backup file
    let filename = process.argv[2];
    
    if (!filename) {
      const backupFiles = await getBackupFiles();
      
      if (backupFiles.length === 0) {
        console.error('❌ No backup files found in backups/ directory');
        console.error('💡 Run "pnpm run db:export" to create a backup first');
        process.exit(1);
      }
      
      filename = await selectBackupFile(backupFiles);
    }
    
    // Resolve full path
    const backupsDir = path.join(__dirname, '..', 'backups');
    const filepath = path.isAbsolute(filename) 
      ? filename 
      : path.join(backupsDir, filename);
    
    if (!existsSync(filepath)) {
      console.error(`❌ Backup file not found: ${filepath}`);
      process.exit(1);
    }
    
    // Confirm import
    const confirmed = await confirmImport(path.basename(filepath));
    if (!confirmed) {
      console.log('❌ Import cancelled');
      process.exit(0);
    }
    
    // Set PGPASSWORD environment variable for psql
    const env = {
      ...process.env,
      PGPASSWORD: dbConfig.password
    };
    
    console.log('\n🔄 Importing database...');
    console.log(`📦 Database: ${dbConfig.database}`);
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📄 Source file: ${path.basename(filepath)}\n`);
    
    // Build psql command
    const command = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -f "${filepath}"`;
    
    // Execute psql
    const { stdout, stderr } = await execAsync(command, { env });
    
    if (stderr && !stderr.includes('NOTICE')) {
      console.warn('⚠️  Warnings during import:', stderr);
    }
    
    console.log('✅ Database import completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Database import failed:', error.message);
    
    if (error.message.includes('psql')) {
      console.error('\n💡 Make sure PostgreSQL client tools (psql) are installed:');
      console.error('   - Ubuntu/Debian: sudo apt-get install postgresql-client');
      console.error('   - macOS: brew install postgresql');
      console.error('   - Windows: Install from https://www.postgresql.org/download/');
    }
    
    process.exit(1);
  }
};

// Run import
importDatabase();