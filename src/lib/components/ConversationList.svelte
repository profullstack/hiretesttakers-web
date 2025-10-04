<script>
  export let conversations = [];

  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }

  function truncateMessage(content, maxLength = 60) {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
</script>

<div class="conversation-list">
  {#if conversations.length === 0}
    <div class="empty-state">
      <p>No conversations yet</p>
      <p class="hint">Start by applying to a test and messaging the hirer</p>
    </div>
  {:else}
    {#each conversations as conversation}
      <a href="/messages/{conversation.application_id}" class="conversation-item">
        <div class="conversation-content">
          <div class="conversation-header">
            <span class="conversation-title">Application #{conversation.application_id.slice(0, 8)}</span>
            <span class="conversation-time">{formatTime(conversation.latest_message.created_at)}</span>
          </div>
          <p class="conversation-preview">
            {truncateMessage(conversation.latest_message.content)}
          </p>
        </div>
        {#if conversation.unread_count > 0}
          <span class="unread-badge">{conversation.unread_count}</span>
        {/if}
      </a>
    {/each}
  {/if}
</div>

<style>
  .conversation-list {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    color: #666;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .empty-state .hint {
    font-size: 0.875rem;
    color: #999;
  }

  .conversation-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    text-decoration: none;
    color: inherit;
    transition: background 0.2s;
  }

  .conversation-item:hover {
    background: #f8f9fa;
  }

  .conversation-content {
    flex: 1;
    min-width: 0;
  }

  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .conversation-title {
    font-weight: 600;
    color: #333;
  }

  .conversation-time {
    font-size: 0.75rem;
    color: #999;
    white-space: nowrap;
  }

  .conversation-preview {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .unread-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 0.5rem;
    background: #007bff;
    color: white;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .conversation-item {
      padding: 0.75rem;
    }
  }
</style>