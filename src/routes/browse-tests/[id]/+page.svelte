<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let test = null;
  let loading = true;
  let error = '';
  let usdValue = 0;
  let usdValueMax = 0;
  let isOwner = false;
  let session = null;
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
    } catch (err) {
      console.error('Failed to load attachments:', err);
    } finally {
      loadingAttachments = false;
    }
  }

  async function loadTest() {
    loading = true;
    error = '';

    try {
      // Get session first
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();
      session = sessionData.session;

      const response = await fetch(`/api/tests/${$page.params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load test');
      }

      test = data.test;
      
      // Check if current user is owner
      isOwner = session?.user?.id === test.hirer_id;
      
      // Calculate USD values using API
      try {
        const rateResponse = await fetch(`/api/exchange-rate/${test.cryptocurrency}`);
        const rateData = await rateResponse.json();
        
        if (rateResponse.ok && rateData.success) {
          const rate = rateData.rate;
          usdValue = (test.price * rate).toFixed(2);
          if (test.price_max) {
            usdValueMax = (test.price_max * rate).toFixed(2);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err);
      }

      // Load attachments after test is loaded
      await loadAttachments();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this test?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tests/${test.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete test');
      }

      goto('/browse-tests/my-tests');
    } catch (err) {
      alert(err.message);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  async function downloadAttachment(attachment) {
    try {
      const downloadUrl = `/api/tests/${test.id}/attachments/${attachment.id}/download`;
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Failed to download attachment:', err);
      alert('Failed to download file');
    }
  }

  onMount(() => {
    loadTest();
  });
</script>

<svelte:head>
  <title>{test ? test.title : 'Test Details'} - HireTestTakers</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading test details...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if test}
    <article class="test-details">
      {#if isOwner}
        <nav class="tab-nav">
          <a href="/browse-tests/{test.id}" class="tab-link active">View</a>
          <a href="/browse-tests/{test.id}/edit" class="tab-link">Edit</a>
          <a href="/browse-tests/{test.id}/applicants" class="tab-link">Applicants</a>
          <button on:click={handleDelete} class="tab-delete">Delete Test</button>
        </nav>
      {/if}

      <header class="test-header">
        <div class="header-content">
          <h1>{test.title}</h1>
          <span class="status {getStatusClass(test.status)}">
            {getStatusLabel(test.status)}
          </span>
        </div>
      </header>

      <div class="test-meta">
        <div class="meta-item">
          <strong>Posted:</strong> {formatDate(test.created_at)}
        </div>
        {#if test.category}
          <div class="meta-item">
            <strong>Category:</strong> {test.category}
          </div>
        {/if}
        {#if test.difficulty}
          <div class="meta-item">
            <strong>Difficulty:</strong> {test.difficulty}
          </div>
        {/if}
      </div>

      <section class="description">
        <h2>Description</h2>
        <p>{test.description}</p>
      </section>

      <section class="price-section">
        <h2>Payment</h2>
        <div class="price-info">
          <div class="crypto-price">
            {test.price} {test.cryptocurrency}
            {#if test.price_max}
              - {test.price_max} {test.cryptocurrency}
            {/if}
          </div>
          {#if usdValue > 0}
            <div class="usd-price">
              ≈ ${usdValue}
              {#if usdValueMax > 0}
                - ${usdValueMax}
              {/if}
              USD
            </div>
          {/if}
        </div>
      </section>
      {#if attachments.length > 0}
        <section class="attachments-section">
          <h2>Attached Files</h2>
          <div class="attachments-grid">
            {#each attachments as attachment}
              <button
                class="attachment-card"
                on:click={() => downloadAttachment(attachment)}
                title="Click to download {attachment.file_name}"
              >
                <div class="attachment-icon">
                  {getFileIcon(attachment.file_type)}
                </div>
                <div class="attachment-info">
                  <div class="attachment-name">{attachment.file_name}</div>
                  {#if attachment.file_size}
                    <div class="attachment-size">{formatFileSize(attachment.file_size)}</div>
                  {/if}
                </div>
                <div class="download-icon">⬇️</div>
              </button>
            {/each}
          </div>
        </section>
      {/if}

      {#if test.status === 'open'}
        <div class="apply-section">
          <a href="/browse-tests/{test.id}/apply" class="btn-primary">Apply for this Test</a>
        </div>
      {/if}
    </article>
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .loading,
  .error {
    text-align: center;
    padding: 3rem 1rem;
    font-size: 1.125rem;
  }

  .loading {
    color: var(--color-text-secondary);
  }

  .error {
    color: var(--color-error-dark);
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
  }

  .test-details {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-sm);
  }

  .tab-nav {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-sm);
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .tab-link {
    flex: 1;
    padding: var(--spacing-md) var(--spacing-lg);
    text-align: center;
    text-decoration: none;
    color: var(--color-text-secondary);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
  }

  .tab-link:hover {
    color: var(--color-text);
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }

  .tab-link.active {
    color: white;
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  :global(.dark) .tab-link.active {
    box-shadow: var(--glow-primary);
  }

  .tab-delete {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-error);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .tab-delete:hover {
    background: var(--color-error-dark);
  }

  :global(.dark) .tab-delete {
    box-shadow: var(--glow-error);
  }

  :global(.dark) .tab-delete:hover {
    box-shadow: 0 0 15px rgba(255, 0, 85, 0.6), 0 0 30px rgba(255, 0, 85, 0.4);
  }

  .test-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .status {
    padding: 0.5rem 1rem;
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

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .test-meta {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .meta-item strong {
    color: var(--color-text);
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .description p {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-secondary);
    white-space: pre-wrap;
  }

  .price-info {
    background: var(--color-bg);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .crypto-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .usd-price {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .attachments-section {
    margin-bottom: 2rem;
  }

  .attachments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-md);
  }

  .attachment-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    text-align: left;
    width: 100%;
  }

  .attachment-card:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  :global(.dark) .attachment-card:hover {
    box-shadow: var(--glow-primary);
  }

  .attachment-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .attachment-info {
    flex: 1;
    min-width: 0;
  }

  .attachment-name {
    font-weight: 500;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: var(--spacing-xs);
  }

  .attachment-size {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .download-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    opacity: 0.6;
    transition: opacity var(--transition-base);
  }

  .attachment-card:hover .download-icon {
    opacity: 1;
  }

  .apply-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid var(--color-border);
    text-align: center;
  }

  .btn-primary,
  .btn-secondary,
  .btn-danger {
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
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .btn-danger {
    background: var(--color-error);
    color: white;
  }

  .btn-danger:hover {
    background: var(--color-error-dark);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-danger {
    box-shadow: var(--glow-error);
  }

  :global(.dark) .btn-danger:hover {
    box-shadow: 0 0 15px rgba(255, 0, 85, 0.6), 0 0 30px rgba(255, 0, 85, 0.4);
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .test-details {
      padding: 1.5rem;
    }

    .header-content {
      flex-direction: column;
    }

    .test-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .actions {
      flex-direction: column;
    }

    .btn-primary,
    .btn-secondary,
    .btn-danger {
      width: 100%;
    }

    .attachments-grid {
      grid-template-columns: 1fr;
    }
  }
</style>