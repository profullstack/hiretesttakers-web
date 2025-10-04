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
  
  const username = $derived($page.params.username);
  
  onMount(async () => {
    await loadProfile();
  });
  
  async function loadProfile() {
    try {
      const response = await fetch(`/api/profile/public/${username}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Profile not found');
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
  <title>{profile?.full_name || username} - HireTestTakers</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading profile...</div>
  {:else if error}
    <div class="error-state">
      <h2>Profile Not Found</h2>
      <p>{error}</p>
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
  }
  
  .loading {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
    font-size: 1.125rem;
  }
  
  .error-state {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  .error-state h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #374151;
  }
  
  .error-state p {
    color: #6b7280;
    margin-bottom: 2rem;
  }
  
  .profile-header {
    display: flex;
    gap: 2rem;
    align-items: start;
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .avatar {
    flex-shrink: 0;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e5e7eb;
    background: #f9fafb;
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
    color: #9ca3af;
  }
  
  .profile-info {
    flex: 1;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: #111827;
  }
  
  .username {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0 0 1rem 0;
  }
  
  .location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    margin: 0.5rem 0;
  }
  
  .joined {
    color: #9ca3af;
    font-size: 0.875rem;
    margin: 0.5rem 0 0 0;
  }
  
  .section {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #111827;
  }
  
  .bio {
    color: #374151;
    line-height: 1.6;
    margin: 0;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tag {
    padding: 0.5rem 1rem;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .expertise-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .expertise-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.375rem;
  }
  
  .expertise-name {
    font-weight: 500;
    color: #111827;
    flex: 1;
  }
  
  .proficiency,
  .years {
    font-size: 0.875rem;
    color: #6b7280;
    padding: 0.25rem 0.75rem;
    background: white;
    border-radius: 0.25rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    text-align: center;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #3b82f6;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    text-decoration: none;
    border-radius: 0.375rem;
    font-weight: 500;
  }
  
  .btn-primary:hover {
    background: #2563eb;
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