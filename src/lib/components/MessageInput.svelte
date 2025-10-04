<script>
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;

  let message = '';
  const dispatch = createEventDispatcher();

  function handleSubmit(e) {
    e.preventDefault();
    
    if (message.trim() === '') {
      return;
    }

    dispatch('send', { content: message.trim() });
    message = '';
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }
</script>

<form class="message-input" on:submit={handleSubmit}>
  <textarea
    bind:value={message}
    on:keydown={handleKeydown}
    placeholder="Type a message..."
    rows="1"
    {disabled}
  />
  <button type="submit" disabled={disabled || message.trim() === ''}>
    Send
  </button>
</form>

<style>
  .message-input {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
    background: white;
  }

  textarea {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    resize: none;
    min-height: 44px;
    max-height: 120px;
  }

  textarea:focus {
    outline: none;
    border-color: #007bff;
  }

  textarea:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .message-input {
      padding: 0.75rem;
    }

    button {
      padding: 0.75rem 1rem;
    }
  }
</style>