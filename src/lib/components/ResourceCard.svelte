<script>
  export let resource;
  
  const typeLabels = {
    sample_paper: 'Sample Paper',
    blog_article: 'Blog Article',
    study_guide: 'Study Guide',
    tutorial_video: 'Tutorial Video',
    code_example: 'Code Example',
    practice_test: 'Practice Test'
  };

  const averageRating = resource.rating_count > 0
    ? (resource.rating_sum / resource.rating_count).toFixed(1)
    : 'N/A';
</script>

<div class="resource-card">
  {#if resource.thumbnail_url}
    <img src={resource.thumbnail_url} alt={resource.title} class="thumbnail" />
  {/if}
  
  <div class="content">
    <div class="header">
      <h3>{resource.title}</h3>
      <span class="type-badge">{typeLabels[resource.type] || resource.type}</span>
    </div>
    
    {#if resource.description}
      <p class="description">{resource.description}</p>
    {/if}
    
    <div class="meta">
      {#if resource.subject}
        <span class="subject">{resource.subject}</span>
      {/if}
      
      <div class="stats">
        <span class="rating">
          ⭐ {averageRating}
          {#if resource.rating_count > 0}
            ({resource.rating_count})
          {/if}
        </span>
        <span class="views">👁️ {resource.view_count}</span>
        <span class="downloads">⬇️ {resource.download_count}</span>
      </div>
    </div>
    
    {#if resource.tags && resource.tags.length > 0}
      <div class="tags">
        {#each resource.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    
    <div class="actions">
      <a href="/resources/{resource.id}" class="btn-primary">View Resource</a>
    </div>
  </div>
</div>

<style>
  .resource-card {
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 8px;
    overflow: hidden;
    background: var(--card-bg, white);
    transition: box-shadow 0.2s;
  }

  .resource-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .thumbnail {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    padding: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-primary, #333);
  }

  .type-badge {
    padding: 0.25rem 0.5rem;
    background: var(--primary-color, #007bff);
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .description {
    color: var(--text-secondary, #666);
    margin: 0.5rem 0;
    line-height: 1.5;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .subject {
    padding: 0.25rem 0.75rem;
    background: var(--bg-secondary, #f5f5f5);
    border-radius: 4px;
    font-size: 0.875rem;
    color: var(--text-primary, #333);
  }

  .stats {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .tag {
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary, #e8f4f8);
    color: var(--primary-color, #007bff);
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .actions {
    margin-top: 1rem;
  }

  .btn-primary {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--primary-color, #007bff);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: var(--primary-hover, #0056b3);
  }
</style>