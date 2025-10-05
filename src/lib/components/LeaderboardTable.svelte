<script>
  import HireMeButton from './HireMeButton.svelte';
  import JobOfferForm from './JobOfferForm.svelte';

  export let leaderboard = [];
  export let sortBy = 'tests_completed';
  export let onSort = () => {};

  let showOfferModal = false;
  let selectedTestTaker = null;

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
    if (rating === null || rating === undefined) return 'No ratings';
    return `${rating.toFixed(1)} ⭐`;
  };

  const handleSort = (field) => {
    onSort(field);
  };

  const getSortIcon = (field) => {
    return sortBy === field ? '▼' : '';
  };

  const handleHire = (event) => {
    selectedTestTaker = {
      id: event.detail.testTakerId,
      name: event.detail.testTakerName
    };
    showOfferModal = true;
  };

  const handleOfferSuccess = () => {
    showOfferModal = false;
    selectedTestTaker = null;
    alert('Job offer sent successfully!');
  };

  const handleOfferCancel = () => {
    showOfferModal = false;
    selectedTestTaker = null;
  };
</script>

<div class="leaderboard-table">
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Test Taker</th>
        <th>
          <button on:click={() => handleSort('tests_completed')}>
            Tests Completed {getSortIcon('tests_completed')}
          </button>
        </th>
        <th>
          <button on:click={() => handleSort('success_rate')}>
            Success Rate {getSortIcon('success_rate')}
          </button>
        </th>
        <th>
          <button on:click={() => handleSort('average_rating')}>
            Rating {getSortIcon('average_rating')}
          </button>
        </th>
        <th>
          <button on:click={() => handleSort('total_earned')}>
            Total Earned {getSortIcon('total_earned')}
          </button>
        </th>
        <th>Location</th>
        <th>Skills</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each leaderboard as user, index}
        <tr>
          <td class="rank">#{index + 1}</td>
          <td class="user-info">
            <div class="user-details">
              {#if user.avatar_url}
                <img src={user.avatar_url} alt={user.full_name} class="avatar" />
              {:else}
                <div class="avatar-placeholder">{user.full_name?.charAt(0) || '?'}</div>
              {/if}
              <div>
                <div class="user-name">{user.full_name || 'Anonymous'}</div>
                {#if user.bio}
                  <div class="user-bio">{user.bio}</div>
                {/if}
              </div>
            </div>
          </td>
          <td>{formatNumber(user.tests_completed)}</td>
          <td>{formatPercentage(user.success_rate)}</td>
          <td>{formatRating(user.average_rating)}</td>
          <td>{formatCurrency(user.total_earned)}</td>
          <td>{user.location || 'N/A'}</td>
          <td>
            {#if user.skills && user.skills.length > 0}
              <div class="skills">
                {#each user.skills.slice(0, 3) as skill}
                  <span class="skill-tag">{skill}</span>
                {/each}
                {#if user.skills.length > 3}
                  <span class="skill-tag">+{user.skills.length - 3}</span>
                {/if}
              </div>
            {:else}
              N/A
            {/if}
          </td>
          <td>
            <HireMeButton
              testTakerId={user.id}
              testTakerName={user.full_name}
              size="small"
              on:hire={handleHire}
            />
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="9" class="no-data">No test takers found</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#if showOfferModal && selectedTestTaker}
  <div
    class="modal-overlay"
    on:click={handleOfferCancel}
    on:keydown={(e) => e.key === 'Escape' && handleOfferCancel()}
    role="button"
    tabindex="0"
  >
    <div
      class="modal-content"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <button class="modal-close" on:click={handleOfferCancel}>×</button>
      <JobOfferForm
        testTakerId={selectedTestTaker.id}
        testTakerName={selectedTestTaker.name}
        on:success={handleOfferSuccess}
        on:cancel={handleOfferCancel}
      />
    </div>
  </div>
{/if}

<style>
  .leaderboard-table {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  thead {
    background: #f8f9fa;
  }

  th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
  }

  th button {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    padding: 0;
    text-align: left;
    width: 100%;
  }

  th button:hover {
    color: #007bff;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
  }

  tr:hover {
    background: #f8f9fa;
  }

  .rank {
    font-weight: 600;
    color: #6c757d;
  }

  .user-info {
    min-width: 200px;
  }

  .user-details {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .user-name {
    font-weight: 600;
    color: #212529;
  }

  .user-bio {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 4px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .skill-tag {
    background: #e9ecef;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #495057;
  }

  .no-data {
    text-align: center;
    color: #6c757d;
    padding: 24px;
  }

  @media (max-width: 768px) {
    .leaderboard-table {
      font-size: 0.875rem;
    }

    th,
    td {
      padding: 8px;
    }

    .user-bio {
      display: none;
    }
  }
</style>