/**
 * Auth Service
 * 
 * Authentication service using Supabase Auth.
 * Provides functions for signup, login, logout, password reset, etc.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sign up a new user
 * @param {Object} params - Signup parameters
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @param {Object} [params.metadata] - Optional user metadata
 * @returns {Promise<Object>} User and session data
 * @throws {Error} If validation fails or signup fails
 */
export async function signUp({ email, password, metadata = {} }) {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!password || password.trim() === '') {
    throw new Error('Password is required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}

/**
 * Sign in an existing user
 * @param {Object} params - Login parameters
 * @param {string} params.email - User email
 * @param {string} params.password - User password
 * @returns {Promise<Object>} User and session data
 * @throws {Error} If validation fails or login fails
 */
export async function signIn({ email, password }) {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }

  if (!password || password.trim() === '') {
    throw new Error('Password is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error('Invalid credentials');
  }

  return {
    user: data.user,
    session: data.session
  };
}

/**
 * Sign out the current user
 * @returns {Promise<boolean>} True if successful
 * @throws {Error} If sign out fails
 */
export async function signOut() {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

/**
 * Send password reset email
 * @param {Object} params - Reset parameters
 * @param {string} params.email - User email
 * @returns {Promise<boolean>} True if successful
 * @throws {Error} If validation fails or reset fails
 */
export async function resetPassword({ email }) {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.PUBLIC_SITE_URL || 'http://localhost:5173'}/auth/reset-password`
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

/**
 * Update user password
 * @param {Object} params - Update parameters
 * @param {string} params.newPassword - New password
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} If validation fails or update fails
 */
export async function updatePassword({ newPassword }) {
  if (!newPassword || newPassword.trim() === '') {
    throw new Error('New password is required');
  }

  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user
  };
}

/**
 * Get current session
 * @returns {Promise<Object|null>} Session data or null
 */
export async function getSession() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  return data.session;
}

/**
 * Get current user
 * @returns {Promise<Object|null>} User data or null
 */
export async function getUser() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

/**
 * Verify email with token
 * @param {Object} params - Verification parameters
 * @param {string} params.token - Verification token
 * @param {string} params.type - Token type (signup, recovery, etc.)
 * @returns {Promise<Object>} User and session data
 * @throws {Error} If validation fails or verification fails
 */
export async function verifyEmail({ token, type = 'signup' }) {
  if (!token || token.trim() === '') {
    throw new Error('Token is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session
  };
}

/**
 * Resend verification email
 * @param {Object} params - Resend parameters
 * @param {string} params.email - User email
 * @returns {Promise<boolean>} True if successful
 * @throws {Error} If validation fails or resend fails
 */
export async function resendVerificationEmail({ email }) {
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}