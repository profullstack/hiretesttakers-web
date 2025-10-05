<script>
  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let submitted = false;
  let error = '';

  async function handleSubmit(e) {
    e.preventDefault();
    error = '';

    if (!name || !email || !subject || !message) {
      error = 'Please fill in all fields';
      return;
    }

    // Here you would typically send to an API endpoint
    // For now, just show success message
    submitted = true;
  }
</script>

<svelte:head>
  <title>Contact Us - HireTestTakers</title>
  <meta name="description" content="Get in touch with HireTestTakers support team. We're here to help with any questions or concerns." />
</svelte:head>

<div class="container">
  <h1>Contact Us</h1>
  <p class="subtitle">Have questions? We're here to help!</p>

  <div class="content-grid">
    <div class="contact-info">
      <h2>Get in Touch</h2>
      <div class="info-item">
        <div class="icon">📧</div>
        <div>
          <h3>Email</h3>
          <p>support@hiretesttakers.com</p>
        </div>
      </div>
      <div class="info-item">
        <div class="icon">💬</div>
        <div>
          <h3>Live Chat</h3>
          <p>Available 24/7 for premium members</p>
        </div>
      </div>
      <div class="info-item">
        <div class="icon">📚</div>
        <div>
          <h3>Help Center</h3>
          <p><a href="/help">Browse our knowledge base</a></p>
        </div>
      </div>
    </div>

    <div class="contact-form-wrapper">
      {#if submitted}
        <div class="success-message">
          <h3>Message Sent!</h3>
          <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <button on:click={() => (submitted = false)} class="btn-secondary">
            Send Another Message
          </button>
        </div>
      {:else}
        <form on:submit={handleSubmit} class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" bind:value={name} required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" bind:value={email} required />
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" bind:value={subject} required />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" bind:value={message} rows="6" required></textarea>
          </div>

          {#if error}
            <div class="error">{error}</div>
          {/if}

          <button type="submit" class="btn-primary">Send Message</button>
        </form>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 1.2rem;
    margin-bottom: var(--spacing-2xl);
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-2xl);
  }

  .contact-info h2 {
    color: var(--color-text);
    margin-bottom: var(--spacing-lg);
  }

  .info-item {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  .info-item .icon {
    font-size: 2rem;
  }

  .info-item h3 {
    color: var(--color-text);
    margin-bottom: var(--spacing-xs);
  }

  .info-item p {
    color: var(--color-text-secondary);
  }

  .info-item a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .info-item a:hover {
    text-decoration: underline;
  }

  .contact-form-wrapper {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
    color: var(--color-text);
  }

  .form-group input,
  .form-group textarea {
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: inherit;
    background: var(--color-background);
    color: var(--color-text);
  }

  .form-group textarea {
    resize: vertical;
  }

  .error {
    background: var(--color-error);
    color: white;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
  }

  .success-message {
    text-align: center;
    padding: var(--spacing-2xl);
  }

  .success-message h3 {
    color: var(--color-success);
    font-size: 1.8rem;
    margin-bottom: var(--spacing-md);
  }

  .success-message p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }

  .btn-primary,
  .btn-secondary {
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border: 2px solid var(--color-border);
  }

  .btn-secondary:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>