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
    margin: var(--spacing-xl) auto;
    padding: 0 var(--spacing-md);
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text);
  }
  
  .loading {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text-secondary);
  }
  
  .settings-sections {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }
  
  .settings-section {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--color-text);
  }
  
  .section-description {
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-lg) 0;
  }
  
  .form-group {
    margin-bottom: var(--spacing-lg);
  }
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
  }
  
  .username-input-group {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-surface);
  }
  
  .username-prefix {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
    font-weight: 500;
  }
  
  .username-input-group input {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
  }
  
  .username-input-group input:focus {
    outline: none;
  }
  
  .help-text {
    margin: var(--spacing-sm) 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .error-text {
    margin: var(--spacing-sm) 0 0 0;
    font-size: 0.875rem;
    color: var(--color-error);
  }
  
  .success-text {
    margin: var(--spacing-sm) 0 0 0;
    font-size: 0.875rem;
    color: var(--color-success);
  }
  
  .privacy-options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .radio-option {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    background: var(--color-surface);
  }
  
  .radio-option:hover {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
  }
  
  :global(.dark) .radio-option:hover {
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  }
  
  .radio-option input[type="radio"] {
    margin-top: 0.25rem;
  }
  
  .radio-content {
    flex: 1;
  }
  
  .radio-content strong {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: var(--color-text);
  }
  
  .radio-content p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .account-info {
    margin-bottom: var(--spacing-lg);
  }
  
  .info-row {
    display: flex;
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--color-border);
  }
  
  .info-row:last-child {
    border-bottom: none;
  }
  
  .info-label {
    font-weight: 500;
    color: var(--color-text-secondary);
    min-width: 120px;
  }
  
  .info-value {
    color: var(--color-text);
  }
  
  .account-actions {
    display: flex;
    gap: var(--spacing-md);
  }
  
  .btn-primary,
  .btn-secondary {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    border: none;
    transition: all var(--transition-fast);
  }
  
  .btn-primary {
    background: var(--color-primary);
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }
  
  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }
  
  :global(.dark) .btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }
  
  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
  }
  
  .alert {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    margin-top: var(--spacing-md);
    border: 1px solid transparent;
  }
  
  .alert-error {
    background: var(--color-error-light);
    color: var(--color-error-dark);
    border-color: var(--color-error);
  }
  
  :global(.dark) .alert-error {
    background: rgba(255, 0, 85, 0.1);
    color: var(--color-error-light);
    border-color: var(--color-error);
  }
  
  .alert-success {
    background: var(--color-success-light);
    color: var(--color-success-dark);
    border-color: var(--color-success);
  }
  
  :global(.dark) .alert-success {
    background: rgba(0, 255, 136, 0.1);
    color: var(--color-success-light);
    border-color: var(--color-success);
  }
</style>