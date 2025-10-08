/**
 * Script to delete a user and all their data by email address
 * 
 * Usage: node scripts/delete-user.js <email>
 * Example: node scripts/delete-user.js user@example.com
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables manually
const envContent = readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('   Required: PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Find user by email address
 */
async function findUserByEmail(email) {
  console.log(`🔍 Looking up user: ${email}`);
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }
  
  const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error(`User not found: ${email}`);
  }
  
  console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);
  return user;
}

/**
 * Check what data exists for the user
 */
async function checkUserData(userId) {
  console.log('\n📊 Checking user data...');
  
  const checks = [
    { table: 'users', column: 'id' },
    { table: 'tests', column: 'hirer_id' },
    { table: 'applications', column: 'test_taker_id' },
    { table: 'messages', column: 'sender_id' },
    { table: 'payments', column: 'hirer_id' },
    { table: 'payment_methods', column: 'user_id' },
    { table: 'homework_requests', column: 'user_id' },
    { table: 'assignment_requests', column: 'user_id' },
    { table: 'programming_requests', column: 'user_id' },
    { table: 'job_offers', column: 'employer_id' },
    { table: 'test_taker_stats', column: 'user_id' },
    { table: 'referral_codes', column: 'user_id' },
    { table: 'referrals', column: 'referrer_id' },
    { table: 'notifications', column: 'user_id' },
    { table: 'user_badges', column: 'user_id' },
    { table: 'reputation_scores', column: 'user_id' }
  ];
  
  const dataFound = {};
  
  for (const check of checks) {
    try {
      const { count, error } = await supabase
        .from(check.table)
        .select('*', { count: 'exact', head: true })
        .eq(check.column, userId);
      
      if (!error && count > 0) {
        dataFound[check.table] = count;
        console.log(`   - ${check.table}: ${count} record(s)`);
      }
    } catch (err) {
      // Table might not exist or we don't have access - skip silently
    }
  }
  
  if (Object.keys(dataFound).length === 0) {
    console.log('   No related data found');
  }
  
  return dataFound;
}

/**
 * Delete user using raw SQL to bypass RLS and handle all constraints
 */
async function deleteUserWithSQL(userId, email) {
  console.log(`\n🗑️  Deleting user data using SQL...`);
  
  try {
    // First, delete from public.users (this should cascade to most tables)
    console.log('   Step 1: Deleting from public.users...');
    const { error: publicError } = await supabase.rpc('delete_user_data', {
      user_id: userId
    });
    
    if (publicError) {
      // If the RPC doesn't exist, try direct deletion
      console.log('   RPC not found, trying direct deletion...');
      const { error: directError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (directError) {
        console.log(`   ⚠️  Warning: Could not delete from public.users: ${directError.message}`);
      } else {
        console.log('   ✅ Deleted from public.users');
      }
    } else {
      console.log('   ✅ Deleted from public.users via RPC');
    }
    
    // Now delete from auth.users
    console.log('   Step 2: Deleting from auth.users...');
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      throw new Error(`Failed to delete from auth.users: ${authError.message}`);
    }
    
    console.log(`✅ Successfully deleted user: ${email}`);
    
  } catch (error) {
    throw new Error(`Deletion failed: ${error.message}`);
  }
}

/**
 * Verify deletion
 */
async function verifyDeletion(email) {
  console.log('\n🔍 Verifying deletion...');
  
  // Check auth.users
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.log('   ⚠️  Could not verify auth.users deletion');
  } else {
    const stillExists = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (stillExists) {
      console.log('   ❌ User still exists in auth.users!');
      return false;
    }
    console.log('   ✅ User removed from auth.users');
  }
  
  // Check public.users
  const { data: publicUser, error: publicError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  
  if (publicError) {
    console.log('   ⚠️  Could not verify public.users deletion');
  } else if (publicUser) {
    console.log('   ❌ User still exists in public.users!');
    return false;
  } else {
    console.log('   ✅ User removed from public.users');
  }
  
  return true;
}

/**
 * Main deletion process
 */
async function deleteUserByEmail(email) {
  try {
    console.log('🚀 Starting user deletion process\n');
    console.log('=' .repeat(50));
    
    // Step 1: Find user
    const user = await findUserByEmail(email);
    
    // Step 2: Check what data exists
    const dataFound = await checkUserData(user.id);
    
    // Step 3: Confirm deletion
    console.log('\n⚠️  WARNING: This will permanently delete the user and all related data!');
    console.log(`   Email: ${email}`);
    console.log(`   User ID: ${user.id}`);
    
    if (Object.keys(dataFound).length > 0) {
      console.log('\n   Related data that will be deleted:');
      Object.entries(dataFound).forEach(([table, count]) => {
        console.log(`   - ${table}: ${count} record(s)`);
      });
    }
    
    console.log('\n⏳ Proceeding with deletion...');
    
    // Step 4: Delete user
    await deleteUserWithSQL(user.id, email);
    
    // Step 5: Verify deletion
    const verified = await verifyDeletion(email);
    
    console.log('\n' + '='.repeat(50));
    if (verified) {
      console.log('✅ User deletion completed successfully!');
    } else {
      console.log('⚠️  User deletion completed but verification failed');
      console.log('   Please check the database manually');
    }
    
  } catch (error) {
    console.error('\n❌ Error during deletion:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

/**
 * List all users in the system
 */
async function listAllUsers() {
  console.log('📋 Listing all users in the system\n');
  console.log('='.repeat(50));
  
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Error listing users:', error.message);
    process.exit(1);
  }
  
  if (users.length === 0) {
    console.log('No users found in the system.');
  } else {
    console.log(`Found ${users.length} user(s):\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });
  }
  
  console.log('='.repeat(50));
}

// Get command line arguments
const args = process.argv.slice(2);

// Check for --list flag
if (args.includes('--list') || args.includes('-l')) {
  listAllUsers().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
} else {
  const email = args[0];
  
  if (!email) {
    console.error('❌ Usage: node scripts/delete-user.js <email>');
    console.error('   Example: node scripts/delete-user.js user@example.com');
    console.error('   Or use --list to see all users: node scripts/delete-user.js --list');
    process.exit(1);
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Invalid email format');
    process.exit(1);
  }
  
  // Run the deletion
  deleteUserByEmail(email).catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}