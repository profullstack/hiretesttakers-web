#!/usr/bin/env node

/**
 * Database Export Script
 * 
 * Exports the PostgreSQL database to a SQL dump file with timestamp.
 * Uses pg_dump to create a complete backup of the database.
 * 
 * Usage: pnpm run db:export
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const exportDatabase = async () => {
  try {
    console.log('🔄 Starting database export...\n');
    
    // Parse database connection details
    const dbConfig = parseDbUrl(DATABASE_URL);
    
    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!existsSync(backupsDir)) {
      await mkdir(backupsDir, { recursive: true });
      console.log('📁 Created backups directory');
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
    const filename = `hiretesttakers_${timestamp}.sql`;
    const filepath = path.join(backupsDir, filename);
    
    // Set PGPASSWORD environment variable for pg_dump
    const env = {
      ...process.env,
      PGPASSWORD: dbConfig.password
    };
    
    // Build pg_dump command
    const command = `pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -F p -f "${filepath}"`;
    
    console.log(`📦 Exporting database: ${dbConfig.database}`);
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`💾 Output file: ${filename}\n`);
    
    // Execute pg_dump
    await execAsync(command, { env });
    
    console.log('✅ Database export completed successfully!');
    console.log(`📄 Backup saved to: ${filepath}\n`);
    
    // Show file size
    const { stdout } = await execAsync(`du -h "${filepath}"`);
    const size = stdout.split('\t')[0];
    console.log(`📊 Backup size: ${size}`);
    
  } catch (error) {
    console.error('❌ Database export failed:', error.message);
    
    if (error.message.includes('pg_dump')) {
      console.error('\n💡 Make sure PostgreSQL client tools (pg_dump) are installed:');
      console.error('   - Ubuntu/Debian: sudo apt-get install postgresql-client');
      console.error('   - macOS: brew install postgresql');
      console.error('   - Windows: Install from https://www.postgresql.org/download/');
    }
    
    process.exit(1);
  }
};

// Run export
exportDatabase();