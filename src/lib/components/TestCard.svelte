<script>
  import { onMount } from 'svelte';

  export let test;
  export let showEditIcon = false;

  let usdValue = 0;
  let usdValueMax = 0;
  let attachments = [];
  let loadingAttachments = false;

  async function loadAttachments() {
    if (!test?.id) return;
    
    loadingAttachments = true;
    try {
      const response = await fetch(`/api/tests/${test.id}/attachments`);
      const data = await response.json();
      
      if (response.ok) {
        attachments = data.attachments || [];
      }
    } catch (error) {
      console.error('Failed to load attachments:', error);
    } finally {
      loadingAttachments = false;
    }
  }

  async function calculateUsdValues() {
    try {
      const response = await fetch(`/api/exchange-rate/${test.cryptocurrency}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rate');
      }
      
      const rate = data.rate;
      usdValue = (test.price * rate).toFixed(2);
      if (test.price_max) {
        usdValueMax = (test.price_max * rate).toFixed(2);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  }

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
      open: 'status-open',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  function getStatusLabel(status) {
    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }

  function getFileIcon(fileType) {
    if (!fileType) return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('compressed')) return '📦';
    return '📄';
  }

  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  onMount(() => {
    calculateUsdValues();
    loadAttachments();
  });
</script>

<article class="test-card">
  <div class="test-header">
    <h3>
      <a href="/browse-tests/{test.id}">{test.title}</a>
      {#if showEditIcon}
        <a href="/browse-tests/{test.id}/edit" class="edit-icon" title="Edit test">✏️</a>
      {/if}
    </h3>
    <span class="status {getStatusClass(test.status)}">
      {getStatusLabel(test.status)}
    </span>
  </div>

  <p class="test-description">{test.description}</p>

  <div class="test-meta">
    {#if test.category}
      <span class="meta-item">
        <strong>Category:</strong> {test.category}
      </span>
    {/if}
    {#if test.difficulty}
      <span class="meta-item">
        <strong>Difficulty:</strong> {test.difficulty}
      </span>
    {/if}
  </div>

  {#if attachments.length > 0}
    <div class="attachments">
      <div class="attachments-header">
        <span class="attachments-icon">📎</span>
        <span class="attachments-count">{attachments.length} file{attachments.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="attachments-list">
        {#each attachments.slice(0, 3) as attachment}
          <div class="attachment-item" title={attachment.file_name}>
            <span class="file-icon">{getFileIcon(attachment.file_type)}</span>
            <span class="file-name">{attachment.file_name}</span>
            {#if attachment.file_size}
              <span class="file-size">{formatFileSize(attachment.file_size)}</span>
            {/if}
          </div>
        {/each}
        {#if attachments.length > 3}
          <div class="more-files">+{attachments.length - 3} more</div>
        {/if}
      </div>
    </div>
  {/if}

  <div class="test-footer">
    <div class="price-info">
      <span class="crypto-price">
        {test.price} {test.cryptocurrency}
        {#if test.price_max}
          - {test.price_max} {test.cryptocurrency}
        {/if}
      </span>
      {#if usdValue > 0}
        <span class="usd-price">
          ≈ ${usdValue}
          {#if usdValueMax > 0}
            - ${usdValueMax}
          {/if}
          USD
        </span>
      {/if}
    </div>
    <span class="date">Posted {formatDate(test.created_at)}</span>
  </div>
</article>

<style>
  .test-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    background: var(--color-surface);
    transition: all var(--transition-base);
  }

  .test-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-border-hover);
  }

  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  h3 a {
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  h3 a:hover {
    color: var(--color-primary);
  }

  .edit-icon {
    font-size: 1rem;
    opacity: 0.6;
    transition: opacity var(--transition-base), transform var(--transition-base);
  }

  .edit-icon:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  .status {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-open {
    background: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .status-in-progress {
    background: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .status-completed {
    background: var(--color-info-light);
    color: var(--color-info-dark);
  }

  .status-cancelled {
    background: var(--color-error-light);
    color: var(--color-error-dark);
  }

  .test-description {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .test-meta {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    font-size: 0.875rem;
  }

  .meta-item {
    color: var(--color-text-secondary);
  }

  .meta-item strong {
    color: var(--color-text);
  }

  .test-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
  }

  .price-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .crypto-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .usd-price {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .date {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }
  .attachments {
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .attachments-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .attachments-icon {
    font-size: 1rem;
  }

  .attachments-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .attachment-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    transition: background var(--transition-base);
  }

  .attachment-item:hover {
    background: var(--color-surface-hover);
  }

  .file-icon {
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  .file-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text);
  }

  .file-size {
    flex-shrink: 0;
    color: var(--color-text-tertiary);
    font-size: 0.75rem;
  }

  .more-files {
    padding: var(--spacing-xs) var(--spacing-sm);
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
    font-style: italic;
  }


  @media (max-width: 640px) {
    .test-card {
      padding: var(--spacing-md);
    }

    .test-header {
      flex-direction: column;
    }

    .test-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }

    .test-meta {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style>