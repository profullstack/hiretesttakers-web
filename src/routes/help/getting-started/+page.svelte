<svelte:head>
  <title>Getting Started - Help Center - HireTestTakers</title>
</svelte:head>

<div class="container">
  <nav class="breadcrumb">
    <a href="/help">Help Center</a> / Getting Started
  </nav>

  <h1>🚀 Getting Started with HireTestTakers</h1>

  <section>
    <h2>Welcome!</h2>
    <p>
      HireTestTakers is a marketplace connecting students with qualified test takers and academic service providers. This guide will help you get started quickly.
    </p>
  </section>

  <section>
    <h2>Step 1: Create Your Account</h2>
    <ol>
      <li>Click "Sign Up" in the navigation menu</li>
      <li>Enter your email address and create a secure password</li>
      <li>Verify your email address</li>
      <li>Complete your profile with relevant information</li>
    </ol>
    <a href="/auth/signup" class="btn-primary">Sign Up Now</a>
  </section>

  <section>
    <h2>Step 2: Choose Your Path</h2>
    
    <div class="path-cards">
      <div class="path-card">
        <h3>I Need Help (Student)</h3>
        <ul>
          <li>Post a test or assignment</li>
          <li>Set your budget and requirements</li>
          <li>Review applications from qualified helpers</li>
          <li>Choose the best candidate</li>
          <li>Pay securely with cryptocurrency</li>
        </ul>
        <a href="/browse-tests/new" class="btn-secondary">Post a Test</a>
      </div>

      <div class="path-card">
        <h3>I Want to Help (Test Taker)</h3>
        <ul>
          <li>Browse available tests and assignments</li>
          <li>Apply to opportunities that match your skills</li>
          <li>Complete the work professionally</li>
          <li>Build your reputation</li>
          <li>Earn cryptocurrency</li>
        </ul>
        <a href="/tests" class="btn-secondary">Browse Tests</a>
      </div>
    </div>
  </section>

  <section>
    <h2>Step 3: Set Up Payments</h2>
    <p>
      HireTestTakers uses cryptocurrency for secure, fast payments. You'll need:
    </p>
    <ul>
      <li>A cryptocurrency wallet (we support BTC, ETH, DOGE, SOL)</li>
      <li>Your wallet address added to your profile</li>
      <li>Basic understanding of cryptocurrency transactions</li>
    </ul>
    <p>
      <a href="/help/payments">Learn more about payments →</a>
    </p>
  </section>

  <section>
    <h2>Step 4: Build Your Reputation</h2>
    <p>
      Your reputation score is crucial for success on our platform:
    </p>
    <ul>
      <li>Complete services successfully</li>
      <li>Maintain high ratings from clients</li>
      <li>Respond quickly to messages</li>
      <li>Deliver quality work on time</li>
    </ul>
    <p>
      <a href="/help/reputation">Learn about the reputation system →</a>
    </p>
  </section>

  <section>
    <h2>Need More Help?</h2>
    <div class="help-links">
      <a href="/faq">View FAQ</a>
      <a href="/contact">Contact Support</a>
      <a href="/help">Back to Help Center</a>
    </div>
  </section>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .breadcrumb {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
    font-size: 0.9rem;
  }

  .breadcrumb a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  h2 {
    font-size: 1.8rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }

  h3 {
    font-size: 1.3rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
  }

  ol, ul {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-left: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
  }

  li {
    margin-bottom: var(--spacing-sm);
  }

  .path-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    margin: var(--spacing-xl) 0;
  }

  .path-card {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .path-card h3 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
  }

  .path-card ul {
    margin-left: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .help-links {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .help-links a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  .help-links a:hover {
    text-decoration: underline;
  }

  .btn-primary,
  .btn-secondary {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-base);
    margin-top: var(--spacing-md);
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

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .path-cards {
      grid-template-columns: 1fr;
    }
  }
</style>