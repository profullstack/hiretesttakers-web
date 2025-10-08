<script>
  /**
   * Public Profile Page
   * 
   * Displays a user's public profile by username
   */
  
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  let profile = $state(null);
  let loading = $state(true);
  let error = $state('');
  let isNotFound = $state(false);
  
  const username = $derived($page.params.username);
  
  onMount(async () => {
    await loadProfile();
  });
  
  async function loadProfile() {
    try {
      const response = await fetch(`/api/profile/public/${username}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          isNotFound = true;
          error = data.error || 'Profile not found or not public';
        } else {
          error = data.error || 'Failed to load profile';
        }
        return;
      }
      
      profile = data.profile;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }
</script>

<svelte:head>
  <title>{profile?.full_name || username} - TutorLinkup</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading profile...</div>
  {:else if error}
    <div class="error-state">
      {#if isNotFound}
        <div class="error-icon">🔒</div>
        <h2>Profile Not Available</h2>
        <p class="error-message">
          This profile is either not found or has been set to private by the user.
        </p>
        <p class="error-hint">
          If this is your profile, you can make it public in your <a href="/settings">settings</a>.
        </p>
      {:else}
        <div class="error-icon">⚠️</div>
        <h2>Error Loading Profile</h2>
        <p class="error-message">{error}</p>
      {/if}
      <a href="/" class="btn-primary">Go Home</a>
    </div>
  {:else if profile}
    <div class="profile-header">
      <div class="avatar">
        {#if profile.avatar_url}
          <img src={profile.avatar_url} alt={profile.full_name || username} />
        {:else}
          <div class="avatar-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        {/if}
      </div>
      
      <div class="profile-info">
        <h1>{profile.full_name || username}</h1>
        <p class="username">@{profile.username}</p>
        
        {#if profile.location}
          <p class="location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {profile.location}
          </p>
        {/if}
        
        <p class="joined">
          Joined {formatDate(profile.created_at)}
        </p>
      </div>
    </div>
    
    {#if profile.bio}
      <div class="section">
        <h2>About</h2>
        <p class="bio">{profile.bio}</p>
      </div>
    {/if}
    
    {#if profile.languages && profile.languages.length > 0}
      <div class="section">
        <h2>Languages</h2>
        <div class="tags">
          {#each profile.languages as lang}
            <span class="tag">{lang}</span>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if profile.expertise_tags && profile.expertise_tags.length > 0}
      <div class="section">
        <h2>Expertise</h2>
        <div class="expertise-list">
          {#each profile.expertise_tags as tag}
            <div class="expertise-item">
              <span class="expertise-name">{tag.name}</span>
              {#if tag.proficiency}
                <span class="proficiency">Level {tag.proficiency}/5</span>
              {/if}
              {#if tag.years}
                <span class="years">{tag.years} years</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if profile.tests_completed !== undefined}
      <div class="section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{profile.tests_completed || 0}</div>
            <div class="stat-label">Tests Completed</div>
          </div>
          
          {#if profile.success_rate !== null}
            <div class="stat-card">
              <div class="stat-value">{(profile.success_rate * 100).toFixed(0)}%</div>
              <div class="stat-label">Success Rate</div>
            </div>
          {/if}
          
          {#if profile.average_rating !== null}
            <div class="stat-card">
              <div class="stat-value">{profile.average_rating.toFixed(1)} ⭐</div>
              <div class="stat-label">Average Rating</div>
            </div>
          {/if}
          
          {#if profile.total_earned !== null}
            <div class="stat-card">
              <div class="stat-value">${profile.total_earned.toFixed(2)}</div>
              <div class="stat-label">Total Earned</div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }
  
  .loading {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }
  
  .error-state {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .error-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }
  
  .error-state h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
  
  .error-message {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .error-hint {
    color: var(--color-text-tertiary);
    margin-bottom: 2rem;
    font-size: 0.875rem;
    font-style: italic;
  }
  
  .error-hint a {
    color: var(--color-primary);
    text-decoration: underline;
  }
  
  .error-hint a:hover {
    color: var(--color-primary-hover);
  }
  
  .profile-header {
    display: flex;
    gap: 2rem;
    align-items: start;
    background: var(--color-surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    margin-bottom: 2rem;
  }
  
  .avatar {
    flex-shrink: 0;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--color-border);
    background: var(--color-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    color: var(--color-text-tertiary);
  }
  
  .profile-info {
    flex: 1;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
  }
  
  .username {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin: 0 0 1rem 0;
  }
  
  .location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-secondary);
    margin: 0.5rem 0;
  }
  
  .joined {
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
    margin: 0.5rem 0 0 0;
  }
  
  .section {
    background: var(--color-surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    margin-bottom: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: var(--color-text);
  }
  
  .bio {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .tag {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary-light);
    color: var(--color-primary-dark);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
  }

  :global(.dark) .tag {
    background: rgba(0, 240, 255, 0.2);
    color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }
  
  .expertise-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .expertise-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }
  
  .expertise-name {
    font-weight: 500;
    color: var(--color-text);
    flex: 1;
  }
  
  .proficiency,
  .years {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
  
  .stat-card {
    text-align: center;
    padding: var(--spacing-xl);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .btn-primary {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }
  
  .btn-primary:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-primary:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }
  
  @media (max-width: 640px) {
    .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .avatar {
      width: 120px;
      height: 120px;
    }
    
    h1 {
      font-size: 1.5rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>