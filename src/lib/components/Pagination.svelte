<script>
  /**
   * Pagination Component
   * Handles page navigation with accessibility
   */
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let currentPage = 1;
  export let totalPages = 1;
  export let maxVisible = 7; // Maximum number of page buttons to show
  export let showFirstLast = true;
  export let showPrevNext = true;
  
  // Calculate visible page numbers
  $: visiblePages = calculateVisiblePages(currentPage, totalPages, maxVisible);
  
  function calculateVisiblePages(current, total, max) {
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + max - 1);
    
    if (end - start < max - 1) {
      start = Math.max(1, end - max + 1);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  function goToPage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    dispatch('change', { page });
  }
  
  function goToPrevious() {
    goToPage(currentPage - 1);
  }
  
  function goToNext() {
    goToPage(currentPage + 1);
  }
  
  function goToFirst() {
    goToPage(1);
  }
  
  function goToLast() {
    goToPage(totalPages);
  }
</script>

<nav class="pagination" role="navigation" aria-label="Pagination">
  <ul class="pagination-list">
    {#if showFirstLast}
      <li>
        <button
          type="button"
          class="pagination-button"
          disabled={currentPage === 1}
          on:click={goToFirst}
          aria-label="Go to first page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>
      </li>
    {/if}
    
    {#if showPrevNext}
      <li>
        <button
          type="button"
          class="pagination-button"
          disabled={currentPage === 1}
          on:click={goToPrevious}
          aria-label="Go to previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </li>
    {/if}
    
    {#if visiblePages[0] > 1}
      <li>
        <span class="pagination-ellipsis">...</span>
      </li>
    {/if}
    
    {#each visiblePages as page}
      <li>
        <button
          type="button"
          class="pagination-button"
          class:pagination-active={page === currentPage}
          on:click={() => goToPage(page)}
          aria-label="Go to page {page}"
          aria-current={page === currentPage ? 'page' : null}
        >
          {page}
        </button>
      </li>
    {/each}
    
    {#if visiblePages[visiblePages.length - 1] < totalPages}
      <li>
        <span class="pagination-ellipsis">...</span>
      </li>
    {/if}
    
    {#if showPrevNext}
      <li>
        <button
          type="button"
          class="pagination-button"
          disabled={currentPage === totalPages}
          on:click={goToNext}
          aria-label="Go to next page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </li>
    {/if}
    
    {#if showFirstLast}
      <li>
        <button
          type="button"
          class="pagination-button"
          disabled={currentPage === totalPages}
          on:click={goToLast}
          aria-label="Go to last page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
          </svg>
        </button>
      </li>
    {/if}
  </ul>
</nav>

<style>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .pagination-list {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    font-family: inherit;
  }
  
  .pagination-button:hover:not(:disabled):not(.pagination-active) {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
  }
  
  .pagination-button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
    cursor: default;
  }
  
  .pagination-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .pagination-ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 2.5rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }
  
  /* Dark mode adjustments */
  :global(.dark) .pagination-button {
    background-color: var(--color-surface);
  }
  
  :global(.dark) .pagination-button:hover:not(:disabled):not(.pagination-active) {
    background-color: var(--color-surface-hover);
  }
  
  /* Mobile responsive */
  @media (max-width: 640px) {
    .pagination-button {
      min-width: 2rem;
      height: 2rem;
      padding: var(--spacing-xs);
    }
    
    .pagination-ellipsis {
      min-width: 2rem;
      height: 2rem;
    }
  }
</style>