<script>
  /**
   * Profile Edit Page
   * 
   * Allows users to edit their profile information
   */
  
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import AvatarUpload from '$lib/components/AvatarUpload.svelte';
  
  let profile = $state(null);
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let success = $state('');
  
  let formData = $state({
    full_name: '',
    bio: '',
    location: '',
    languages: [],
    profile_public: true
  });
  
  let newLanguage = $state('');
  
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
      formData = {
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        languages: profile.languages || ['English'],
        profile_public: profile.profile_public ?? true
      };
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    saving = true;
    error = '';
    success = '';
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      profile = data.profile;
      success = 'Profile updated successfully!';
      
      setTimeout(() => {
        success = '';
      }, 3000);
    } catch (err) {
      error = err.message;
    } finally {
      saving = false;
    }
  }
  
  function addLanguage() {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      formData.languages = [...formData.languages, newLanguage];
      newLanguage = '';
    }
  }
  
  function removeLanguage(lang) {
    formData.languages = formData.languages.filter(l => l !== lang);
  }
  
  function handleAvatarUpload(updatedProfile) {
    profile = updatedProfile;
    success = 'Avatar updated successfully!';
    setTimeout(() => {
      success = '';
    }, 3000);
  }
  
  function handleAvatarDelete() {
    profile = { ...profile, avatar_url: null };
    success = 'Avatar deleted successfully!';
    setTimeout(() => {
      success = '';
    }, 3000);
  }
</script>

<svelte:head>
  <title>Edit Profile - TutorLinkup</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Edit Profile</h1>
    <a href="/u/{profile?.username || ''}" class="view-public">View Public Profile</a>
  </div>
  
  {#if loading}
    <div class="loading">Loading profile...</div>
  {:else if profile}
    <div class="profile-form">
      <div class="avatar-section">
        <h2>Profile Picture</h2>
        <AvatarUpload
          bind:avatarUrl={profile.avatar_url}
          onUpload={handleAvatarUpload}
          onDelete={handleAvatarDelete}
        />
      </div>
      
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label for="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            bind:value={formData.full_name}
            placeholder="Enter your full name"
          />
        </div>
        
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea
            id="bio"
            bind:value={formData.bio}
            placeholder="Tell us about yourself..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="location">Location</label>
          <input
            type="text"
            id="location"
            bind:value={formData.location}
            placeholder="City, Country"
          />
        </div>
        
        <div class="form-group">
          <label for="language-input">Languages</label>
          <div class="languages-list">
            {#each formData.languages as lang}
              <span class="language-tag">
                {lang}
                <button
                  type="button"
                  onclick={() => removeLanguage(lang)}
                  class="remove-btn"
                  aria-label="Remove {lang}"
                >
                  ×
                </button>
              </span>
            {/each}
          </div>
          <div class="language-input">
            <input
              type="text"
              id="language-input"
              bind:value={newLanguage}
              placeholder="Add a language"
              onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            />
            <button type="button" onclick={addLanguage} class="add-btn">
              Add
            </button>
          </div>
        </div>
        
        <div class="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              bind:checked={formData.profile_public}
            />
            Make my profile public
          </label>
          <p class="help-text">Public profiles appear on the leaderboard and can be viewed by anyone</p>
        </div>
        
        {#if error}
          <div class="alert alert-error">{error}</div>
        {/if}
        
        {#if success}
          <div class="alert alert-success">{success}</div>
        {/if}
        
        <div class="form-actions">
          <button type="submit" disabled={saving} class="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/" class="btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: var(--spacing-xl) auto;
    padding: 0 var(--spacing-md);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
    color: var(--color-text);
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
  }
  
  .view-public {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  .view-public:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }
  
  .loading {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text-secondary);
  }
  
  .profile-form {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }
  
  .avatar-section {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
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
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  
  input[type="text"]:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }
  
  :global(.dark) input[type="text"]:focus,
  :global(.dark) textarea:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }
  
  textarea {
    resize: vertical;
  }
  
  .languages-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .language-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    background: var(--color-primary-light);
    color: var(--color-primary-dark);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  :global(.dark) .language-tag {
    background: rgba(0, 240, 255, 0.2);
    color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin-left: var(--spacing-xs);
    transition: opacity var(--transition-fast);
  }
  
  .remove-btn:hover {
    opacity: 0.7;
  }
  
  .language-input {
    display: flex;
    gap: var(--spacing-sm);
  }
  
  .language-input input {
    flex: 1;
  }
  
  .add-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-fast);
  }
  
  .add-btn:hover {
    background: var(--color-primary-hover);
  }
  
  :global(.dark) .add-btn {
    box-shadow: var(--glow-primary);
  }
  
  :global(.dark) .add-btn:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-weight: normal;
  }
  
  .checkbox-group input[type="checkbox"] {
    width: auto;
  }
  
  .help-text {
    margin: var(--spacing-sm) 0 0 1.75rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .alert {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
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
  
  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
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
    transition: all var(--transition-fast);
  }
  
  .btn-primary {
    background: var(--color-primary);
    color: white;
    border: none;
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
</style>