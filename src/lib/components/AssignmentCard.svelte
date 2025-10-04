<script>
  export let assignment;
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
</script>

<div class="assignment-card">
  <div class="card-header">
    <h3>{assignment.title}</h3>
    <span class="status {getStatusClass(assignment.status)}">
      {formatStatus(assignment.status)}
    </span>
  </div>

  <div class="card-body">
    <p class="topic"><strong>Topic:</strong> {assignment.topic}</p>
    <p class="description">{assignment.description}</p>

    <div class="card-meta">
      <div class="meta-item">
        <span class="label">Word Count:</span>
        <span class="value">{assignment.word_count.toLocaleString()}</span>
      </div>

      {#if assignment.academic_levels?.name}
        <div class="meta-item">
          <span class="label">Level:</span>
          <span class="value">{assignment.academic_levels.name}</span>
        </div>
      {/if}

      {#if assignment.citation_styles?.name}
        <div class="meta-item">
          <span class="label">Citation:</span>
          <span class="value">{assignment.citation_styles.name}</span>
        </div>
      {/if}

      <div class="meta-item">
        <span class="label">Deadline:</span>
        <span class="value">{formatDate(assignment.deadline)}</span>
      </div>

      <div class="meta-item">
        <span class="label">Price:</span>
        <span class="value price">${assignment.price.toFixed(2)}</span>
      </div>

      {#if assignment.plagiarism_check_requested}
        <div class="meta-item">
          <span class="badge">Plagiarism Check</span>
        </div>
      {/if}
    </div>
  </div>

  {#if showActions}
    <div class="card-actions">
      <a href="/assignments/{assignment.id}" class="btn-view">
        View Details
      </a>
    </div>
  {/if}
</div>

<style>
  .assignment-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .assignment-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    flex: 1;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-assigned {
    background: #d1ecf1;
    color: #0c5460;
  }

  .status-progress {
    background: #cce5ff;
    color: #004085;
  }

  .status-submitted {
    background: #d4edda;
    color: #155724;
  }

  .status-revision {
    background: #f8d7da;
    color: #721c24;
  }

  .status-completed {
    background: #d4edda;
    color: #155724;
  }

  .status-cancelled {
    background: #f8d7da;
    color: #721c24;
  }

  .card-body {
    padding: 1.5rem;
  }

  .topic {
    margin: 0 0 0.75rem 0;
    color: #555;
  }

  .description {
    margin: 0 0 1.5rem 0;
    color: #666;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    color: #666;
  }

  .value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
  }

  .value.price {
    color: #28a745;
    font-weight: 600;
  }

  .badge {
    padding: 0.25rem 0.5rem;
    background: #e7f3ff;
    color: #0066cc;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .card-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e0e0e0;
    background: #f8f9fa;
  }

  .btn-view {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn-view:hover {
    background: #0056b3;
  }

  @media (max-width: 640px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .card-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>