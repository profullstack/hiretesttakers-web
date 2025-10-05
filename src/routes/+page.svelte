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
    <p class="tagline">The Premier Cryto-friendly Marketplace for Test Taking Services, Tutoring and Homework Help</p>
  </header>
  
  <main>
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h2>Welcome to HireTestTakers</h2>
          <p>Connect with qualified test takers or offer your expertise</p>
          
          <div class="cta-buttons">
            <a href="/auth/signup" class="btn btn-primary">Get Started</a>
            <a href="/browse-tests/" class="btn btn-secondary">Browse Tests</a>
            <a href="/leaderboard" class="btn btn-secondary">View Leaderboard</a>
          </div>
        </div>
        
        <div class="hero-image">
          <img src="/hero.svg" alt="HireTestTakers Platform" class="hero-svg" />
        </div>
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
      <a href="/services" class="btn btn-outline">Explore Tools</a>
    </section>
  </main>
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
    padding: var(--spacing-2xl) 0;
    background: linear-gradient(135deg,
      var(--color-primary-light) 0%,
      var(--color-primary) 50%,
      var(--color-info) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 8s ease infinite;
    background-size: 200% 200%;
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-sm);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  
  .tagline {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    max-width: 66%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
  
  .hero {
    padding: var(--spacing-2xl);
    position: relative;
    background: linear-gradient(135deg,
      var(--color-bg) 0%,
      var(--color-bg-secondary) 50%,
      var(--color-bg-tertiary) 100%);
    border-radius: var(--radius-xl);
    margin-bottom: var(--spacing-2xl);
    overflow: hidden;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2xl);
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-text {
    text-align: left;
  }

  .hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-svg {
    width: 100%;
    max-width: 500px;
    height: auto;
  }
  
  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
      rgba(91, 127, 232, 0.1) 0%,
      transparent 70%);
    animation: pulse 4s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  .hero h2 {
    font-size: 2rem;
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    position: relative;
    z-index: 1;
    font-weight: 700;
  }

  .hero p {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
  }
  
  .cta-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-top: var(--spacing-xl);
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }
  
  .btn {
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--radius-lg);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-base);
    display: inline-block;
    position: relative;
    overflow: hidden;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .btn:hover::before {
    width: 300px;
    height: 300px;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, 
      var(--color-primary) 0%, 
      var(--color-primary-hover) 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(91, 127, 232, 0.3);
  }
  
  .btn-primary:hover {
    background: linear-gradient(135deg, 
      var(--color-primary-hover) 0%, 
      var(--color-primary-dark) 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(91, 127, 232, 0.4);
  }
  
  .btn-secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border: 2px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }
  
  .btn-secondary:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-surface-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
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
    box-shadow: 0 6px 20px rgba(91, 127, 232, 0.3);
  }
  
  .features {
    margin: var(--spacing-2xl) 0;
  }
  
  .features h3 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text);
    font-weight: 700;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .features h3::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, 
      var(--color-primary) 0%, 
      var(--color-info) 100%);
    border-radius: var(--radius-full);
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
  }
  
  .feature {
    padding: var(--spacing-xl);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, 
      var(--color-surface) 0%, 
      var(--color-bg-secondary) 100%);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
  }
  
  .feature::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(91, 127, 232, 0.1) 50%, 
      transparent 100%);
    transition: left 0.5s;
  }
  
  .feature:hover::before {
    left: 100%;
  }

  .feature:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 30px rgba(91, 127, 232, 0.2);
    border-color: var(--color-primary);
  }
  
  .feature h4 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
    font-size: 1.2rem;
    font-weight: 700;
    position: relative;
    z-index: 1;
  }

  .feature p {
    color: var(--color-text-secondary);
    line-height: 1.6;
    position: relative;
    z-index: 1;
  }
  
  .free-tools {
    text-align: center;
    padding: var(--spacing-2xl);
    background: linear-gradient(135deg, 
      var(--color-info-light) 0%, 
      var(--color-primary) 50%, 
      var(--color-success-light) 100%);
    border-radius: var(--radius-xl);
    margin: var(--spacing-2xl) 0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(91, 127, 232, 0.3);
  }
  
  .free-tools::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 70%);
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .free-tools h3 {
    font-size: 1.8rem;
    margin-bottom: var(--spacing-md);
    color: white;
    font-weight: 700;
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .free-tools p {
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: var(--spacing-lg);
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
  
  .free-tools .btn-outline {
    border-color: white;
    color: white;
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .free-tools .btn-outline:hover {
    background: white;
    color: var(--color-primary);
    border-color: white;
  }

  /* Dark mode specific enhancements */
  :global(.dark) .hero {
    background: linear-gradient(135deg,
      var(--color-bg) 0%,
      var(--color-bg-secondary) 50%,
      var(--color-bg-tertiary) 100%);
  }
  :global(.dark) .hero::before {
    background: radial-gradient(circle, 
      rgba(0, 240, 255, 0.15) 0%, 
      transparent 70%);
  }
  
  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }
  
  :global(.dark) .btn-primary:hover {
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.6), 
                0 0 40px rgba(0, 240, 255, 0.4), 
                0 0 60px rgba(0, 240, 255, 0.2);
  }
  
  :global(.dark) .feature:hover {
    box-shadow: 0 0 30px rgba(0, 240, 255, 0.3);
    border-color: var(--color-primary);
  }
  
  :global(.dark) .free-tools {
    background: linear-gradient(135deg, 
      var(--color-info) 0%, 
      var(--color-primary) 50%, 
      var(--color-success) 100%);
    box-shadow: var(--glow-primary);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .hero-content {
      grid-template-columns: 1fr;
      gap: var(--spacing-xl);
    }

    .hero-text {
      text-align: center;
    }

    .hero h2 {
      font-size: 1.5rem;
    }

    .hero-image {
      order: -1;
    }

    .hero-svg {
      max-width: 300px;
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
    
    header {
      padding: var(--spacing-xl) 0;
    }
  }
</style>