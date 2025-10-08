<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let offer = null;
  let loading = true;
  let error = '';
  let actionLoading = false;

  async function loadOffer() {
    loading = true;
    error = '';

    try {
      const response = await fetch(`/api/job-offers/${$page.params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load job offer');
      }

      offer = data.offer;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleAction(action, status = null) {
    if (!confirm(`Are you sure you want to ${action} this offer?`)) {
      return;
    }

    actionLoading = true;
    error = '';

    try {
      const body = action === 'withdraw' ? { action } : { status };

      const response = await fetch(`/api/job-offers/${$page.params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} offer`);
      }

      offer = data.offer;
      alert(`Offer ${action === 'withdraw' ? 'withdrawn' : status} successfully!`);
    } catch (err) {
      error = err.message;
    } finally {
      actionLoading = false;
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusClass(status) {
    const statusClasses = {
      pending: 'status-pending',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
      withdrawn: 'status-withdrawn',
      expired: 'status-expired'
    };
    return statusClasses[status] || '';
  }

  function getEmploymentTypeLabel(type) {
    const labels = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      freelance: 'Freelance'
    };
    return labels[type] || type;
  }

  onMount(() => {
    loadOffer();
  });
</script>

<svelte:head>
  <title>{offer ? offer.job_title : 'Job Offer'} - TutorLinkup</title>
</svelte:head>

<div class="container">
  <button class="back-button" on:click={() => goto('/job-offers')}>
    ← Back to Job Offers
  </button>

  {#if loading}
    <div class="loading">Loading job offer...</div>
  {:else if error && !offer}
    <div class="error-message">{error}</div>
  {:else if offer}
    <article class="offer-details">
      <header class="offer-header">
        <div>
          <h1>{offer.job_title}</h1>
          <span class="status {getStatusClass(offer.status)}">
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </span>
        </div>
        <div class="meta-info">
          <span>{getEmploymentTypeLabel(offer.employment_type)}</span>
          {#if offer.location}
            <span>📍 {offer.location}</span>
          {/if}
          {#if offer.remote_allowed}
            <span class="remote-badge">🌐 Remote OK</span>
          {/if}
        </div>
      </header>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <section class="offer-section">
        <h2>Job Description</h2>
        <p class="description">{offer.job_description}</p>
      </section>

      {#if offer.salary_min || offer.salary_max}
        <section class="offer-section">
          <h2>Compensation</h2>
          <p class="salary">
            {#if offer.salary_min && offer.salary_max}
              {offer.salary_currency} {offer.salary_min.toLocaleString()} - {offer.salary_max.toLocaleString()}
            {:else if offer.salary_min}
              {offer.salary_currency} {offer.salary_min.toLocaleString()}+
            {:else}
              Up to {offer.salary_currency} {offer.salary_max.toLocaleString()}
            {/if}
          </p>
        </section>
      {/if}

      {#if offer.requirements}
        <section class="offer-section">
          <h2>Requirements</h2>
          <p class="description">{offer.requirements}</p>
        </section>
      {/if}

      {#if offer.benefits}
        <section class="offer-section">
          <h2>Benefits</h2>
          <p class="description">{offer.benefits}</p>
        </section>
      {/if}

      <section class="offer-section">
        <h2>Offer Details</h2>
        <div class="details-grid">
          <div class="detail-item">
            <strong>Sent:</strong> {formatDate(offer.created_at)}
          </div>
          {#if offer.expires_at}
            <div class="detail-item">
              <strong>Expires:</strong> {formatDate(offer.expires_at)}
            </div>
          {/if}
          {#if offer.responded_at}
            <div class="detail-item">
              <strong>Responded:</strong> {formatDate(offer.responded_at)}
            </div>
          {/if}
        </div>
      </section>

      {#if offer.status === 'pending'}
        <div class="actions">
          <button
            class="btn-accept"
            on:click={() => handleAction('accept', 'accepted')}
            disabled={actionLoading}
          >
            ✓ Accept Offer
          </button>
          <button
            class="btn-reject"
            on:click={() => handleAction('reject', 'rejected')}
            disabled={actionLoading}
          >
            ✗ Reject Offer
          </button>
          <button
            class="btn-withdraw"
            on:click={() => handleAction('withdraw')}
            disabled={actionLoading}
          >
            Withdraw Offer
          </button>
        </div>
      {/if}
    </article>
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .back-button {
    padding: 0.5rem 1rem;
    margin-bottom: 2rem;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .back-button:hover {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.125rem;
  }

  .error-message {
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
    margin-bottom: 1.5rem;
  }

  .offer-details {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 2rem;
  }

  .offer-header {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .offer-header > div:first-child {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .status {
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-accepted {
    background: #d4edda;
    color: #155724;
  }

  .status-rejected {
    background: #f8d7da;
    color: #721c24;
  }

  .status-withdrawn,
  .status-expired {
    background: #e2e3e5;
    color: #383d41;
  }

  .meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 1rem;
    color: #666;
  }

  .remote-badge {
    background: #e7f3ff;
    color: #0066cc;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-weight: 500;
  }

  .offer-section {
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .description {
    margin: 0;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
  }

  .salary {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #28a745;
  }

  .details-grid {
    display: grid;
    gap: 1rem;
  }

  .detail-item {
    color: #666;
  }

  .detail-item strong {
    color: #333;
    margin-right: 0.5rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    padding-top: 2rem;
    border-top: 2px solid #e0e0e0;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-accept {
    background: #28a745;
    color: white;
  }

  .btn-accept:hover:not(:disabled) {
    background: #218838;
  }

  .btn-reject {
    background: #dc3545;
    color: white;
  }

  .btn-reject:hover:not(:disabled) {
    background: #c82333;
  }

  .btn-withdraw {
    background: #6c757d;
    color: white;
  }

  .btn-withdraw:hover:not(:disabled) {
    background: #545b62;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .offer-details {
      padding: 1.5rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .offer-header > div:first-child {
      flex-direction: column;
      align-items: flex-start;
    }

    .actions {
      flex-direction: column;
    }

    button {
      width: 100%;
    }
  }
</style>