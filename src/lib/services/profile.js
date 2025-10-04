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

const supabase = getSupabaseClient();

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getProfile(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const { data, error } = await supabase
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
 * @returns {Promise<Object>} Updated profile
 */
export async function updateProfile(userId, updates) {
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

  try {
    const { data, error } = await supabase
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
 * @returns {Promise<Object>} Updated profile with avatar URL
 */
export async function uploadAvatar(userId, file) {
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

  try {
    // Generate unique filename
    const fileExt = file.name?.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = urlData.publicUrl;

    // Update user profile with new avatar URL
    const { data, error: updateError } = await supabase
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
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAvatar(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Get current profile to find avatar path
    const profile = await getProfile(userId);
    
    if (profile?.avatar_url) {
      // Extract file path from URL
      const url = new URL(profile.avatar_url);
      const pathParts = url.pathname.split('/avatars/');
      
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        
        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);

        if (deleteError) {
          throw deleteError;
        }
      }
    }

    // Update profile to remove avatar URL
    await supabase
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
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUsername(userId, username) {
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

  try {
    // Check if username is available
    const available = await checkUsernameAvailability(username);
    
    if (!available) {
      throw new Error('Username is already taken');
    }

    // Update username
    const { data, error } = await supabase
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
 * @returns {Promise<boolean>} True if available
 */
export async function checkUsernameAvailability(username) {
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

  try {
    const { data, error } = await supabase
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