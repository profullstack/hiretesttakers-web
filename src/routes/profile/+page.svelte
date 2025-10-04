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
  <title>Edit Profile - HireTestTakers</title>
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
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .view-public {
    color: #3b82f6;
    text-decoration: none;
  }
  
  .view-public:hover {
    text-decoration: underline;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }
  
  .profile-form {
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .avatar-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
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
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  
  input[type="text"]:focus,
  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px;
    ring-color: #3b82f6;
  }
  
  textarea {
    resize: vertical;
  }
  
  .languages-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .language-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: #3730a3;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin-left: 0.25rem;
  }
  
  .language-input {
    display: flex;
    gap: 0.5rem;
  }
  
  .language-input input {
    flex: 1;
  }
  
  .add-btn {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
  }
  
  .add-btn:hover {
    background: #2563eb;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
  }
  
  .checkbox-group input[type="checkbox"] {
    width: auto;
  }
  
  .help-text {
    margin: 0.5rem 0 0 1.75rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }
  
  .alert-error {
    background: #fee2e2;
    color: #991b1b;
  }
  
  .alert-success {
    background: #d1fae5;
    color: #065f46;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
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
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
    border: none;
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
</style>