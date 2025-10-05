<script>
  /**
   * Table Component
   * Responsive table with sorting support
   */
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let columns = []; // Array of {key, label, sortable}
  export let data = []; // Array of row objects
  export let sortKey = null;
  export let sortDirection = 'asc'; // asc or desc
  export let striped = false;
  export let hoverable = true;
  export let bordered = false;
  export let compact = false;
  
  function handleSort(column) {
    if (!column.sortable) return;
    
    if (sortKey === column.key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = column.key;
      sortDirection = 'asc';
    }
    
    dispatch('sort', { key: sortKey, direction: sortDirection });
  }
  
  $: tableClasses = [
    'table',
    striped && 'table-striped',
    hoverable && 'table-hoverable',
    bordered && 'table-bordered',
    compact && 'table-compact'
  ].filter(Boolean).join(' ');
</script>

<div class="table-container">
  <table class={tableClasses}>
    <thead>
      <tr>
        {#each columns as column}
          <th
            class:sortable={column.sortable}
            class:sorted={sortKey === column.key}
            on:click={() => handleSort(column)}
            role={column.sortable ? 'button' : null}
            tabindex={column.sortable ? 0 : null}
            on:keydown={(e) => {
              if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleSort(column);
              }
            }}
          >
            <div class="th-content">
              <span>{column.label}</span>
              {#if column.sortable}
                <span class="sort-icon" aria-hidden="true">
                  {#if sortKey === column.key}
                    {#if sortDirection === 'asc'}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14m7-7l-7-7-7 7"/>
                      </svg>
                    {:else}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 19V5m-7 7l7 7 7-7"/>
                      </svg>
                    {/if}
                  {:else}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M7 10l5-5 5 5M7 14l5 5 5-5"/>
                    </svg>
                  {/if}
                </span>
              {/if}
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if data.length === 0}
        <tr>
          <td colspan={columns.length} class="empty-state">
            <slot name="empty">No data available</slot>
          </td>
        </tr>
      {:else}
        {#each data as row, i}
          <tr>
            {#each columns as column}
              <td>
                <slot name="cell" {row} {column} index={i}>
                  {row[column.key] ?? '-'}
                </slot>
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  
  thead {
    background-color: var(--color-bg-secondary);
    border-bottom: 2px solid var(--color-border);
  }
  
  th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
  }
  
  th.sortable {
    cursor: pointer;
    user-select: none;
  }
  
  th.sortable:hover {
    background-color: var(--color-surface-hover);
  }
  
  th.sortable:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
  
  .th-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .sort-icon {
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
  }
  
  .sorted .sort-icon {
    color: var(--color-primary);
  }
  
  .sort-icon svg {
    width: 1rem;
    height: 1rem;
  }
  
  td {
    padding: var(--spacing-md);
    border-top: 1px solid var(--color-border);
    color: var(--color-text);
  }
  
  tbody tr:first-child td {
    border-top: none;
  }
  
  .table-striped tbody tr:nth-child(even) {
    background-color: var(--color-bg-secondary);
  }
  
  .table-hoverable tbody tr:hover {
    background-color: var(--color-surface-hover);
  }
  
  .table-bordered th,
  .table-bordered td {
    border: 1px solid var(--color-border);
  }
  
  .table-compact th,
  .table-compact td {
    padding: var(--spacing-sm);
  }
  
  .empty-state {
    text-align: center;
    padding: var(--spacing-xl) !important;
    color: var(--color-text-secondary);
  }
  
  /* Dark mode adjustments */
  :global(.dark) thead {
    background-color: var(--color-bg-tertiary);
  }
  
  :global(.dark) .table-striped tbody tr:nth-child(even) {
    background-color: var(--color-bg-tertiary);
  }
  
  /* Mobile responsive */
  @media (max-width: 640px) {
    th, td {
      padding: var(--spacing-sm);
      font-size: 0.8125rem;
    }
    
    .table-compact th,
    .table-compact td {
      padding: var(--spacing-xs);
    }
  }
</style>