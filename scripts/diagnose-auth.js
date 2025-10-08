/**
 * Diagnostic script to check auth trigger and user creation
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
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function diagnose() {
  console.log('🔍 Diagnosing auth setup...\n');

  // Check if trigger exists - skip this check as it requires special RPC
  console.log('1. Checking for on_auth_user_created trigger...');
  console.log('   ⚠️  Skipping trigger check (requires database admin access)');

  // Check auth.users
  console.log('\n2. Checking auth.users table...');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.log('   ❌ Error:', authError.message);
  } else {
    console.log(`   ✅ Found ${authUsers.users.length} users in auth.users`);
    authUsers.users.forEach(user => {
      console.log(`      - ${user.email} (${user.id})`);
    });
  }

  // Check public.users
  console.log('\n3. Checking public.users table...');
  const { data: publicUsers, error: publicError } = await supabase
    .from('users')
    .select('id, email, full_name, username, created_at');
  
  if (publicError) {
    console.log('   ❌ Error:', publicError.message);
  } else {
    console.log(`   ✅ Found ${publicUsers.length} users in public.users`);
    publicUsers.forEach(user => {
      console.log(`      - ${user.email} (${user.id}) - username: ${user.username || 'null'}`);
    });
  }

  // Compare counts
  if (authUsers && publicUsers) {
    const authCount = authUsers.users.length;
    const publicCount = publicUsers.length;
    
    console.log('\n4. Comparison:');
    console.log(`   auth.users: ${authCount}`);
    console.log(`   public.users: ${publicCount}`);
    
    if (authCount > publicCount) {
      console.log(`   ❌ MISMATCH: ${authCount - publicCount} users missing from public.users`);
      
      // Find missing users
      const publicUserIds = new Set(publicUsers.map(u => u.id));
      const missingUsers = authUsers.users.filter(u => !publicUserIds.has(u.id));
      
      console.log('\n   Missing users:');
      missingUsers.forEach(user => {
        console.log(`      - ${user.email} (${user.id}) created at ${user.created_at}`);
      });
    } else if (authCount === publicCount) {
      console.log('   ✅ Counts match!');
    }
  }

  console.log('\n✅ Diagnosis complete');
}

diagnose().catch(console.error);