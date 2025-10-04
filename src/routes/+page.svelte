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
      <p>Access 20+ free tools to help with your studies</p>
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
    padding: 2rem;
  }
  
  header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .tagline {
    font-size: 1.2rem;
    color: #666;
  }
  
  .hero {
    text-align: center;
    padding: 3rem 0;
  }
  
  .hero h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-primary:hover {
    background: #2563eb;
  }
  
  .btn-secondary {
    background: #6b7280;
    color: white;
  }
  
  .btn-secondary:hover {
    background: #4b5563;
  }
  
  .btn-outline {
    border: 2px solid #3b82f6;
    color: #3b82f6;
    background: transparent;
  }
  
  .btn-outline:hover {
    background: #3b82f6;
    color: white;
  }
  
  .features {
    margin: 4rem 0;
  }
  
  .features h3 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .feature {
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
  
  .feature h4 {
    margin-bottom: 0.5rem;
  }
  
  .free-tools {
    text-align: center;
    padding: 3rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    margin: 3rem 0;
  }
  
  .free-tools h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  footer {
    text-align: center;
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
  }
</style>