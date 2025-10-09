<script>
  export let job;
  export let showActions = true;

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getStatusClass(status) {
    const statusClasses = {
      pending: 'status-pending',
      assigned: 'status-assigned',
      in_progress: 'status-progress',
      submitted: 'status-submitted',
      revision_requested: 'status-revision',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  }

  function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function formatJobType(jobType) {
    return jobType.charAt(0).toUpperCase() + jobType.slice(1);
  }

  function getJobTypeClass(jobType) {
    const typeClasses = {
      tutoring: 'type-tutoring',
      programming: 'type-programming',
      exercise: 'type-exercise',
      homework: 'type-homework'
    };
    return typeClasses[jobType] || 'type-homework';
  }
</script>

<div class="job-card">
  <div class="card-header">
    <div class="header-content">
      <h3>{job.title}</h3>
      {#if job.job_type}
        <span class="job-type {getJobTypeClass(job.job_type)}">
          {formatJobType(job.job_type)}
        </span>
      {/if}
    </div>
    <span class="status {getStatusClass(job.status)}">
      {formatStatus(job.status)}
    </span>
  </div>

  <div class="card-body">
    <p class="topic"><strong>Topic:</strong> {job.topic}</p>
    <p class="description">{job.description}</p>

    <div class="card-meta">
      <div class="meta-item">
        <span class="label">Word Count:</span>
        <span class="value">{job.word_count.toLocaleString()}</span>
      </div>

      {#if job.academic_levels?.name}
        <div class="meta-item">
          <span class="label">Level:</span>
          <span class="value">{job.academic_levels.name}</span>
        </div>
      {/if}

      {#if job.citation_styles?.name}
        <div class="meta-item">
          <span class="label">Citation:</span>
          <span class="value">{job.citation_styles.name}</span>
        </div>
      {/if}

      <div class="meta-item">
        <span class="label">Deadline:</span>
        <span class="value">{formatDate(job.deadline)}</span>
      </div>

      <div class="meta-item">
        <span class="label">Price:</span>
        <span class="value price">
          {#if job.max_price}
            {job.price} - {job.max_price} {job.cryptocurrency || 'BTC'}
          {:else}
            {job.price} {job.cryptocurrency || 'BTC'}
          {/if}
        </span>
      </div>

      {#if job.plagiarism_check_requested}
        <div class="meta-item">
          <span class="badge">Plagiarism Check</span>
        </div>
      {/if}
    </div>
  </div>

  {#if showActions}
    <div class="card-actions">
      <a href="/jobs/{job.id}" class="btn-view">
        View Details
      </a>
    </div>
  {/if}
</div>

<style>
  .job-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: box-shadow var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .job-card:hover {
    box-shadow: var(--shadow-md);
  }

  :global(.dark) .job-card:hover {
    box-shadow: var(--shadow-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    flex: 1;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .job-type {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }

  .type-tutoring {
    background: rgba(91, 127, 232, 0.15);
    color: var(--color-primary);
  }

  :global(.dark) .type-tutoring {
    background: rgba(0, 240, 255, 0.2);
    color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }

  .type-programming {
    background: rgba(178, 75, 243, 0.15);
    color: var(--color-info);
  }

  :global(.dark) .type-programming {
    background: rgba(178, 75, 243, 0.2);
    color: var(--color-info);
    box-shadow: 0 0 5px rgba(178, 75, 243, 0.3);
  }

  .type-exercise {
    background: rgba(255, 167, 38, 0.15);
    color: var(--color-warning);
  }

  :global(.dark) .type-exercise {
    background: rgba(255, 215, 0, 0.2);
    color: var(--color-warning);
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
  }

  .type-homework {
    background: rgba(76, 175, 80, 0.15);
    color: var(--color-success);
  }

  :global(.dark) .type-homework {
    background: rgba(0, 255, 136, 0.2);
    color: var(--color-success);
    box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
  }

  .status {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background: rgba(255, 167, 38, 0.15);
    color: var(--color-warning);
  }

  :global(.dark) .status-pending {
    background: rgba(255, 215, 0, 0.2);
    color: var(--color-warning);
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
  }

  .status-assigned {
    background: rgba(91, 127, 232, 0.15);
    color: var(--color-primary);
  }

  :global(.dark) .status-assigned {
    background: rgba(0, 240, 255, 0.2);
    color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }

  .status-progress {
    background: rgba(178, 75, 243, 0.15);
    color: var(--color-info);
  }

  :global(.dark) .status-progress {
    background: rgba(178, 75, 243, 0.2);
    color: var(--color-info);
    box-shadow: 0 0 5px rgba(178, 75, 243, 0.3);
  }

  .status-submitted {
    background: rgba(76, 175, 80, 0.15);
    color: var(--color-success);
  }

  :global(.dark) .status-submitted {
    background: rgba(0, 255, 136, 0.2);
    color: var(--color-success);
    box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
  }

  .status-revision {
    background: rgba(239, 83, 80, 0.15);
    color: var(--color-error);
  }

  :global(.dark) .status-revision {
    background: rgba(255, 0, 85, 0.2);
    color: var(--color-error);
    box-shadow: 0 0 5px rgba(255, 0, 85, 0.3);
  }

  .status-completed {
    background: rgba(76, 175, 80, 0.15);
    color: var(--color-success);
  }

  :global(.dark) .status-completed {
    background: rgba(0, 255, 136, 0.2);
    color: var(--color-success);
    box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
  }

  .status-cancelled {
    background: rgba(239, 83, 80, 0.15);
    color: var(--color-error);
  }

  :global(.dark) .status-cancelled {
    background: rgba(255, 0, 85, 0.2);
    color: var(--color-error);
    box-shadow: 0 0 5px rgba(255, 0, 85, 0.3);
  }

  .card-body {
    padding: var(--spacing-lg);
  }

  .topic {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text-secondary);
  }

  .description {
    margin: 0 0 var(--spacing-lg) 0;
    color: var(--color-text-secondary);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .label {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .value {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .value.price {
    color: var(--color-success);
    font-weight: 600;
  }

  :global(.dark) .value.price {
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
  }

  .badge {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: rgba(91, 127, 232, 0.15);
    color: var(--color-primary);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
  }

  :global(.dark) .badge {
    background: rgba(0, 240, 255, 0.2);
    color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }

  .card-actions {
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-secondary);
  }

  .btn-view {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .btn-view:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-view {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-view:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  @media (max-width: 640px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .card-meta {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style>