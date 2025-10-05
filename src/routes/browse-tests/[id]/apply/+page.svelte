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
    goto(`/browse-tests/${$page.params.id}`);
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
      <a href="/browse-tests/{$page.params.id}" class="btn-secondary">Back to Test</a>
    </div>
  {:else if test}
    <div class="apply-page">
      <header class="page-header">
        <h1>Apply to Test</h1>
        <a href="/browse-tests/{$page.params.id}" class="back-link">← Back to Test</a>
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
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .error-box {
    text-align: center;
    padding: 2rem;
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-lg);
    color: var(--color-error-dark);
  }

  .error-box p {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
  }

  .apply-page {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-sm);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .back-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-base);
  }

  .back-link:hover {
    color: var(--color-primary-hover);
  }

  .test-summary {
    background: var(--color-bg);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
    border: 1px solid var(--color-border);
  }

  .test-summary h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .test-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .meta-item strong {
    color: var(--color-text);
  }

  .test-description {
    margin: 0;
    line-height: 1.6;
    color: var(--color-text-secondary);
    white-space: pre-wrap;
  }

  .form-section {
    margin-top: 2rem;
  }

  .form-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .btn-secondary {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-secondary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .btn-secondary:hover {
    background: var(--color-secondary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
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