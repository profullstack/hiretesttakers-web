<script>
  import { createEventDispatcher } from 'svelte';
  import { validateFile, formatFileSize, getFileExtension } from '$lib/services/fileUpload.js';

  export let files = [];
  export let maxFiles = 5;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let dragActive = false;
  let error = '';
  let fileInput;

  const fileIcons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    txt: '📃',
    csv: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    webp: '🖼️'
  };

  function getFileIcon(fileName) {
    const ext = getFileExtension(fileName).toLowerCase();
    return fileIcons[ext] || '📎';
  }

  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);
    addFiles(selectedFiles);
  }

  function addFiles(newFiles) {
    error = '';

    if (files.length + newFiles.length > maxFiles) {
      error = `Maximum ${maxFiles} files allowed`;
      return;
    }

    const validFiles = [];
    for (const file of newFiles) {
      const validation = validateFile(file);
      if (!validation.isValid) {
        error = validation.error;
        return;
      }
      validFiles.push(file);
    }

    files = [...files, ...validFiles];
    dispatch('change', files);
  }

  function removeFile(index) {
    files = files.filter((_, i) => i !== index);
    dispatch('change', files);
    error = '';
  }

  function handleDragEnter(event) {
    event.preventDefault();
    dragActive = true;
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragActive = false;
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    dragActive = false;

    if (disabled) return;

    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  }

  function triggerFileInput() {
    if (!disabled) {
      fileInput.click();
    }
  }
</script>

<div class="file-upload">
  <div
    class="drop-zone"
    class:drag-active={dragActive}
    class:disabled
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
    on:click={triggerFileInput}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
  >
    <input
      type="file"
      bind:this={fileInput}
      on:change={handleFileSelect}
      multiple
      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
      {disabled}
      style="display: none;"
    />

    <div class="drop-zone-content">
      <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p class="drop-zone-text">
        <span class="highlight">Click to upload</span> or drag and drop
      </p>
      <p class="drop-zone-hint">
        PDF, DOCX, XLS, TXT, CSV, or images (max 10MB each)
      </p>
      <p class="drop-zone-limit">
        Maximum {maxFiles} files
      </p>
    </div>
  </div>

  {#if error}
    <div class="error-message">
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  {#if files.length > 0}
    <div class="file-list">
      <h4 class="file-list-title">Selected Files ({files.length}/{maxFiles})</h4>
      {#each files as file, index}
        <div class="file-item">
          <div class="file-info">
            <span class="file-icon">{getFileIcon(file.name)}</span>
            <div class="file-details">
              <span class="file-name">{file.name}</span>
              <span class="file-size">{formatFileSize(file.size)}</span>
            </div>
          </div>
          <button
            type="button"
            class="remove-btn"
            on:click={() => removeFile(index)}
            disabled={disabled}
            aria-label="Remove file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .file-upload {
    width: 100%;
  }

  .drop-zone {
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-2xl);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-base);
    background: var(--color-surface);
  }

  .drop-zone:hover:not(.disabled) {
    border-color: var(--color-primary);
    background: var(--color-bg);
  }

  .drop-zone.drag-active {
    border-color: var(--color-primary);
    background: rgba(91, 127, 232, 0.05);
    transform: scale(1.02);
  }

  .drop-zone.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .drop-zone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .upload-icon {
    width: 48px;
    height: 48px;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .drop-zone-text {
    font-size: 1rem;
    color: var(--color-text);
    margin: 0;
  }

  .highlight {
    color: var(--color-primary);
    font-weight: 600;
  }

  .drop-zone-hint {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .drop-zone-limit {
    font-size: 0.8125rem;
    color: var(--color-text-tertiary);
    margin: 0;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    margin-top: var(--spacing-md);
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-lg);
    color: var(--color-error-dark);
    font-size: 0.875rem;
  }

  .error-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .file-list {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .file-list-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 var(--spacing-md);
  }

  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-sm);
    transition: all var(--transition-base);
  }

  .file-item:last-child {
    margin-bottom: 0;
  }

  .file-item:hover {
    background: var(--color-gray-100);
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex: 1;
    min-width: 0;
  }

  .file-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .file-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .file-name {
    font-size: 0.9375rem;
    color: var(--color-text);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 0.8125rem;
    color: var(--color-text-secondary);
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    flex-shrink: 0;
  }

  .remove-btn:hover:not(:disabled) {
    background: var(--color-error-light);
    color: var(--color-error);
  }

  .remove-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .remove-btn svg {
    width: 18px;
    height: 18px;
  }

  /* Dark mode enhancements */
  :global(.dark) .drop-zone {
    background: var(--color-gray-800);
  }

  :global(.dark) .drop-zone:hover:not(.disabled) {
    background: var(--color-gray-700);
  }

  :global(.dark) .drop-zone.drag-active {
    background: rgba(0, 240, 255, 0.1);
    border-color: var(--color-primary);
  }

  :global(.dark) .file-list {
    background: var(--color-gray-800);
  }

  :global(.dark) .file-item {
    background: var(--color-gray-700);
  }

  :global(.dark) .file-item:hover {
    background: var(--color-gray-600);
  }

  @media (max-width: 640px) {
    .drop-zone {
      padding: var(--spacing-xl);
    }

    .upload-icon {
      width: 40px;
      height: 40px;
    }

    .drop-zone-text {
      font-size: 0.9375rem;
    }

    .file-name {
      font-size: 0.875rem;
    }
  }
</style>