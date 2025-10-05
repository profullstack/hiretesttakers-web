<script>
  import { createEventDispatcher } from 'svelte';
  
  export let resource = null;
  export let isEditing = false;
  
  const dispatch = createEventDispatcher();
  
  let formData = {
    title: resource?.title || '',
    description: resource?.description || '',
    type: resource?.type || 'blog_article',
    content: resource?.content || '',
    file_url: resource?.file_url || '',
    video_url: resource?.video_url || '',
    thumbnail_url: resource?.thumbnail_url || '',
    subject: resource?.subject || '',
    tags: resource?.tags?.join(', ') || '',
    status: resource?.status || 'draft'
  };
  
  let errors = {};
  let isSubmitting = false;
  
  const resourceTypes = [
    { value: 'sample_paper', label: 'Sample Paper' },
    { value: 'blog_article', label: 'Blog Article' },
    { value: 'study_guide', label: 'Study Guide' },
    { value: 'tutorial_video', label: 'Tutorial Video' },
    { value: 'code_example', label: 'Code Example' },
    { value: 'practice_test', label: 'Practice Test' }
  ];
  
  const subjects = [
    'Mathematics',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Business',
    'Programming'
  ];
  
  function validate() {
    errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.type) {
      errors.type = 'Resource type is required';
    }
    
    if (formData.type === 'tutorial_video' && !formData.video_url.trim()) {
      errors.video_url = 'Video URL is required for tutorial videos';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validate()) {
      return;
    }
    
    isSubmitting = true;
    
    try {
      const data = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      };
      
      dispatch('submit', data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="resource-form">
  <div class="form-group">
    <label for="title">Title *</label>
    <input
      id="title"
      type="text"
      bind:value={formData.title}
      placeholder="Enter resource title"
      class:error={errors.title}
    />
    {#if errors.title}
      <span class="error-message">{errors.title}</span>
    {/if}
  </div>
  
  <div class="form-group">
    <label for="type">Resource Type *</label>
    <select id="type" bind:value={formData.type} class:error={errors.type}>
      {#each resourceTypes as type}
        <option value={type.value}>{type.label}</option>
      {/each}
    </select>
    {#if errors.type}
      <span class="error-message">{errors.type}</span>
    {/if}
  </div>
  
  <div class="form-group">
    <label for="description">Description</label>
    <textarea
      id="description"
      bind:value={formData.description}
      placeholder="Brief description of the resource"
      rows="3"
    ></textarea>
  </div>
  
  {#if formData.type === 'blog_article' || formData.type === 'study_guide'}
    <div class="form-group">
      <label for="content">Content (Markdown supported)</label>
      <textarea
        id="content"
        bind:value={formData.content}
        placeholder="Enter content here..."
        rows="10"
      ></textarea>
    </div>
  {/if}
  
  {#if formData.type === 'sample_paper' || formData.type === 'study_guide'}
    <div class="form-group">
      <label for="file_url">File URL</label>
      <input
        id="file_url"
        type="url"
        bind:value={formData.file_url}
        placeholder="https://example.com/file.pdf"
      />
    </div>
  {/if}
  
  {#if formData.type === 'tutorial_video'}
    <div class="form-group">
      <label for="video_url">Video URL *</label>
      <input
        id="video_url"
        type="url"
        bind:value={formData.video_url}
        placeholder="https://youtube.com/watch?v=..."
        class:error={errors.video_url}
      />
      {#if errors.video_url}
        <span class="error-message">{errors.video_url}</span>
      {/if}
    </div>
  {/if}
  
  <div class="form-group">
    <label for="thumbnail_url">Thumbnail URL</label>
    <input
      id="thumbnail_url"
      type="url"
      bind:value={formData.thumbnail_url}
      placeholder="https://example.com/thumbnail.jpg"
    />
  </div>
  
  <div class="form-group">
    <label for="subject">Subject</label>
    <select id="subject" bind:value={formData.subject}>
      <option value="">Select a subject</option>
      {#each subjects as subject}
        <option value={subject}>{subject}</option>
      {/each}
    </select>
  </div>
  
  <div class="form-group">
    <label for="tags">Tags (comma-separated)</label>
    <input
      id="tags"
      type="text"
      bind:value={formData.tags}
      placeholder="algorithms, data-structures, tutorial"
    />
  </div>
  
  <div class="form-group">
    <label for="status">Status</label>
    <select id="status" bind:value={formData.status}>
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="archived">Archived</option>
    </select>
  </div>
  
  <div class="form-actions">
    <button type="button" on:click={handleCancel} class="btn-secondary">
      Cancel
    </button>
    <button type="submit" disabled={isSubmitting} class="btn-primary">
      {isSubmitting ? 'Saving...' : isEditing ? 'Update Resource' : 'Create Resource'}
    </button>
  </div>
</form>

<style>
  .resource-form {
    max-width: 800px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary, #333);
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
  }

  textarea {
    resize: vertical;
  }

  input.error,
  select.error {
    border-color: var(--error-color, #dc3545);
  }

  .error-message {
    display: block;
    margin-top: 0.25rem;
    color: var(--error-color, #dc3545);
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
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