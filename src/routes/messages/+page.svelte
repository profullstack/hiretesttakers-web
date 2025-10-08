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
  <title>Messages - TutorLinkup</title>
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
    background: var(--color-bg);
    padding: var(--spacing-xl) 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .unread-total {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }

  :global(.dark) .unread-total {
    box-shadow: var(--glow-primary);
  }

  .conversations-container {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }

  .loading,
  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl) var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }

  .loading p,
  .error p {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text-secondary);
  }

  .error button {
    padding: var(--spacing-sm) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .error button:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .error button {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .error button:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  @media (max-width: 640px) {
    .messages-page {
      padding: var(--spacing-md) 0;
    }

    h1 {
      font-size: 1.5rem;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-md);
    }
  }
</style>