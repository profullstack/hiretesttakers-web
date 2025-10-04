<script>
  /**
   * Settings Page
   * 
   * User account settings including username and privacy
   */
  
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let profile = $state(null);
  let loading = $state(true);
  let saving = $state(false);
  let checkingUsername = $state(false);
  let error = $state('');
  let success = $state('');
  
  let newUsername = $state('');
  let usernameAvailable = $state(null);
  let usernameError = $state('');
  
  onMount(async () => {
    await loadProfile();
  });
  
  async function loadProfile() {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          goto('/auth/login');
          return;
        }
        throw new Error(data.error || 'Failed to load profile');
      }
      
      profile = data.profile;
      newUsername = profile.username || '';
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  async function checkUsername() {
    if (!newUsername || newUsername === profile.username) {
      usernameAvailable = null;
      usernameError = '';
      return;
    }
    
    if (newUsername.length < 3) {
      usernameError = 'Username must be at least 3 characters';
      usernameAvailable = false;
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      usernameError = 'Username can only contain letters, numbers, and underscores';
      usernameAvailable = false;
      return;
    }
    
    checkingUsername = true;
    usernameError = '';
    
    try {
      const response = await fetch(`/api/profile/username?username=${encodeURIComponent(newUsername)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check username');
      }
      
      usernameAvailable = data.available;
      if (!data.available) {
        usernameError = 'Username is already taken';
      }
    } catch (err) {
      usernameError = err.message;
      usernameAvailable = false;
    } finally {
      checkingUsername = false;
    }
  }
  
  async function handleUsernameUpdate(event) {
    event.preventDefault();
    
    if (newUsername === profile.username) {
      return;
    }
    
    if (!usernameAvailable) {
      return;
    }
    
    saving = true;
    error = '';
    success = '';
    
    try {
      const response = await fetch('/api/profile/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update username');
      }
      
      profile = data.profile;
      success = 'Username updated successfully!';
      
      setTimeout(() => {
        success = '';
      }, 3000);
    } catch (err) {
      error = err.message;
    } finally {
      saving = false;
    }
  }
  
  async function handlePrivacyUpdate(isPublic) {
    saving = true;
    error = '';
    success = '';
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile_public: isPublic })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update privacy settings');
      }
      
      profile = data.profile;
      success = 'Privacy settings updated!';
      
      setTimeout(() => {
        success = '';
      }, 3000);
    } catch (err) {
      error = err.message;
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Settings - HireTestTakers</title>
</svelte:head>

<div class="container">
  <h1>Settings</h1>
  
  {#if loading}
    <div class="loading">Loading settings...</div>
  {:else if profile}
    <div class="settings-sections">
      <!-- Username Section -->
      <section class="settings-section">
        <h2>Username</h2>
        <p class="section-description">
          Your username is used in your public profile URL and to identify you on the platform.
        </p>
        
        <form onsubmit={handleUsernameUpdate}>
          <div class="form-group">
            <label for="username">Username</label>
            <div class="username-input-group">
              <span class="username-prefix">@</span>
              <input
                type="text"
                id="username"
                bind:value={newUsername}
                oninput={checkUsername}
                placeholder="username"
                disabled={saving}
              />
            </div>
            
            {#if checkingUsername}
              <p class="help-text">Checking availability...</p>
            {:else if usernameError}
              <p class="error-text">{usernameError}</p>
            {:else if usernameAvailable === true}
              <p class="success-text">✓ Username is available</p>
            {/if}
            
            <p class="help-text">
              Current: @{profile.username}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={saving || !usernameAvailable || newUsername === profile.username}
            class="btn-primary"
          >
            {saving ? 'Updating...' : 'Update Username'}
          </button>
        </form>
      </section>
      
      <!-- Privacy Section -->
      <section class="settings-section">
        <h2>Privacy</h2>
        <p class="section-description">
          Control who can see your profile and information.
        </p>
        
        <div class="privacy-options">
          <label class="radio-option">
            <input
              type="radio"
              name="privacy"
              checked={profile.profile_public}
              onchange={() => handlePrivacyUpdate(true)}
              disabled={saving}
            />
            <div class="radio-content">
              <strong>Public Profile</strong>
              <p>Your profile is visible to everyone and appears on the leaderboard</p>
            </div>
          </label>
          
          <label class="radio-option">
            <input
              type="radio"
              name="privacy"
              checked={!profile.profile_public}
              onchange={() => handlePrivacyUpdate(false)}
              disabled={saving}
            />
            <div class="radio-content">
              <strong>Private Profile</strong>
              <p>Only you can see your profile. You won't appear on the leaderboard</p>
            </div>
          </label>
        </div>
      </section>
      
      <!-- Account Section -->
      <section class="settings-section">
        <h2>Account</h2>
        <p class="section-description">
          Manage your account settings and security.
        </p>
        
        <div class="account-info">
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{profile.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Account Type:</span>
            <span class="info-value">{profile.user_type}</span>
          </div>
        </div>
        
        <div class="account-actions">
          <a href="/auth/reset-password" class="btn-secondary">Change Password</a>
        </div>
      </section>
      
      {#if error}
        <div class="alert alert-error">{error}</div>
      {/if}
      
      {#if success}
        <div class="alert alert-success">{success}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }
  
  .settings-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .settings-section {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  
  .section-description {
    color: #6b7280;
    margin: 0 0 1.5rem 0;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #374151;
  }
  
  .username-input-group {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .username-prefix {
    padding: 0.5rem 0.75rem;
    background: #f3f4f6;
    color: #6b7280;
    font-weight: 500;
  }
  
  .username-input-group input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: none;
    font-size: 1rem;
  }
  
  .username-input-group input:focus {
    outline: none;
  }
  
  .help-text {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .error-text {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: #ef4444;
  }
  
  .success-text {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: #10b981;
  }
  
  .privacy-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .radio-option {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .radio-option:hover {
    border-color: #3b82f6;
    background: #f9fafb;
  }
  
  .radio-option input[type="radio"] {
    margin-top: 0.25rem;
  }
  
  .radio-content {
    flex: 1;
  }
  
  .radio-content strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #111827;
  }
  
  .radio-content p {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .account-info {
    margin-bottom: 1.5rem;
  }
  
  .info-row {
    display: flex;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .info-row:last-child {
    border-bottom: none;
  }
  
  .info-label {
    font-weight: 500;
    color: #6b7280;
    min-width: 120px;
  }
  
  .info-value {
    color: #111827;
  }
  
  .account-actions {
    display: flex;
    gap: 1rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    border: none;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .btn-secondary:hover {
    background: #e5e7eb;
  }
  
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    margin-top: 1rem;
  }
  
  .alert-error {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .alert-success {
    background: #d1fae5;
    color: #065f46;
  }
</style>