<script>
  /**
   * ApplicantCard Component
   *
   * Displays an applicant with their application details.
   * Used by hirers to view and manage applicants.
   * Allows hirers to approve, reject, or hire applicants.
   */

  export let application = {};
  export let applicantName = 'Unknown';
  export let onStatusChange = async () => {};

  let loading = false;
  let error = '';

  function getStatusClass(status) {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      hired: 'status-hired'
    };
    return statusClasses[status] || 'status-pending';
  }

  function getStatusText(status) {
    const statusTexts = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return statusTexts[status] || status;
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function handleStatusChange(newStatus) {
    error = '';
    loading = true;

    try {
      await onStatusChange(application.id, newStatus);
    } catch (err) {
      error = err.message || 'Failed to update status';
    } finally {
      loading = false;
    }
  }
</script>

<div class="applicant-card">
  <div class="card-header">
    <div class="applicant-info">
      <h3 class="applicant-name">{applicantName}</h3>
      <span class="status-badge {getStatusClass(application.status)}">
        {getStatusText(application.status)}
      </span>
    </div>
    <div class="applied-date">
      Applied: {formatDate(application.applied_at)}
    </div>
  </div>

  {#if error}
    <div class="alert alert-error" role="alert">
      {error}
    </div>
  {/if}

  <div class="card-body">
    {#if application.application_message}
      <div class="message-section">
        <strong>Application Message:</strong>
        <p class="message-text">{application.application_message}</p>
      </div>
    {:else}
      <p class="no-message">No message provided</p>
    {/if}
  </div>

  {#if application.status === 'pending'}
    <div class="card-footer">
      <button 
        class="btn btn-success" 
        on:click={() => handleStatusChange('approved')}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Approve'}
      </button>
      <button 
        class="btn btn-danger" 
        on:click={() => handleStatusChange('rejected')}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Reject'}
      </button>
    </div>
  {:else if application.status === 'approved'}
    <div class="card-footer">
      <button 
        class="btn btn-primary" 
        on:click={() => handleStatusChange('hired')}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Hire'}
      </button>
      <button 
        class="btn btn-danger" 
        on:click={() => handleStatusChange('rejected')}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Reject'}
      </button>
    </div>
  {/if}
</div>

<style>
  .applicant-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: box-shadow 0.2s;
  }

  .applicant-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .applicant-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 1rem;
  }

  .applicant-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    flex: 1;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background-color: #fef3c7;
    color: #92400e;
  }

  .status-approved {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .status-rejected {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .status-hired {
    background-color: #d1fae5;
    color: #065f46;
  }

  .applied-date {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .card-body {
    margin-bottom: 1rem;
  }

  .message-section strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  .message-text {
    margin: 0;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    color: #4b5563;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .no-message {
    margin: 0;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    color: #9ca3af;
    font-style: italic;
  }

  .card-footer {
    display: flex;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .btn {
    flex: 1;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-success {
    background-color: #10b981;
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background-color: #059669;
  }

  .btn-danger {
    background-color: #ef4444;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background-color: #dc2626;
  }

  .alert {
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .alert-error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  @media (max-width: 640px) {
    .applicant-info {
      flex-direction: column;
      align-items: flex-start;
    }

    .card-footer {
      flex-direction: column;
    }
  }
</style>