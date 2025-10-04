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
    background: #f8f9fa;
    padding: 40px 20px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  h1 {
    font-size: 2.5rem;
    color: #212529;
    margin: 0 0 12px 0;
  }

  .page-header p {
    color: #6c757d;
    font-size: 1.125rem;
    margin: 0;
  }

  .loading {
    text-align: center;
    padding: 60px 20px;
    color: #6c757d;
    font-size: 1.125rem;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }

  .error-message p {
    margin: 0 0 16px 0;
  }

  .error-message button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .error-message button:hover {
    background: #c82333;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 24px;
    padding: 20px;
  }

  .pagination button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .pagination button:hover:not(:disabled) {
    background: #0056b3;
  }

  .pagination button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .page-info {
    color: #495057;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .leaderboard-page {
      padding: 20px 10px;
    }

    h1 {
      font-size: 1.75rem;
    }

    .page-header p {
      font-size: 1rem;
    }
  }
</style>