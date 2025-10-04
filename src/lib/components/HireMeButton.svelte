<script>
  import { createEventDispatcher } from 'svelte';

  export let testTakerId;
  export let testTakerName;
  export let size = 'medium'; // 'small', 'medium', 'large'

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('hire', { testTakerId, testTakerName });
  }
</script>

<button 
  class="hire-me-button {size}" 
  on:click={handleClick}
  type="button"
>
  💼 Hire Me
</button>

<style>
  .hire-me-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background: #28a745;
    color: white;
  }

  .hire-me-button:hover {
    background: #218838;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  }

  .hire-me-button:active {
    transform: translateY(0);
  }

  .small {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .medium {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .large {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }
</style>