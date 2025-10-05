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
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
    transition: all var(--transition-base);
  }

  .application-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  :global(.dark) .application-card:hover {
    box-shadow: var(--glow-primary);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .test-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    flex: 1;
  }

  .status-badge {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background-color: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  :global(.dark) .status-pending {
    background-color: rgba(251, 191, 36, 0.2);
    color: var(--color-warning-light);
  }

  .status-approved {
    background-color: var(--color-info-light);
    color: var(--color-info-dark);
  }

  :global(.dark) .status-approved {
    background-color: rgba(59, 130, 246, 0.2);
    color: var(--color-info-light);
  }

  .status-rejected {
    background-color: var(--color-error-light);
    color: var(--color-error-dark);
  }

  :global(.dark) .status-rejected {
    background-color: rgba(255, 0, 85, 0.2);
    color: var(--color-error-light);
  }

  .status-hired {
    background-color: var(--color-success-light);
    color: var(--color-success-dark);
  }

  :global(.dark) .status-hired {
    background-color: rgba(34, 197, 94, 0.2);
    color: var(--color-success-light);
  }

  .card-body {
    margin-bottom: var(--spacing-md);
  }

  .message-section {
    margin-bottom: var(--spacing-md);
  }

  .message-section strong {
    display: block;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
  }

  .message-text {
    margin: 0;
    padding: var(--spacing-md);
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .meta-item strong {
    color: var(--color-text);
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
  }

  .btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .btn-primary:hover {
    background-color: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-primary:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  @media (max-width: 640px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .meta-info {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style>