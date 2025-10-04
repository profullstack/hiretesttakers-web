<script>
  export let stats = null;
  export let user = null;

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  const formatRating = (rating) => {
    if (rating === null || rating === undefined) return 'No ratings yet';
    return `${rating.toFixed(1)} / 5.0`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
</script>

<div class="stats-card">
  {#if user}
    <div class="user-header">
      {#if user.avatar_url}
        <img src={user.avatar_url} alt={user.full_name} class="avatar" />
      {:else}
        <div class="avatar-placeholder">{user.full_name?.charAt(0) || '?'}</div>
      {/if}
      <div class="user-info">
        <h3>{user.full_name || 'Anonymous'}</h3>
        {#if user.bio}
          <p class="bio">{user.bio}</p>
        {/if}
        {#if user.location}
          <p class="location">📍 {user.location}</p>
        {/if}
      </div>
    </div>
  {/if}

  {#if stats}
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">Tests Completed</div>
        <div class="stat-value">{formatNumber(stats.tests_completed)}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">Tests Passed</div>
        <div class="stat-value">{formatNumber(stats.tests_passed)}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">Success Rate</div>
        <div class="stat-value">{formatPercentage(stats.success_rate)}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">Average Rating</div>
        <div class="stat-value rating">{formatRating(stats.average_rating)}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">Total Earned</div>
        <div class="stat-value earnings">{formatCurrency(stats.total_earned)}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">Last Active</div>
        <div class="stat-value">{formatDate(stats.last_active)}</div>
      </div>
    </div>
  {:else}
    <div class="no-stats">No statistics available</div>
  {/if}

  {#if user?.skills && user.skills.length > 0}
    <div class="skills-section">
      <h4>Skills</h4>
      <div class="skills">
        {#each user.skills as skill}
          <span class="skill-tag">{skill}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .stats-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .user-header {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #dee2e6;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
  }

  .user-info {
    flex: 1;
  }

  h3 {
    margin: 0 0 8px 0;
    color: #212529;
    font-size: 1.5rem;
  }

  .bio {
    margin: 0 0 8px 0;
    color: #6c757d;
    font-size: 0.875rem;
  }

  .location {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }

  .stat-item {
    text-align: center;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #212529;
  }

  .stat-value.rating {
    color: #ffc107;
  }

  .stat-value.earnings {
    color: #28a745;
  }

  .no-stats {
    text-align: center;
    color: #6c757d;
    padding: 40px 20px;
  }

  .skills-section {
    padding-top: 24px;
    border-top: 1px solid #dee2e6;
  }

  h4 {
    margin: 0 0 12px 0;
    color: #495057;
    font-size: 1rem;
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-tag {
    background: #e9ecef;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 0.875rem;
    color: #495057;
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .user-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }
</style>