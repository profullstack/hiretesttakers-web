<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import ConversationList from '$lib/components/ConversationList.svelte';

  let conversations = [];
  let loading = true;
  let error = null;
  let unreadCount = 0;

  async function loadConversations() {
    try {
      loading = true;
      error = null;

      const response = await fetch('/api/messages');
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          goto('/auth/login');
          return;
        }
        throw new Error(data.error || 'Failed to load conversations');
      }

      conversations = data.conversations;
      
      // Calculate total unread count
      unreadCount = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
    } catch (err) {
      error = err.message;
      console.error('Failed to load conversations:', err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadConversations();
  });
</script>

<svelte:head>
  <title>Messages - HireTestTakers</title>
</svelte:head>

<div class="messages-page">
  <div class="container">
    <header class="page-header">
      <h1>Messages</h1>
      {#if unreadCount > 0}
        <span class="unread-total">{unreadCount} unread</span>
      {/if}
    </header>

    {#if loading}
      <div class="loading">
        <p>Loading conversations...</p>
      </div>
    {:else if error}
      <div class="error">
        <p>Error: {error}</p>
        <button on:click={loadConversations}>Retry</button>
      </div>
    {:else}
      <div class="conversations-container">
        <ConversationList {conversations} />
      </div>
    {/if}
  </div>
</div>

<style>
  .messages-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 2rem 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    color: #333;
  }

  .unread-total {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .conversations-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
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
    .messages-page {
      padding: 1rem 0;
    }

    h1 {
      font-size: 1.5rem;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
</style>