<script>
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>HireTestTakers.com - Marketplace for Test Taking Services</title>
  <meta name="description" content="Connect with qualified test takers or offer your test-taking services. Secure cryptocurrency payments." />
</svelte:head>

<div class="container">
  <header>
    <h1>HireTestTakers.com</h1>
    <p class="tagline">Marketplace for Test Taking Services</p>
  </header>
  
  <main>
    <section class="hero">
      <h2>Welcome to HireTestTakers</h2>
      <p>Connect with qualified test takers or offer your expertise</p>
      
      <div class="cta-buttons">
        <a href="/auth/signup" class="btn btn-primary">Get Started</a>
        <a href="/tests" class="btn btn-secondary">Browse Tests</a>
        <a href="/leaderboard" class="btn btn-secondary">View Leaderboard</a>
      </div>
    </section>
    
    <section class="features">
      <h3>Features</h3>
      <div class="feature-grid">
        <div class="feature">
          <h4>🎯 Post Tests</h4>
          <p>Create test listings with cryptocurrency payments</p>
        </div>
        <div class="feature">
          <h4>💼 Find Work</h4>
          <p>Apply to tests and earn cryptocurrency</p>
        </div>
        <div class="feature">
          <h4>🏆 Leaderboard</h4>
          <p>Build your reputation and get discovered</p>
        </div>
        <div class="feature">
          <h4>💰 Secure Payments</h4>
          <p>BTC, ETH, DOGE, SOL supported</p>
        </div>
      </div>
    </section>
    
    <section class="free-tools">
      <h3>Free AI-Powered Tools</h3>
      <p>Access 8+ free tools to help with your studies</p>
      <a href="/tools" class="btn btn-outline">Explore Tools</a>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2024 HireTestTakers.com - All rights reserved</p>
  </footer>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }
  
  header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
  }
  
  .tagline {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }
  
  .hero {
    text-align: center;
    padding: var(--spacing-2xl) 0;
  }
  
  .hero h2 {
    font-size: 2rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
  }

  .hero p {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-top: var(--spacing-xl);
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
    background: var(--color-surface-hover);
  }
  
  .btn-outline {
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    background: transparent;
  }
  
  .btn-outline:hover {
    background: var(--color-primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .features {
    margin: var(--spacing-2xl) 0;
  }
  
  .features h3 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text);
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
  }
  
  .feature {
    padding: var(--spacing-xl);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    transition: all var(--transition-base);
  }

  .feature:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
  
  .feature h4 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
    font-size: 1.2rem;
  }

  .feature p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
  
  .free-tools {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    margin: var(--spacing-2xl) 0;
  }
  
  .free-tools h3 {
    font-size: 1.8rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
  }

  .free-tools p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
    font-size: 1.1rem;
  }
  
  footer {
    text-align: center;
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .hero h2 {
      font-size: 1.5rem;
    }

    .cta-buttons {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }
  }
</style>