<script>
  import { onMount, onDestroy } from 'svelte';
  import MessageList from './MessageList.svelte';
  import MessageInput from './MessageInput.svelte';

  export let applicationId;
  export let receiverId;
  export let currentUserId;

  let messages = [];
  let loading = true;
  let error = null;
  let sending = false;
  let eventSource = null;

  async function loadMessages() {
    try {
      loading = true;
      error = null;

      const response = await fetch(`/api/messages/${applicationId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load messages');
      }

      messages = data.messages;
    } catch (err) {
      error = err.message;
      console.error('Failed to load messages:', err);
    } finally {
      loading = false;
    }
  }

  async function handleSend(event) {
    const { content } = event.detail;

    try {
      sending = true;
      error = null;

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationId,
          receiverId,
          content
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Add the new message to the list
      messages = [...messages, data.message];
    } catch (err) {
      error = err.message;
      console.error('Failed to send message:', err);
    } finally {
      sending = false;
    }
  }

  function setupSSE() {
    eventSource = new EventSource('/api/messages/stream');

    eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_message' && data.message.application_id === applicationId) {
        // Add new message if it's for this conversation
        messages = [...messages, data.message];
      } else if (data.type === 'message_updated' && data.message.application_id === applicationId) {
        // Update existing message
        messages = messages.map(m => 
          m.id === data.message.id ? data.message : m
        );
      }
    });

    eventSource.addEventListener('error', (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    });
  }

  onMount(() => {
    loadMessages();
    setupSSE();
  });

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });
</script>

<div class="message-thread">
  {#if loading}
    <div class="loading">
      <p>Loading messages...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Error: {error}</p>
      <button on:click={loadMessages}>Retry</button>
    </div>
  {:else}
    <MessageList {messages} {currentUserId} />
    <MessageInput on:send={handleSend} disabled={sending} />
  {/if}
</div>

<style>
  .message-thread {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .loading,
  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
    gap: 1rem;
  }

  .loading p,
  .error p {
    color: #666;
  }

  .error button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .error button:hover {
    background: #0056b3;
  }
</style>