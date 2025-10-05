<script>
  import { onMount } from 'svelte';
  import LeaderboardTable from '$lib/components/LeaderboardTable.svelte';
  import LeaderboardFilters from '$lib/components/LeaderboardFilters.svelte';
  import ReputationScore from '$lib/components/ReputationScore.svelte';
  import BadgeDisplay from '$lib/components/BadgeDisplay.svelte';
  import { _ } from '$lib/i18n/index.js';

  let leaderboard = [];
  let topPerformers = [];
  let loading = true;
  let error = '';
  let sortBy = 'reputation_score';
  let location = '';
  let skills = [];
  let currentPage = 0;
  let limit = 50;
  let viewMode = 'reputation'; // 'reputation' or 'classic'

  const fetchLeaderboard = async () => {
    loading = true;
    error = '';

    try {
      if (viewMode === 'reputation') {
        // Fetch reputation-based leaderboard
        const params = new URLSearchParams({
          limit: limit.toString(),
        });

        const response = await fetch(`/api/reputation/top-performers?${params}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch top performers');
        }

        topPerformers = result.topPerformers || [];
        leaderboard = [];
      } else {
        // Fetch classic leaderboard
        const params = new URLSearchParams({
          sortBy,
          limit: limit.toString(),
          offset: (currentPage * limit).toString(),
        });

        if (location) {
          params.append('location', location);
        }

        if (skills.length > 0) {
          params.append('skills', skills.join(','));
        }

        const response = await fetch(`/api/leaderboard?${params}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch leaderboard');
        }

        leaderboard = result.data || [];
        topPerformers = [];
      }
    } catch (err) {
      error = err.message;
      leaderboard = [];
      topPerformers = [];
    } finally {
      loading = false;
    }
  };

  const handleViewModeChange = (mode) => {
    viewMode = mode;
    currentPage = 0;
    fetchLeaderboard();
  };

  const handleFilterChange = (filters) => {
    sortBy = filters.sortBy;
    location = filters.location;
    skills = filters.skills;
    currentPage = 0; // Reset to first page when filters change
    fetchLeaderboard();
  };

  const handleSort = (field) => {
    sortBy = field;
    currentPage = 0;
    fetchLeaderboard();
  };

  const handleNextPage = () => {
    currentPage++;
    fetchLeaderboard();
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      currentPage--;
      fetchLeaderboard();
    }
  };

  onMount(() => {
    fetchLeaderboard();
  });
</script>

<svelte:head>
  <title>Leaderboard - HireTestTakers.com</title>
  <meta name="description" content="Top test takers on HireTestTakers.com" />
</svelte:head>

<div class="leaderboard-page">
  <div class="container">
    <header class="page-header">
      <h1>🏆 Test Taker Leaderboard</h1>
      <p>Discover top-performing test takers based on their reputation, success rate, and earnings</p>
    </header>

    <!-- View Mode Toggle -->
    <div class="view-mode-toggle">
      <button
        class:active={viewMode === 'reputation'}
        on:click={() => handleViewModeChange('reputation')}
      >
        ⭐ Reputation
      </button>
      <button
        class:active={viewMode === 'classic'}
        on:click={() => handleViewModeChange('classic')}
      >
        📊 Classic
      </button>
    </div>

    {#if viewMode === 'classic'}
      <LeaderboardFilters
        {sortBy}
        {location}
        {skills}
        onFilterChange={handleFilterChange}
      />
    {/if}

    {#if loading}
      <div class="loading">Loading leaderboard...</div>
    {:else if error}
      <div class="error-message">
        <p>{error}</p>
        <button on:click={fetchLeaderboard}>Try Again</button>
      </div>
    {:else if viewMode === 'reputation'}
      <!-- Reputation-based leaderboard -->
      {#if topPerformers.length === 0}
        <div class="empty-state">
          <h2>No Top Performers Yet</h2>
          <p>Be the first to build your reputation and appear on the leaderboard!</p>
        </div>
      {:else}
        <div class="reputation-leaderboard">
          {#each topPerformers as performer, index}
            <div class="performer-card">
              <div class="rank">#{index + 1}</div>
              <div class="performer-info">
                <div class="performer-header">
                  <h3>User {performer.user_id.substring(0, 8)}</h3>
                  <ReputationScore score={performer.reputation_score} size="large" />
                </div>
                <div class="performer-stats">
                  <div class="stat">
                    <span class="stat-label">Services:</span>
                    <span class="stat-value">{performer.total_services_completed}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Rating:</span>
                    <span class="stat-value">{parseFloat(performer.average_rating).toFixed(1)} ⭐</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Success Rate:</span>
                    <span class="stat-value">{parseFloat(performer.success_rate).toFixed(0)}%</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Earnings:</span>
                    <span class="stat-value">${parseFloat(performer.total_earnings).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {:else}
      <LeaderboardTable {leaderboard} {sortBy} onSort={handleSort} />

      {#if leaderboard.length >= limit}
        <div class="pagination">
          <button on:click={handlePrevPage} disabled={currentPage === 0}>
            ← Previous
          </button>
          <span class="page-info">Page {currentPage + 1}</span>
          <button on:click={handleNextPage} disabled={leaderboard.length < limit}>
            Next →
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .leaderboard-page {
    min-height: 100vh;
    background: var(--color-bg);
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .page-header p {
    color: var(--color-text-secondary);
    font-size: 1.125rem;
    margin: 0;
  }

  .view-mode-toggle {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
  }

  .view-mode-toggle button {
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-surface);
    color: var(--color-text);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .view-mode-toggle button:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .view-mode-toggle button.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
  }

  :global(.dark) .view-mode-toggle button {
    background: var(--color-bg-secondary);
  }

  :global(.dark) .view-mode-toggle button:hover {
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  }

  :global(.dark) .view-mode-toggle button.active {
    box-shadow: var(--glow-primary);
  }

  .reputation-leaderboard {
    display: grid;
    gap: var(--spacing-lg);
  }

  .performer-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
    transition: all var(--transition-base);
  }

  .performer-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .rank {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
    min-width: 60px;
    text-align: center;
  }

  .performer-info {
    flex: 1;
  }

  .performer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  .performer-header h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 1.3rem;
  }

  .performer-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .loading {
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-md);
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }

  .error-message {
    background: var(--color-error);
    color: white;
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .error-message p {
    margin: 0 0 var(--spacing-md) 0;
  }

  .error-message button {
    background: white;
    color: var(--color-error);
    border: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all var(--transition-base);
  }

  .error-message button:hover {
    transform: scale(1.05);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
  }

  .pagination button {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all var(--transition-base);
  }

  .pagination button:hover:not(:disabled) {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
  }

  .pagination button:disabled {
    background: var(--color-gray-400);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .page-info {
    color: var(--color-text);
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
  }

  .empty-state h2 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0;
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    .leaderboard-page {
      padding: var(--spacing-lg) var(--spacing-sm);
    }

    h1 {
      font-size: 1.75rem;
    }

    .page-header p {
      font-size: 1rem;
    }

    .performer-card {
      flex-direction: column;
      text-align: center;
    }

    .performer-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .view-mode-toggle {
      flex-direction: column;
    }

    .view-mode-toggle button {
      width: 100%;
    }
  }
</style>