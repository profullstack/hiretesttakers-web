<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import MessageThread from '$lib/components/MessageThread.svelte';

  let applicationId = $page.params.applicationId;
  let application = null;
  let receiverId = null;
  let currentUserId = null;
  let loading = true;
  let error = null;

  async function loadApplicationData() {
    try {
      loading = true;
      error = null;

      // Get application details to determine receiver
      const appResponse = await fetch(`/api/applications/${applicationId}`);
      const appData = await appResponse.json();

      if (!appResponse.ok) {
        if (appResponse.status === 401) {
          goto('/auth/login');
          return;
        }
        throw new Error(appData.error || 'Failed to load application');
      }

      application = appData.application;

      // Get current user
      const profileResponse = await fetch('/api/profile');
      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.error || 'Failed to load profile');
      }

      currentUserId = profileData.profile.id;

      // Determine receiver: if current user is test taker, receiver is hirer (test owner)
      // if current user is hirer, receiver is test taker
      if (application.user_id === currentUserId) {
        // Current user is test taker, get test owner
        const testResponse = await fetch(`/api/tests/${application.test_id}`);
        const testData = await testResponse.json();
        
        if (!testResponse.ok) {
          throw new Error(testData.error || 'Failed to load test');
        }
        
        receiverId = testData.test.user_id;
      } else {
        // Current user is hirer, receiver is test taker
        receiverId = application.user_id;
      }
    } catch (err) {
      error = err.message;
      console.error('Failed to load application data:', err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadApplicationData();
  });
</script>

<svelte:head>
  <title>Conversation - TutorLinkup</title>
</svelte:head>

<div class="conversation-page">
  <div class="container">
    <header class="page-header">
      <a href="/messages" class="back-link">← Back to Messages</a>
      <h1>Conversation</h1>
      {#if application}
        <p class="application-info">
          Application for: <a href="/browse-tests/{application.test_id}">Test #{application.test_id.slice(0, 8)}</a>
        </p>
      {/if}
    </header>

    {#if loading}
      <div class="loading">
        <p>Loading conversation...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>Error: {error}</p>
        <button on:click={loadApplicationData}>Retry</button>
      </div>
    {:else if receiverId && currentUserId}
      <div class="thread-container">
        <MessageThread 
          {applicationId} 
          {receiverId} 
          {currentUserId}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .conversation-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 2rem 0;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    margin-bottom: 1rem;
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #333;
  }

  .application-info {
    margin: 0;
    color: #666;
    font-size: 0.875rem;
  }

  .application-info a {
    color: #007bff;
    text-decoration: none;
  }

  .application-info a:hover {
    text-decoration: underline;
  }

  .thread-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 600px;
  }

  .loading,
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .loading p,
  .error p {
    margin: 0 0 1rem 0;
    color: #666;
  }

  .error button {
    padding: 0.5rem 1.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  .error button:hover {
    background: #0056b3;
  }

  @media (max-width: 640px) {
    .conversation-page {
      padding: 1rem 0;
    }

    h1 {
      font-size: 1.5rem;
    }

    .thread-container {
      min-height: 500px;
    }
  }
</style>