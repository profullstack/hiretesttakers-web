<script>
  export let messages = [];
  export let currentUserId;

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  function isOwnMessage(message) {
    return message.sender_id === currentUserId;
  }
</script>

<div class="message-list">
  {#if messages.length === 0}
    <div class="empty-state">
      <p>No messages yet. Start the conversation!</p>
    </div>
  {:else}
    {#each messages as message, index}
      {@const showDate = index === 0 || formatDate(messages[index - 1].created_at) !== formatDate(message.created_at)}
      
      {#if showDate}
        <div class="date-divider">
          <span>{formatDate(message.created_at)}</span>
        </div>
      {/if}

      <div class="message {isOwnMessage(message) ? 'own-message' : 'other-message'}">
        <div class="message-bubble">
          <p class="message-content">{message.content}</p>
          <span class="message-time">{formatTime(message.created_at)}</span>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .message-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    overflow-y: auto;
    max-height: 600px;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #999;
    font-style: italic;
  }

  .date-divider {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }

  .date-divider span {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
  }

  .message {
    display: flex;
    margin-bottom: 0.5rem;
  }

  .own-message {
    justify-content: flex-end;
  }

  .other-message {
    justify-content: flex-start;
  }

  .message-bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    position: relative;
  }

  .own-message .message-bubble {
    background: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .other-message .message-bubble {
    background: #f0f0f0;
    color: #333;
    border-bottom-left-radius: 4px;
  }

  .message-content {
    margin: 0 0 0.25rem 0;
    word-wrap: break-word;
    line-height: 1.4;
  }

  .message-time {
    font-size: 0.75rem;
    opacity: 0.7;
    display: block;
    text-align: right;
  }

  @media (max-width: 640px) {
    .message-list {
      padding: 0.5rem;
    }

    .message-bubble {
      max-width: 85%;
    }
  }
</style>