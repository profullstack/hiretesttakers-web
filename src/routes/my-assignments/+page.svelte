<script>
  import { onMount } from 'svelte';
  import AssignmentCard from '$lib/components/AssignmentCard.svelte';

  let assignments = [];
  let loading = true;
  let error = '';
  let statusFilter = '';

  onMount(async () => {
    await loadAssignments();
  });

  async function loadAssignments() {
    loading = true;
    error = '';

    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/assignments?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load assignments');
      }

      assignments = data.requests;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleFilterChange() {
    loadAssignments();
  }
</script>

<svelte:head>
  <title>Assignments - HireTestTakers</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Assignment Writing Requests</h1>
    <a href="/assignments/new" class="btn-primary">
      Request New Assignment
    </a>
  </div>

  <div class="filters">
    <label for="status">Filter by Status:</label>
    <select id="status" bind:value={statusFilter} on:change={handleFilterChange}>
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="assigned">Assigned</option>
      <option value="in_progress">In Progress</option>
      <option value="submitted">Submitted</option>
      <option value="revision_requested">Revision Requested</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  {#if loading}
    <div class="loading">Loading assignments...</div>
  {:else if error}
    <div class="error-message">{error}</div>
  {:else if assignments.length === 0}
    <div class="empty-state">
      <p>No assignments found.</p>
      <a href="/assignments/new" class="btn-primary">Create Your First Assignment Request</a>
    </div>
  {:else}
    <div class="assignments-grid">
      {#each assignments as assignment (assignment.id)}
        <AssignmentCard {assignment} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .filters {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .filters label {
    font-weight: 500;
  }

  .filters select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .error-message {
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    color: #666;
    font-size: 1.125rem;
  }

  .assignments-grid {
    display: grid;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .btn-primary {
      width: 100%;
      text-align: center;
    }

    .filters {
      flex-direction: column;
      align-items: flex-start;
    }

    .filters select {
      width: 100%;
    }
  }
</style>