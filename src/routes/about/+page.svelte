<svelte:head>
  <title>About Us - TutorLinkup</title>
  <meta name="description" content="Learn about TutorLinkup - the trusted marketplace connecting students with qualified test takers and academic service providers." />
</svelte:head>

<div class="container">
  <h1>About TutorLinkup</h1>
  
  <section class="intro">
    <p class="lead">
      TutorLinkup is the premier marketplace connecting students with qualified test takers and academic service providers worldwide.
    </p>
  </section>

  <section class="mission">
    <h2>Our Mission</h2>
    <p>
      We believe in making academic assistance accessible, secure, and transparent. Our platform empowers students to find the help they need while providing opportunities for skilled professionals to earn through their expertise.
    </p>
  </section>

  <section class="values">
    <h2>Our Values</h2>
    <div class="values-grid">
      <div class="value-card">
        <div class="icon">🔒</div>
        <h3>Security</h3>
        <p>All transactions are secured with cryptocurrency payments and encrypted communications.</p>
      </div>
      <div class="value-card">
        <div class="icon">⭐</div>
        <h3>Quality</h3>
        <p>We maintain high standards through our reputation system and verified reviews.</p>
      </div>
      <div class="value-card">
        <div class="icon">🤝</div>
        <h3>Trust</h3>
        <p>Transparent processes and fair dispute resolution protect both parties.</p>
      </div>
      <div class="value-card">
        <div class="icon">🌍</div>
        <h3>Global</h3>
        <p>Connect with professionals worldwide, available 24/7 in multiple languages.</p>
      </div>
    </div>
  </section>

  <section class="stats">
    <h2>By the Numbers</h2>
    <div class="stats-grid">
      <div class="stat">
        <div class="stat-number">10,000+</div>
        <div class="stat-label">Active Users</div>
      </div>
      <div class="stat">
        <div class="stat-number">50,000+</div>
        <div class="stat-label">Tests Completed</div>
      </div>
      <div class="stat">
        <div class="stat-number">98%</div>
        <div class="stat-label">Satisfaction Rate</div>
      </div>
      <div class="stat">
        <div class="stat-number">24/7</div>
        <div class="stat-label">Support Available</div>
      </div>
    </div>
  </section>

  <section class="cta">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of students and professionals on our platform</p>
    <div class="cta-buttons">
      <a href="/auth/signup" class="btn btn-primary">Sign Up Free</a>
      <a href="/services" class="btn btn-secondary">Explore Services</a>
    </div>
  </section>
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }

  h2 {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-lg);
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  .intro {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }

  .lead {
    font-size: 1.3rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
  }

  .mission p {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    line-height: 1.8;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
  }

  .value-card {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    text-align: center;
    transition: all var(--transition-base);
  }

  .value-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }

  .value-card h3 {
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .value-card p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
  }

  .stat {
    text-align: center;
    padding: var(--spacing-xl);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .stat-number {
    font-size: 3rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .stat-label {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
  }

  .cta {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
  }

  .cta h2 {
    margin-bottom: var(--spacing-sm);
  }

  .cta p {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xl);
  }

  .cta-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-base);
    display: inline-block;
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

    .values-grid,
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .cta-buttons {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>