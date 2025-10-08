
<script>
  import { onMount } from 'svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  let viewMode = 'applications'; // 'applications' or 'job_offers'
  let applicants = [];
  let jobOffers = [];
  let filteredItems = [];
  let loading = true;
  let error = '';
  let selectedItems = new Set();
  let filterStatus = 'all';
  let searchQuery = '';
  let showArchived = false;
  
  // Modal states
  let showDetailsModal = false;
  let showDeleteModal = false;
  let selectedItem = null;
  let actionLoading = false;

  async function loadData() {
    loading = true;
    error = '';

    try {
      if (viewMode === 'applications') {
        const response = await fetch('/api/applicants');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load applicants');
        }

        applicants = data.applicants || [];
      } else {
        const response = await fetch('/api/job-offers?view=sent');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load job offers');
        }

        jobOffers = data.offers || [];
      }
      applyFilters();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function applyFilters() {
    const items = viewMode === 'applications' ? applicants : jobOffers;
    
    filteredItems = items.filter((item) => {
      // Status filter
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }

      // Archived filter (only for applications)
      if (viewMode === 'applications' && !showArchived && item.archived) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (viewMode === 'applications') {
          const matchesMessage = item.application_message?.toLowerCase().includes(query);
          const matchesId = item.id?.toLowerCase().includes(query);
          const matchesTestId = item.test_id?.toLowerCase().includes(query);
          return matchesMessage || matchesId || matchesTestId;
        } else {
          const matchesTitle = item.job_title?.toLowerCase().includes(query);
          const matchesDescription = item.job_description?.toLowerCase().includes(query);
          const matchesId = item.id?.toLowerCase().includes(query);
          return matchesTitle || matchesDescription || matchesId;
        }
      }

      return true;
    });
  }

  async function updateStatus(id, newStatus) {
    actionLoading = true;
    try {
      const endpoint = viewMode === 'applications' 
        ? `/api/applicants/${id}` 
        : `/api/job-offers/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Update local state
      if (viewMode === 'applications') {
        applicants = applicants.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        );
      } else {
        jobOffers = jobOffers.map((offer) =>
          offer.id === id ? { ...offer, status: newStatus } : offer
        );
      }
      applyFilters();
    } catch (err) {
      error = err.message;
    } finally {
      actionLoading = false;
    }
  }

  async function archiveItem(id) {
    if (viewMode !== 'applications') return; // Only applications can be archived
    
    actionLoading = true;
    try {
      const response = await fetch(`/api/applicants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to archive item');
      }

      // Update local state
      applicants = applicants.map((app) =>
        app.id === id ? { ...app, archived: true } : app
      );
      applyFilters();
      showDetailsModal = false;
    } catch (err) {
      error = err.message;
    } finally {
      actionLoading = false;
    }
  }

  async function deleteItem(id) {
    actionLoading = true;
    try {
      const endpoint = viewMode === 'applications' 
        ? `/api/applicants/${id}` 
        : `/api/job-offers/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete item');
      }

      // Remove from local state
      if (viewMode === 'applications') {
        applicants = applicants.filter((app) => app.id !== id);
      } else {
        jobOffers = jobOffers.filter((offer) => offer.id !== id);
      }
      applyFilters();
      showDeleteModal = false;
      showDetailsModal = false;
    } catch (err) {
      error = err.message;
    } finally {
      actionLoading = false;
    }
  }

  async function bulkUpdateStatus(newStatus) {
    if (selectedItems.size === 0) return;

    actionLoading = true;
    try {
      const endpoint = viewMode === 'applications' ? '/api/applicants' : '/api/job-offers';
      
      const promises = Array.from(selectedItems).map((id) =>
        fetch(`${endpoint}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })
      );

      await Promise.all(promises);

      // Update local state
      if (viewMode === 'applications') {
        applicants = applicants.map((app) =>
          selectedItems.has(app.id) ? { ...app, status: newStatus } : app
        );
      } else {
        jobOffers = jobOffers.map((offer) =>
          selectedItems.has(offer.id) ? { ...offer, status: newStatus } : offer
        );
      }
      applyFilters();
      selectedItems.clear();
      selectedItems = selectedItems;
    } catch (err) {
      error = 'Failed to update some items';
    } finally {
      actionLoading = false;
    }
  }

  function toggleSelectAll() {
    if (selectedItems.size === filteredItems.length) {
      selectedItems.clear();
    } else {
      filteredItems.forEach((item) => selectedItems.add(item.id));
    }
    selectedItems = selectedItems;
  }

  function toggleSelect(id) {
    if (selectedItems.has(id)) {
      selectedItems.delete(id);
    } else {
      selectedItems.add(id);
    }
    selectedItems = selectedItems;
  }

  function openDetailsModal(item) {
    selectedItem = item;
    showDetailsModal = true;
  }

  function openDeleteModal(item) {
    selectedItem = item;
    showDeleteModal = true;
  }

  function switchViewMode(mode) {
    viewMode = mode;
    selectedItems.clear();
    selectedItems = selectedItems;
    filterStatus = 'all';
    searchQuery = '';
    loadData();
  }

  function getStatusClass(status) {
    const classes = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      hired: 'status-hired',
      accepted: 'status-approved',
      withdrawn: 'status-rejected',
      expired: 'status-rejected'
    };
    return classes[status] || 'status-pending';
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  $: {
    searchQuery;
    filterStatus;
    showArchived;
    applyFilters();
  }

  onMount(() => {
    loadData();
  });
</script>

<svelte:head>
  <title>Manage Applicants & Job Offers - TutorLinkup</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Manage Applicants & Job Offers</h1>
    <button on:click={loadData} class="btn-secondary" disabled={loading}>
      {loading ? 'Loading...' : 'Refresh'}
    </button>
  </header>

  <div class="view-mode-tabs">
    <button
      class="tab"
      class:active={viewMode === 'applications'}
      on:click={() => switchViewMode('applications')}
    >
      Test Applicants
    </button>
    <button
      class="tab"
      class:active={viewMode === 'job_offers'}
      on:click={() => switchViewMode('job_offers')}
    >
      Job Offers Sent
    </button>
  </div>

  {#if error}
    <div class="error-box">
      <p>{error}</p>
      <button on:click={() => (error = '')} class="btn-secondary">Dismiss</button>
    </div>
  {/if}

  <div class="filters-section">
    <div class="search-box">
      <input
        type="text"
        placeholder="Search..."
        bind:value={searchQuery}
        class="search-input"
      />
    </div>

    <div class="filter-controls">
      <select bind:value={filterStatus} class="filter-select">
        <option value="all">All Statuses</option>
        {#if viewMode === 'applications'}
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        {:else}
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="expired">Expired</option>
        {/if}
      </select>

      {#if viewMode === 'applications'}
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={showArchived} />
          Show Archived
        </label>
      {/if}
    </div>
  </div>

  {#if selectedItems.size > 0}
    <div class="bulk-actions">
      <span class="selected-count">{selectedItems.size} selected</span>
      <div class="bulk-buttons">
        {#if viewMode === 'applications'}
          <button
            on:click={() => bulkUpdateStatus('approved')}
            class="btn-success"
            disabled={actionLoading}
          >
            Approve Selected
          </button>
          <button
            on:click={() => bulkUpdateStatus('rejected')}
            class="btn-danger"
            disabled={actionLoading}
          >
            Reject Selected
          </button>
        {:else}
          <button
            on:click={() => bulkUpdateStatus('withdrawn')}
            class="btn-danger"
            disabled={actionLoading}
          >
            Withdraw Selected
          </button>
        {/if}
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="loading-container">
      <Spinner />
      <p>Loading {viewMode === 'applications' ? 'applicants' : 'job offers'}...</p>
    </div>
  {:else if filteredItems.length === 0}
    <div class="empty-state">
      <h2>No {viewMode === 'applications' ? 'Applicants' : 'Job Offers'} Found</h2>
      <p>
        {#if searchQuery || filterStatus !== 'all' || (viewMode === 'applications' && showArchived)}
          Try adjusting your filters or search query.
        {:else if viewMode === 'applications'}
          No applicants have applied yet.
        {:else}
          You haven't sent any job offers yet.
        {/if}
      </p>
    </div>
  {:else}
    <div class="table-container">
      <table class="applicants-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedItems.size === filteredItems.length}
                on:change={toggleSelectAll}
              />
            </th>
            <th>Status</th>
            {#if viewMode === 'applications'}
              <th>Test ID</th>
              <th>Message</th>
              <th>Applied</th>
            {:else}
              <th>Job Title</th>
              <th>Test Taker</th>
              <th>Employment Type</th>
              <th>Created</th>
            {/if}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredItems as item (item.id)}
            <tr class:archived={item.archived}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  on:change={() => toggleSelect(item.id)}
                />
              </td>
              <td>
                <span class="status-badge {getStatusClass(item.status)}">
                  {item.status}
                </span>
                {#if item.archived}
                  <span class="archived-badge">Archived</span>
                {/if}
              </td>
              {#if viewMode === 'applications'}
                <td class="test-id">{item.test_id.slice(0, 8)}...</td>
                <td class="message-cell">
                  {item.application_message?.slice(0, 50) || 'No message'}
                  {#if item.application_message?.length > 50}...{/if}
                </td>
                <td class="date-cell">{formatDate(item.applied_at)}</td>
              {:else}
                <td class="job-title">{item.job_title}</td>
                <td class="test-taker-id">{item.test_taker_id.slice(0, 8)}...</td>
                <td class="employment-type">{item.employment_type.replace('_', ' ')}</td>
                <td class="date-cell">{formatDate(item.created_at)}</td>
              {/if}
              <td class="actions-cell">
                <button
                  on:click={() => openDetailsModal(item)}
                  class="btn-small btn-primary"
                >
                  View
                </button>
                {#if viewMode === 'applications' && item.status === 'pending'}
                  <button
                    on:click={() => updateStatus(item.id, 'approved')}
                    class="btn-small btn-success"
                    disabled={actionLoading}
                  >
                    Approve
                  </button>
                  <button
                    on:click={() => updateStatus(item.id, 'rejected')}
                    class="btn-small btn-danger"
                    disabled={actionLoading}
                  >
                    Reject
                  </button>
                {:else if viewMode === 'job_offers' && item.status === 'pending'}
                  <button
                    on:click={() => updateStatus(item.id, 'withdrawn')}
                    class="btn-small btn-danger"
                    disabled={actionLoading}
                  >
                    Withdraw
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showDetailsModal && selectedItem}
  <Modal on:close={() => (showDetailsModal = false)}>
    <div class="modal-content">
      <h2>{viewMode === 'applications' ? 'Applicant' : 'Job Offer'} Details</h2>
      
      <div class="detail-section">
        <strong>ID:</strong>
        <p>{selectedItem.id}</p>
      </div>

      {#if viewMode === 'applications'}
        <div class="detail-section">
          <strong>Test ID:</strong>
          <p>{selectedItem.test_id}</p>
        </div>

        <div class="detail-section">
          <strong>Status:</strong>
          <span class="status-badge {getStatusClass(selectedItem.status)}">
            {selectedItem.status}
          </span>
        </div>

        <div class="detail-section">
          <strong>Application Message:</strong>
          <p class="message-full">
            {selectedItem.application_message || 'No message provided'}
          </p>
        </div>

        <div class="detail-section">
          <strong>Applied At:</strong>
          <p>{formatDate(selectedItem.applied_at)}</p>
        </div>
      {:else}
        <div class="detail-section">
          <strong>Job Title:</strong>
          <p>{selectedItem.job_title}</p>
        </div>

        <div class="detail-section">
          <strong>Status:</strong>
          <span class="status-badge {getStatusClass(selectedItem.status)}">
            {selectedItem.status}
          </span>
        </div>

        <div class="detail-section">
          <strong>Job Description:</strong>
          <p class="message-full">{selectedItem.job_description}</p>
        </div>

        <div class="detail-section">
          <strong>Employment Type:</strong>
          <p>{selectedItem.employment_type.replace('_', ' ')}</p>
        </div>

        {#if selectedItem.salary_min || selectedItem.salary_max}
          <div class="detail-section">
            <strong>Salary Range:</strong>
            <p>
              {selectedItem.salary_currency} {selectedItem.salary_min || '?'} - {selectedItem.salary_max || '?'}
            </p>
          </div>
        {/if}

        {#if selectedItem.location}
          <div class="detail-section">
            <strong>Location:</strong>
            <p>{selectedItem.location} {selectedItem.remote_allowed ? '(Remote allowed)' : ''}</p>
          </div>
        {/if}

        <div class="detail-section">
          <strong>Created At:</strong>
          <p>{formatDate(selectedItem.created_at)}</p>
        </div>
      {/if}

      {#if selectedItem.updated_at}
        <div class="detail-section">
          <strong>Last Updated:</strong>
          <p>{formatDate(selectedItem.updated_at)}</p>
        </div>
      {/if}

      <div class="modal-actions">
        {#if viewMode === 'applications' && selectedItem.status === 'pending'}
          <button
            on:click={() => updateStatus(selectedItem.id, 'approved')}
            class="btn-success"
            disabled={actionLoading}
          >
            Approve
          </button>
          <button
            on:click={() => updateStatus(selectedItem.id, 'rejected')}
            class="btn-danger"
            disabled={actionLoading}
          >
            Reject
          </button>
        {:else if viewMode === 'job_offers' && selectedItem.status === 'pending'}
          <button
            on:click={() => updateStatus(selectedItem.id, 'withdrawn')}
            class="btn-danger"
            disabled={actionLoading}
          >
            Withdraw
          </button>
        {/if}
        
        {#if viewMode === 'applications' && !selectedItem.archived}
          <button
            on:click={() => archiveItem(selectedItem.id)}
            class="btn-secondary"
            disabled={actionLoading}
          >
            Archive
          </button>
        {/if}

        <button
          on:click={() => openDeleteModal(selectedItem)}
          class="btn-danger"
          disabled={actionLoading}
        >
          Delete
        </button>
      </div>
    </div>
  </Modal>
{/if}

{#if showDeleteModal && selectedItem}
  <Modal on:close={() => (showDeleteModal = false)}>
    <div class="modal-content">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to permanently delete this {viewMode === 'applications' ? 'applicant' : 'job offer'}?</p>
      <p class="warning-text">This action cannot be undone.</p>
      
      <div class="modal-actions">
        <button
          on:click={() => deleteItem(selectedItem.id)}
          class="btn-danger"
          disabled={actionLoading}
        >
          {actionLoading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          on:click={() => (showDeleteModal = false)}
          class="btn-secondary"
          disabled={actionLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
{/if}

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .view-mode-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }

  .tab {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--color-text-secondary);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .tab:hover {
    color: var(--color-text);
    background: var(--color-bg-secondary);
  }

  .tab.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  .filters-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .search-box {
    flex: 1;
    min-width: 300px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 1rem;
  }

  .filter-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text);
    cursor: pointer;
  }

  .bulk-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
  }

  .selected-count {
    font-weight: 600;
    color: var(--color-text);
  }

  .bulk-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .table-container {
    overflow-x: auto;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .applicants-table {
    width: 100%;
    border-collapse: collapse;
  }

  .applicants-table thead {
    background: var(--color-bg-secondary);
  }

  .applicants-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-text);
    border-bottom: 2px solid var(--color-border);
  }

  .applicants-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
  }

  .applicants-table tr:hover {
    background: var(--color-bg-secondary);
  }

  .applicants-table tr.archived {
    opacity: 0.6;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background-color: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .status-approved {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .status-rejected {
    background-color: var(--color-error-light);
    color: var(--color-error-dark);
  }

  .status-hired {
    background-color: var(--color-info-light);
    color: var(--color-info-dark);
  }

  .archived-badge {
    margin-left: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
  }

  .test-id, .test-taker-id {
    font-family: monospace;
    font-size: 0.875rem;
  }

  .message-cell, .job-title {
    max-width: 300px;
  }

  .employment-type {
    text-transform: capitalize;
  }

  .date-cell {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .btn-small {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-primary,
  .btn-secondary,
  .btn-success,
  .btn-danger {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-success {
    background: var(--color-success);
    color: white;
  }

  .btn-danger {
    background: var(--color-error);
    color: white;
  }

  .btn-primary:hover,
  .btn-success:hover,
  .btn-danger:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-container {
    text-align: center;
    padding: 3rem 1rem;
  }

  .loading-container p {
    margin-top: 1rem;
    color: var(--color-text-secondary);
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
  }

  .empty-state h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .error-box {
    padding: 1rem;
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .error-box p {
    margin: 0;
    color: var(--color-error-dark);
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-content h2 {
    margin: 0 0 1.5rem 0;
    color: var(--color-text);
  }

  .detail-section {
    margin-bottom: 1rem;
  }

  .detail-section strong {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  .detail-section p {
    margin: 0;
    color: var(--color-text-secondary);
  }

  .message-full {
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    white-space: pre-wrap;
  }

  .warning-text {
    color: var(--color-error);
    font-weight: 600;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .filters-section {
      flex-direction: column;
    }

    .search-box {
      min-width: 100%;
    }

    .bulk-actions {
      flex-direction: column;
      gap: 1rem;
    }

    .table-container {
      font-size: 0.875rem;
    }

    .applicants-table th,
    .applicants-table td {
      padding: 0.5rem;
    }
  }
</style>