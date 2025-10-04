<script>
  /**
   * ApplicationCard Component
   *
   * Displays an application with its status and details.
   * Used in the "My Applications" page for test takers.
   */

  export let application = {};
  export let testTitle = '';
  export let onView = () => {};

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
      day: 'numeric'
    });
  }
</script>

<div class="application-card">
  <div class="card-header">
    <h3 class="test-title">{testTitle || 'Test'}</h3>
    <span class="status-badge {getStatusClass(application.status)}">
      {getStatusText(application.status)}
    </span>
  </div>

  <div class="card-body">
    {#if application.application_message}
      <div class="message-section">
        <strong>Your Message:</strong>
        <p class="message-text">{application.application_message}</p>
      </div>
    {/if}

    <div class="meta-info">
      <span class="meta-item">
        <strong>Applied:</strong> {formatDate(application.applied_at)}
      </span>
      {#if application.updated_at && application.updated_at !== application.applied_at}
        <span class="meta-item">
          <strong>Updated:</strong> {formatDate(application.updated_at)}
        </span>
      {/if}
    </div>
  </div>

  <div class="card-footer">
    <button class="btn btn-primary" on:click={() => onView(application)}>
      View Details
    </button>
  </div>
</div>

<style>
  .application-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: box-shadow 0.2s;
  }

  .application-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .test-title {
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

  .card-body {
    margin-bottom: 1rem;
  }

  .message-section {
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
  }

  .meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .meta-item strong {
    color: #374151;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2563eb;
  }

  @media (max-width: 640px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .meta-info {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>