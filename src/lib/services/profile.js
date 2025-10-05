/**
 * Profile Service
 * 
 * Handles user profile management including:
 * - Profile retrieval (private and public)
 * - Profile updates
 * - Avatar upload/deletion
 * - Username management
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getProfile(userId, supabase) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const client = supabase || getSupabaseClient();

  try {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to get profile: ${error.message}`);
  }
}

/**
 * Get public profile by username
 * @param {string} username - Username
 * @returns {Promise<Object|null>} Public profile or null
 */
export async function getPublicProfile(username) {
  if (!username) {
    throw new Error('Username is required');
  }

  try {
    const { data, error } = await supabase
      .from('public_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to get public profile: ${error.message}`);
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object>} Updated profile
 */
export async function updateProfile(userId, updates, supabase) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!updates || typeof updates !== 'object') {
    throw new Error('Updates object is required');
  }

  // Protected fields that cannot be updated
  const protectedFields = ['id', 'email', 'created_at'];
  const hasProtectedFields = protectedFields.some(field => field in updates);
  
  if (hasProtectedFields) {
    throw new Error('Cannot update protected fields: id, email, created_at');
  }

  const client = supabase || getSupabaseClient();

  try {
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

/**
 * Upload avatar image
 * @param {string} userId - User ID
 * @param {File|Blob} file - Image file
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object>} Updated profile with avatar URL
 */
export async function uploadAvatar(userId, file, supabase) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!file) {
    throw new Error('File is required');
  }

  // Validate file type
  if (!file.type?.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const client = supabase || getSupabaseClient();

  try {
    // Generate unique filename
    const fileExt = file.name?.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await client.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = client.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = urlData.publicUrl;

    // Update user profile with new avatar URL
    const { data, error: updateError } = await client
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to upload avatar: ${error.message}`);
  }
}

/**
 * Delete user avatar
 * @param {string} userId - User ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAvatar(userId, supabase) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const client = supabase || getSupabaseClient();

  try {
    // Get current profile to find avatar path
    const profile = await getProfile(userId, client);
    
    if (profile?.avatar_url) {
      // Extract file path from URL
      const url = new URL(profile.avatar_url);
      const pathParts = url.pathname.split('/avatars/');
      
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        
        // Delete from storage
        const { error: deleteError } = await client.storage
          .from('avatars')
          .remove([filePath]);

        if (deleteError) {
          throw deleteError;
        }
      }
    }

    // Update profile to remove avatar URL
    await client
      .from('users')
      .update({ avatar_url: null })
      .eq('id', userId);

    return true;
  } catch (error) {
    throw new Error(`Failed to delete avatar: ${error.message}`);
  }
}

/**
 * Update username
 * @param {string} userId - User ID
 * @param {string} username - New username
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUsername(userId, username, supabase) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!username) {
    throw new Error('Username is required');
  }

  // Validate username format
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  const client = supabase || getSupabaseClient();

  try {
    // Check if username is available
    const available = await checkUsernameAvailability(username, client);
    
    if (!available) {
      throw new Error('Username is already taken');
    }

    // Update username
    const { data, error } = await client
      .from('users')
      .update({ username })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to update username: ${error.message}`);
  }
}

/**
 * Check if username is available
 * @param {string} username - Username to check
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<boolean>} True if available
 */
export async function checkUsernameAvailability(username, supabase) {
  if (!username) {
    throw new Error('Username is required');
  }

  // Validate username format
  if (username.length < 3) {
    return false;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return false;
  }

  const client = supabase || getSupabaseClient();

  try {
    const { data, error } = await client
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // Username is available if no user found
    return data === null;
  } catch (error) {
    throw new Error(`Failed to check username availability: ${error.message}`);
  }
}