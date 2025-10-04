<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ApplicationForm from '$lib/components/ApplicationForm.svelte';

  let test = null;
  let loading = true;
  let error = '';

  async function loadTest() {
    loading = true;
    error = '';

    try {
      const response = await fetch(`/api/tests/${$page.params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load test');
      }

      test = data.test;

      if (test.status !== 'open') {
        error = 'This test is no longer accepting applications';
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSubmit({ test_id, application_message }) {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          test_id,
          application_message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      // Redirect to applications page on success
      setTimeout(() => {
        goto('/applications');
      }, 2000);

      return { success: true, message: 'Application submitted successfully!' };
    } catch (err) {
      return { error: err.message };
    }
  }

  function handleCancel() {
    goto(`/tests/${$page.params.id}`);
  }

  onMount(() => {
    loadTest();
  });
</script>

<svelte:head>
  <title>Apply to Test - HireTestTakers</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading test details...</div>
  {:else if error}
    <div class="error-box">
      <p>{error}</p>
      <a href="/tests/{$page.params.id}" class="btn-secondary">Back to Test</a>
    </div>
  {:else if test}
    <div class="apply-page">
      <header class="page-header">
        <h1>Apply to Test</h1>
        <a href="/tests/{$page.params.id}" class="back-link">← Back to Test</a>
      </header>

      <div class="test-summary">
        <h2>{test.title}</h2>
        <div class="test-meta">
          <span class="meta-item">
            <strong>Payment:</strong> {test.price_fixed || `${test.price_min} - ${test.price_max}`} {test.cryptocurrency}
          </span>
          {#if test.deadline}
            <span class="meta-item">
              <strong>Deadline:</strong> {new Date(test.deadline).toLocaleDateString()}
            </span>
          {/if}
        </div>
        <p class="test-description">{test.description}</p>
      </div>

      <div class="form-section">
        <h3>Submit Your Application</h3>
        <ApplicationForm
          testId={test.id}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    font-size: 1.125rem;
    color: #6b7280;
  }

  .error-box {
    text-align: center;
    padding: 2rem;
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #991b1b;
  }

  .error-box p {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
  }

  .apply-page {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 2rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
  }

  .back-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #2563eb;
  }

  .test-summary {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .test-summary h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  .test-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .meta-item strong {
    color: #374151;
  }

  .test-description {
    margin: 0;
    line-height: 1.6;
    color: #4b5563;
    white-space: pre-wrap;
  }

  .form-section {
    margin-top: 2rem;
  }

  .form-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  .btn-secondary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #6b7280;
    color: white;
    text-decoration: none;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn-secondary:hover {
    background-color: #4b5563;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .apply-page {
      padding: 1.5rem;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .test-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>