<svelte:head>
  <title>Programming Assignment Help - HireTestTakers</title>
  <meta name="description" content="Expert programmers ready to help with coding projects and assignments. Multiple languages supported with code review and documentation." />
</svelte:head>

<div class="container">
  <div class="hero">
    <h1>💻 Programming Assignment Help</h1>
    <p class="tagline">Expert programmers ready to help with your coding projects</p>
  </div>

  <section class="features">
    <h2>Programming Services</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">🔧</div>
        <h3>Multiple Languages</h3>
        <p>Python, Java, C++, JavaScript, and more - we support all major programming languages</p>
      </div>
      <div class="feature-card">
        <div class="icon">📝</div>
        <h3>Code Review</h3>
        <p>Get detailed code reviews with suggestions for improvement and best practices</p>
      </div>
      <div class="feature-card">
        <div class="icon">📚</div>
        <h3>Documentation Included</h3>
        <p>All code comes with clear comments and documentation for easy understanding</p>
      </div>
      <div class="feature-card">
        <div class="icon">🐛</div>
        <h3>Debugging Support</h3>
        <p>Help identifying and fixing bugs in your existing code</p>
      </div>
    </div>
  </section>

  <section class="languages">
    <h2>Supported Languages & Technologies</h2>
    <div class="tech-grid">
      <div class="tech-item">Python</div>
      <div class="tech-item">JavaScript</div>
      <div class="tech-item">Java</div>
      <div class="tech-item">C++</div>
      <div class="tech-item">C#</div>
      <div class="tech-item">PHP</div>
      <div class="tech-item">Ruby</div>
      <div class="tech-item">Go</div>
      <div class="tech-item">Rust</div>
      <div class="tech-item">SQL</div>
      <div class="tech-item">HTML/CSS</div>
      <div class="tech-item">React</div>
      <div class="tech-item">Node.js</div>
      <div class="tech-item">Django</div>
      <div class="tech-item">Spring</div>
      <div class="tech-item">And more...</div>
    </div>
  </section>

  <section class="how-it-works">
    <h2>How It Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h3>Describe Your Project</h3>
        <p>Post details about your programming assignment or project</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h3>Choose a Developer</h3>
        <p>Review applications from qualified programmers</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h3>Collaborate</h3>
        <p>Work together to complete your project with code reviews</p>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <h3>Secure Payment</h3>
        <p>Pay with cryptocurrency once the work meets your requirements</p>
      </div>
    </div>
  </section>

  <section class="cta">
    <h2>Need Programming Help?</h2>
    <p>Connect with expert developers today</p>
    <div class="cta-buttons">
      <a href="/auth/signup" class="btn btn-primary">Get Started</a>
      <a href="/browse-tests/" class="btn btn-secondary">Browse Projects</a>
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

  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
    max-width: 900px;
    margin: 0 auto;
  }

  .tech-item {
    background: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    text-align: center;
    font-weight: 500;
    color: var(--color-text);
    transition: all var(--transition-base);
  }

  .tech-item:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: scale(1.05);
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

    .tech-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .cta-buttons {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>