<svelte:head>
  <title>Help Center - TutorLinkup</title>
</svelte:head>

<div class="container">
  <h1>Help Center</h1>
  <p class="subtitle">Find answers to common questions and learn how to use our platform</p>

  <div class="help-grid">
    <a href="/help/getting-started" class="help-card">
      <div class="icon">🚀</div>
      <h3>Getting Started</h3>
      <p>Learn the basics of using TutorLinkup</p>
    </a>

    <a href="/help/posting-tests" class="help-card">
      <div class="icon">📝</div>
      <h3>Posting Tests</h3>
      <p>How to create and manage test listings</p>
    </a>

    <a href="/help/applying" class="help-card">
      <div class="icon">✍️</div>
      <h3>Applying to Tests</h3>
      <p>Guide for test takers applying to jobs</p>
    </a>

    <a href="/help/payments" class="help-card">
      <div class="icon">💰</div>
      <h3>Payments</h3>
      <p>Understanding cryptocurrency payments</p>
    </a>

    <a href="/help/reputation" class="help-card">
      <div class="icon">⭐</div>
      <h3>Reputation System</h3>
      <p>How ratings and reviews work</p>
    </a>

    <a href="/help/security" class="help-card">
      <div class="icon">🔒</div>
      <h3>Security</h3>
      <p>Keeping your account and data safe</p>
    </a>
  </div>

  <section class="faq-preview">
    <h2>Popular Questions</h2>
    <div class="faq-list">
      <div class="faq-item">
        <h3>How do I get paid?</h3>
        <p>Payments are made in cryptocurrency (BTC, ETH, DOGE, or SOL) directly to your wallet address.</p>
      </div>
      <div class="faq-item">
        <h3>Is my information secure?</h3>
        <p>Yes, we use industry-standard encryption and security practices to protect your data.</p>
      </div>
      <div class="faq-item">
        <h3>How does the reputation system work?</h3>
        <p>Your reputation is based on completed tests, ratings, success rate, and earnings.</p>
      </div>
    </div>
    <a href="/faq" class="btn-primary">View All FAQs</a>
  </section>

  <section class="contact-cta">
    <h2>Still Need Help?</h2>
    <p>Our support team is here to assist you</p>
    <a href="/contact" class="btn-secondary">Contact Support</a>
  </section>
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

  .help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
  }

  .help-card {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    text-decoration: none;
    transition: all var(--transition-base);
    display: block;
  }

  .help-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }

  .help-card h3 {
    color: var(--color-text);
    font-size: 1.3rem;
    margin-bottom: var(--spacing-sm);
  }

  .help-card p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  h2 {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }

  .faq-list {
    display: grid;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  .faq-item {
    background: var(--color-surface);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .faq-item h3 {
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .faq-item p {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  .faq-preview {
    text-align: center;
  }

  .contact-cta {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
  }

  .contact-cta h2 {
    margin-bottom: var(--spacing-sm);
  }

  .contact-cta p {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xl);
  }

  .btn-primary,
  .btn-secondary {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-base);
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
    h1 {
      font-size: 2rem;
    }

    .help-grid {
      grid-template-columns: 1fr;
    }
  }
</style>