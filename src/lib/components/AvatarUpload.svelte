<script>
  /**
   * Avatar Upload Component
   * 
   * Handles avatar image upload with preview
   */
  
  let { avatarUrl = $bindable(), onUpload = () => {}, onDelete = () => {} } = $props();
  
  let uploading = $state(false);
  let error = $state('');
  let fileInput = $state(null);
  let previewUrl = $state(avatarUrl);
  
  $effect(() => {
    previewUrl = avatarUrl;
  });
  
  async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error = 'Please select an image file';
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error = 'Image must be less than 5MB';
      return;
    }
    
    error = '';
    uploading = true;
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      avatarUrl = data.profile.avatar_url;
      previewUrl = avatarUrl;
      onUpload(data.profile);
    } catch (err) {
      error = err.message;
    } finally {
      uploading = false;
    }
  }
  
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete your avatar?')) {
      return;
    }
    
    uploading = true;
    error = '';
    
    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Delete failed');
      }
      
      avatarUrl = null;
      previewUrl = null;
      onDelete();
    } catch (err) {
      error = err.message;
    } finally {
      uploading = false;
    }
  }
  
  function triggerFileInput() {
    fileInput?.click();
  }
</script>

<div class="avatar-upload">
  <div class="avatar-preview">
    {#if previewUrl}
      <img src={previewUrl} alt="Avatar" />
    {:else}
      <div class="avatar-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    {/if}
  </div>
  
  <div class="avatar-actions">
    <input
      type="file"
      accept="image/*"
      bind:this={fileInput}
      onchange={handleFileSelect}
      style="display: none;"
    />
    
    <button
      type="button"
      onclick={triggerFileInput}
      disabled={uploading}
      class="btn-primary"
    >
      {uploading ? 'Uploading...' : previewUrl ? 'Change Avatar' : 'Upload Avatar'}
    </button>
    
    {#if previewUrl}
      <button
        type="button"
        onclick={handleDelete}
        disabled={uploading}
        class="btn-secondary"
      >
        Delete
      </button>
    {/if}
  </div>
  
  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .avatar-preview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e5e7eb;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    color: #9ca3af;
  }
  
  .avatar-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }
  
  .btn-secondary {
    background: #ef4444;
    color: white;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: #dc2626;
  }
  
  .btn-primary:disabled,
  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error {
    color: #ef4444;
    font-size: 0.875rem;
    margin: 0;
  }
</style>