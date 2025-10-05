<svelte:head>
  <title>Homework Help Services - HireTestTakers</title>
  <meta name="description" content="Get expert homework help across all subjects. Quick turnaround, quality guaranteed, and affordable rates." />
</svelte:head>

<div class="container">
  <div class="hero">
    <h1>📚 Homework Help Services</h1>
    <p class="tagline">Expert assistance with your homework assignments across all subjects</p>
  </div>

  <section class="features">
    <h2>Why Choose Our Homework Help?</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">✓</div>
        <h3>All Subjects Covered</h3>
        <p>Math, Science, English, History, and more - we have experts in every field</p>
      </div>
      <div class="feature-card">
        <div class="icon">⚡</div>
        <h3>Quick Turnaround</h3>
        <p>Get help fast with our responsive tutors and flexible scheduling</p>
      </div>
      <div class="feature-card">
        <div class="icon">🎯</div>
        <h3>Quality Guaranteed</h3>
        <p>All work is reviewed for accuracy and completeness before delivery</p>
      </div>
      <div class="feature-card">
        <div class="icon">💰</div>
        <h3>Affordable Rates</h3>
        <p>Competitive pricing with secure cryptocurrency payment options</p>
      </div>
    </div>
  </section>

  <section class="how-it-works">
    <h2>How It Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Post Your Assignment</h3>
        <p>Create a listing with details about your homework assignment</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Review Applications</h3>
        <p>Qualified tutors apply to help with your assignment</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Get Help</h3>
        <p>Work with your chosen tutor to complete your homework</p>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <h3>Pay Securely</h3>
        <p>Pay with cryptocurrency once you're satisfied with the work</p>
      </div>
    </div>
  </section>

  <section class="cta">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of students getting homework help</p>
    <div class="cta-buttons">
      <a href="/auth/signup" class="btn btn-primary">Sign Up Free</a>
      <a href="/assignments" class="btn btn-secondary">Browse Assignments</a>
    </div>
  </section>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  .hero {
    text-align: center;
    padding: var(--spacing-2xl) 0;
    margin-bottom: var(--spacing-2xl);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }

  .tagline {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  h2 {
    text-align: center;
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
  }

  .feature-card {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    text-align: center;
    transition: all var(--transition-base);
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
  }

  .feature-card h3 {
    font-size: 1.3rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .feature-card p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
  }

  .step {
    text-align: center;
  }

  .step-number {
    width: 60px;
    height: 60px;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 auto var(--spacing-md);
  }

  .step h3 {
    font-size: 1.2rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .step p {
    color: var(--color-text-secondary);
    line-height: 1.6;
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

    .feature-grid,
    .steps {
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