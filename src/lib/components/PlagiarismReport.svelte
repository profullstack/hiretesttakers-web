<script>
  export let report;
  export let onArchive = null;
  export let onUnarchive = null;
  export let onDelete = null;

  $: similarityLevel = getSimilarityLevel(report?.similarity_score);
  $: details = report?.details || {};
  $: matches = details.matches || [];

  function getSimilarityLevel(score) {
    if (score <= 15) return { label: 'Excellent', color: 'green' };
    if (score <= 30) return { label: 'Good', color: 'blue' };
    if (score <= 50) return { label: 'Moderate', color: 'orange' };
    return { label: 'High', color: 'red' };
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }

  async function handleArchive() {
    if (onArchive) await onArchive(report.id);
  }

  async function handleUnarchive() {
    if (onUnarchive) await onUnarchive(report.id);
  }

  async function handleDelete() {
    if (onDelete && confirm('Are you sure you want to delete this report?')) {
      await onDelete(report.id);
    }
  }
</script>

<div class="plagiarism-report" class:archived={report?.archived}>
  <div class="report-header">
    <div class="score-section">
      <div class="score-circle" style="border-color: var(--color-{similarityLevel.color})">
        <span class="score-value">{report?.similarity_score || 0}%</span>
        <span class="score-label">Similarity</span>
      </div>
      <div class="score-info">
        <h3 class="similarity-level" style="color: var(--color-{similarityLevel.color})">
          {similarityLevel.label}
        </h3>
        <p class="sources-found">{report?.sources_found || 0} potential sources found</p>
      </div>
    </div>

    <div class="report-actions">
      {#if report?.archived}
        {#if onUnarchive}
          <button class="btn-secondary" on:click={handleUnarchive}>
            Unarchive
          </button>
        {/if}
      {:else if onArchive}
        <button class="btn-secondary" on:click={handleArchive}>
          Archive
        </button>
      {/if}
      {#if onDelete}
        <button class="btn-danger" on:click={handleDelete}>
          Delete
        </button>
      {/if}
    </div>
  </div>

  <div class="report-meta">
    <span>Checked: {formatDate(report?.checked_at || report?.created_at)}</span>
    <span>Word Count: {details.word_count || 0}</span>
    {#if report?.archived}
      <span class="archived-badge">Archived</span>
    {/if}
  </div>

  {#if details.analysis}
    <div class="analysis-section">
      <h4>Analysis</h4>
      <p>{details.analysis}</p>
    </div>
  {/if}

  {#if matches.length > 0}
    <div class="matches-section">
      <h4>Potential Matches ({matches.length})</h4>
      <div class="matches-list">
        {#each matches as match}
          <div class="match-item">
            <div class="match-header">
              <span class="match-similarity">{match.similarity}% similar</span>
              <span class="match-source">{match.source}</span>
            </div>
            <p class="match-text">"{match.text}"</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if details.recommendations}
    <div class="recommendations-section">
      <h4>Recommendations</h4>
      <p>{details.recommendations}</p>
    </div>
  {/if}
</div>

<style>
  .plagiarism-report {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .plagiarism-report.archived {
    opacity: 0.7;
    border-color: var(--color-gray);
  }

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .score-section {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .score-circle {
    width: 100px;
    height: 100px;
    border: 4px solid;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .score-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-primary);
  }

  .score-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .score-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .sources-found {
    margin: 0;
    color: var(--text-secondary);
  }

  .report-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .report-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: var(--bg-primary);
    border-radius: 4px;
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .archived-badge {
    background: var(--color-gray);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .analysis-section,
  .matches-section,
  .recommendations-section {
    margin-top: 1.5rem;
  }

  .analysis-section h4,
  .matches-section h4,
  .recommendations-section h4 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1rem;
  }

  .analysis-section p,
  .recommendations-section p {
    margin: 0;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  .matches-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .match-item {
    background: var(--bg-primary);
    border-left: 3px solid var(--color-orange);
    padding: 1rem;
    border-radius: 4px;
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 1rem;
  }

  .match-similarity {
    font-weight: 600;
    color: var(--color-orange);
  }

  .match-source {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .match-text {
    margin: 0;
    font-style: italic;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .btn-secondary,
  .btn-danger {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-secondary {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover {
    background: var(--bg-secondary);
  }

  .btn-danger {
    background: var(--color-red);
    color: white;
  }

  .btn-danger:hover {
    background: #c53030;
  }

  @media (max-width: 768px) {
    .report-header {
      flex-direction: column;
    }

    .score-section {
      width: 100%;
    }

    .report-actions {
      width: 100%;
    }

    .match-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>