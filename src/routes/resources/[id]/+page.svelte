<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let resource = null;
  let loading = true;
  let error = null;
  let userRating = null;
  let newRating = 0;
  let newReview = '';
  let submittingRating = false;
  
  $: resourceId = $page.params.id;
  
  onMount(async () => {
    await loadResource();
    await loadUserRating();
  });
  
  async function loadResource() {
    try {
      loading = true;
      const response = await fetch(`/api/resources/${resourceId}?trackView=true`);
      
      if (!response.ok) {
        throw new Error('Resource not found');
      }
      
      resource = await response.json();
    } catch (err) {
      error = err.message;
      console.error('Error loading resource:', err);
    } finally {
      loading = false;
    }
  }
  
  async function loadUserRating() {
    try {
      const response = await fetch(`/api/resources/${resourceId}/rate`);
      
      if (response.ok) {
        userRating = await response.json();
        newRating = userRating.rating;
        newReview = userRating.review || '';
      }
    } catch (err) {
      // User hasn't rated yet or not logged in
      console.log('No existing rating');
    }
  }
  
  async function handleRating() {
    if (newRating < 1 || newRating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    
    try {
      submittingRating = true;
      const response = await fetch(`/api/resources/${resourceId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          review: newReview
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      
      await loadResource();
      await loadUserRating();
      alert('Rating submitted successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      submittingRating = false;
    }
  }
  
  async function handleDownload() {
    try {
      await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST'
      });
    } catch (err) {
      console.error('Error tracking download:', err);
    }
  }
  
  const typeLabels = {
    sample_paper: 'Sample Paper',
    blog_article: 'Blog Article',
    study_guide: 'Study Guide',
    tutorial_video: 'Tutorial Video',
    code_example: 'Code Example',
    practice_test: 'Practice Test'
  };
  
  $: averageRating = resource && resource.rating_count > 0
    ? (resource.rating_sum / resource.rating_count).toFixed(1)
    : 'N/A';
</script>

<svelte:head>
  <title>{resource?.title || 'Resource'} - HireTestTakers</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">
      <p>Loading resource...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Error: {error}</p>
      <a href="/resources" class="btn-secondary">Back to Resources</a>
    </div>
  {:else if resource}
    <div class="resource-detail">
      <header class="resource-header">
        <div class="breadcrumb">
          <a href="/resources">Resources</a> / {resource.title}
        </div>
        
        <h1>{resource.title}</h1>
        
        <div class="meta">
          <span class="type-badge">{typeLabels[resource.type]}</span>
          {#if resource.subject}
            <span class="subject">{resource.subject}</span>
          {/if}
        </div>
        
        <div class="stats">
          <span>⭐ {averageRating} ({resource.rating_count} ratings)</span>
          <span>👁️ {resource.view_count} views</span>
          <span>⬇️ {resource.download_count} downloads</span>
        </div>
      </header>
      
      {#if resource.thumbnail_url}
        <img src={resource.thumbnail_url} alt={resource.title} class="thumbnail" />
      {/if}
      
      {#if resource.description}
        <div class="description">
          <p>{resource.description}</p>
        </div>
      {/if}
      
      {#if resource.content}
        <div class="content">
          {@html resource.content}
        </div>
      {/if}
      
      {#if resource.video_url}
        <div class="video">
          <h2>Video Tutorial</h2>
          <iframe
            src={resource.video_url}
            title={resource.title}
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      {/if}
      
      {#if resource.file_url}
        <div class="download-section">
          <a
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            on:click={handleDownload}
            class="btn-primary"
          >
            Download Resource
          </a>
        </div>
      {/if}
      
      {#if resource.tags && resource.tags.length > 0}
        <div class="tags">
          <h3>Tags</h3>
          <div class="tag-list">
            {#each resource.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </div>
      {/if}
      
      <div class="rating-section">
        <h2>Rate this Resource</h2>
        
        <div class="rating-form">
          <div class="stars">
            {#each [1, 2, 3, 4, 5] as star}
              <button
                class="star"
                class:active={newRating >= star}
                on:click={() => newRating = star}
              >
                ★
              </button>
            {/each}
          </div>
          
          <textarea
            bind:value={newReview}
            placeholder="Write a review (optional)"
            rows="4"
          ></textarea>
          
          <button
            on:click={handleRating}
            disabled={submittingRating || newRating === 0}
            class="btn-primary"
          >
            {submittingRating ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 3rem;
  }

  .breadcrumb {
    margin-bottom: 1rem;
    color: var(--text-secondary, #666);
  }

  .breadcrumb a {
    color: var(--primary-color, #007bff);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .resource-header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary, #333);
  }

  .meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .type-badge {
    padding: 0.25rem 0.75rem;
    background: var(--primary-color, #007bff);
    color: white;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .subject {
    padding: 0.25rem 0.75rem;
    background: var(--bg-secondary, #f5f5f5);
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    color: var(--text-secondary, #666);
  }

  .thumbnail {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .description {
    margin-bottom: 2rem;
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--text-secondary, #666);
  }

  .content {
    margin-bottom: 2rem;
    line-height: 1.8;
  }

  .video {
    margin-bottom: 2rem;
  }

  .video h2 {
    margin-bottom: 1rem;
  }

  .video iframe {
    width: 100%;
    height: 500px;
    border-radius: 8px;
  }

  .download-section {
    margin: 2rem 0;
    text-align: center;
  }

  .tags {
    margin: 2rem 0;
  }

  .tags h3 {
    margin-bottom: 1rem;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary, #e8f4f8);
    color: var(--primary-color, #007bff);
    border-radius: 4px;
  }

  .rating-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color, #e0e0e0);
  }

  .rating-section h2 {
    margin-bottom: 1.5rem;
  }

  .rating-form {
    max-width: 500px;
  }

  .stars {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .star {
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--border-color, #e0e0e0);
    transition: color 0.2s;
  }

  .star.active {
    color: #ffc107;
  }

  .star:hover {
    color: #ffc107;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    font-family: inherit;
    margin-bottom: 1rem;
    resize: vertical;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
  }

  .btn-primary {
    background: var(--primary-color, #007bff);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-hover, #0056b3);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: var(--bg-secondary, #f5f5f5);
    color: var(--text-primary, #333);
    border: 1px solid var(--border-color, #e0e0e0);
  }

  .btn-secondary:hover {
    background: var(--bg-tertiary, #e8e8e8);
  }
</style>