<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ApplicantCard from '$lib/components/ApplicantCard.svelte';

  let test = null;
  let applicants = [];
  let loading = true;
  let error = '';

  async function loadTestAndApplicants() {
    loading = true;
    error = '';

    try {
      // Load test details
      const testResponse = await fetch(`/api/tests/${$page.params.id}`);
      const testData = await testResponse.json();

      if (!testResponse.ok) {
        throw new Error(testData.error || 'Failed to load test');
      }

      test = testData.test;

      // Load applicants
      const applicantsResponse = await fetch(`/api/tests/${$page.params.id}/applicants`);
      const applicantsData = await applicantsResponse.json();

      if (!applicantsResponse.ok) {
        throw new Error(applicantsData.error || 'Failed to load applicants');
      }

      applicants = applicantsData.applications || [];
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleStatusChange(applicationId, newStatus) {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Reload applicants to reflect changes
      await loadTestAndApplicants();
    } catch (err) {
      alert(err.message);
    }
  }

  function getStatusCount(status) {
    return applicants.filter(app => app.status === status).length;
  }

  onMount(() => {
    loadTestAndApplicants();
  });
</script>

<svelte:head>
  <title>Applicants - {test ? test.title : 'Test'} - TutorLinkup</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <div class="header-content">
      <h1>Applicants</h1>
      <a href="/browse-tests/{$page.params.id}" class="back-link">← Back to Test</a>
    </div>
    {#if test}
      <h2 class="test-title">{test.title}</h2>
    {/if}
  </header>

  {#if loading}
    <div class="loading">Loading applicants...</div>
  {:else if error}
    <div class="error-box">
      <p>{error}</p>
      <button on:click={loadTestAndApplicants} class="btn-secondary">Try Again</button>
    </div>
  {:else}
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">Total</span>
        <span class="stat-value">{applicants.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Pending</span>
        <span class="stat-value stat-pending">{getStatusCount('pending')}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Approved</span>
        <span class="stat-value stat-approved">{getStatusCount('approved')}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Hired</span>
        <span class="stat-value stat-hired">{getStatusCount('hired')}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Rejected</span>
        <span class="stat-value stat-rejected">{getStatusCount('rejected')}</span>
      </div>
    </div>

    {#if applicants.length === 0}
      <div class="empty-state">
        <h3>No Applicants Yet</h3>
        <p>No one has applied to this test yet. Share your test to get more applicants!</p>
        <a href="/browse-tests/{$page.params.id}" class="btn-primary">View Test</a>
      </div>
    {:else}
      <div class="applicants-list">
        {#each applicants as application (application.id)}
          <ApplicantCard
            {application}
            applicantName="User #{application.test_taker_id.slice(0, 8)}"
            onStatusChange={handleStatusChange}
          />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .page-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .back-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-base);
  }

  .back-link:hover {
    color: var(--color-primary-hover);
  }

  .test-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .error-box {
    text-align: center;
    padding: 2rem;
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    color: var(--color-error-dark);
  }

  .error-box p {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
  }

  .btn-secondary,
  .btn-primary {
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-base);
    display: inline-block;
    box-shadow: var(--shadow-sm);
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--color-secondary);
    color: white;
  }

  .btn-secondary:hover {
    background: var(--color-secondary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .stats-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    flex-wrap: wrap;
    box-shadow: var(--shadow-sm);
  }

  .stat-item {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .stat-pending {
    color: var(--color-warning);
  }

  .stat-approved {
    color: var(--color-info);
  }

  .stat-hired {
    color: var(--color-success);
  }

  .stat-rejected {
    color: var(--color-error);
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
  }

  .empty-state h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .applicants-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .stats-bar {
      flex-direction: column;
      gap: 1rem;
    }

    .stat-item {
      min-width: 100%;
    }
  }
</style>