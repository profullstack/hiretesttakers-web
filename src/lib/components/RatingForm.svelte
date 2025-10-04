<script>
  export let testId = '';
  export let testTakerId = '';
  export let onSubmit = () => {};
  export let onCancel = () => {};

  let rating = 5;
  let review = '';
  let isSubmitting = false;
  let error = '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    error = '';

    if (!rating || rating < 1 || rating > 5) {
      error = 'Please select a rating between 1 and 5';
      return;
    }

    isSubmitting = true;

    try {
      await onSubmit({ testId, testTakerId, rating, review });
    } catch (err) {
      error = err.message || 'Failed to submit rating';
    } finally {
      isSubmitting = false;
    }
  };

  const handleStarClick = (value) => {
    rating = value;
  };
</script>

<div class="rating-form">
  <h3>Rate Test Taker</h3>

  <form on:submit={handleSubmit}>
    <div class="form-group">
      <label for="rating">Rating *</label>
      <div class="star-rating">
        {#each [1, 2, 3, 4, 5] as star}
          <button
            type="button"
            class="star"
            class:filled={star <= rating}
            on:click={() => handleStarClick(star)}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        {/each}
        <span class="rating-text">{rating} / 5</span>
      </div>
    </div>

    <div class="form-group">
      <label for="review">Review (Optional)</label>
      <textarea
        id="review"
        bind:value={review}
        placeholder="Share your experience working with this test taker..."
        rows="4"
      />
    </div>

    {#if error}
      <div class="error-message">{error}</div>
    {/if}

    <div class="form-actions">
      <button type="button" on:click={onCancel} class="cancel-btn" disabled={isSubmitting}>
        Cancel
      </button>
      <button type="submit" class="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  </form>
</div>

<style>
  .rating-form {
    background: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 500px;
    margin: 0 auto;
  }

  h3 {
    margin: 0 0 20px 0;
    color: #212529;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #495057;
    font-size: 0.875rem;
  }

  .star-rating {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .star {
    background: none;
    border: none;
    font-size: 2rem;
    color: #dee2e6;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }

  .star.filled {
    color: #ffc107;
  }

  .star:hover {
    color: #ffc107;
  }

  .rating-text {
    font-size: 0.875rem;
    color: #6c757d;
    margin-left: 8px;
  }

  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.875rem;
    resize: vertical;
  }

  textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cancel-btn {
    background: #6c757d;
    color: white;
  }

  .cancel-btn:hover:not(:disabled) {
    background: #5a6268;
  }

  .submit-btn {
    background: #007bff;
    color: white;
  }

  .submit-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>