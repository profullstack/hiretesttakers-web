<script>
  const features = [
    {
      title: 'Verified Test Takers',
      description: 'All test takers are verified and rated by the community',
      icon: '✓'
    },
    {
      title: 'Secure Payments',
      description: 'Cryptocurrency payments with escrow protection',
      icon: '🔒'
    },
    {
      title: 'Reputation System',
      description: 'Browse leaderboards and hire top-rated professionals',
      icon: '⭐'
    },
    {
      title: 'Multiple Categories',
      description: 'Academic tests, certifications, entrance exams, and more',
      icon: '📚'
    },
    {
      title: 'Quality Guarantee',
      description: 'Money-back guarantee if not satisfied with results',
      icon: '💯'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all users',
      icon: '🎧'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Post Your Test',
      description: 'Create a listing with test details, requirements, and payment offer'
    },
    {
      step: '2',
      title: 'Review Applications',
      description: 'Browse qualified test takers and review their profiles and ratings'
    },
    {
      step: '3',
      title: 'Select & Pay',
      description: 'Choose your test taker and make a secure cryptocurrency payment'
    },
    {
      step: '4',
      title: 'Get Results',
      description: 'Receive your test results and rate your experience'
    }
  ];
</script>

<svelte:head>
  <title>Professional Test Taking Services - TutorLinkup</title>
  <meta name="description" content="Hire verified professional test takers for academic tests, certifications, and entrance exams. Secure payments, reputation system, and quality guarantee." />
</svelte:head>

<div class="container">
  <!-- Hero Section -->
  <div class="hero">
    <h1>Professional Test Taking Services</h1>
    <p class="hero-subtitle">
      Connect with verified test takers for academic tests, certifications, and entrance exams
    </p>
    <div class="hero-buttons">
      <a href="/browse-tests" class="btn btn-primary">Browse Available Tests</a>
      <a href="/leaderboard" class="btn btn-secondary">View Leaderboard</a>
    </div>
  </div>

  <!-- Features Grid -->
  <div class="section">
    <h2 class="section-title">Why Choose Our Platform?</h2>
    <div class="features-grid">
      {#each features as feature}
        <div class="feature-card">
          <div class="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- How It Works -->
  <div class="section how-it-works">
    <h2 class="section-title">How It Works</h2>
    <div class="steps-grid">
      {#each howItWorks as item}
        <div class="step-card">
          <div class="step-number">{item.step}</div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- CTA Section -->
  <div class="cta-section">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of students and professionals using our platform</p>
    <div class="cta-buttons">
      <a href="/auth/signup" class="btn btn-primary">Sign Up Free</a>
      <a href="/browse-tests" class="btn btn-secondary">Browse Tests</a>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .hero {
    text-align: center;
    padding: var(--spacing-2xl) 0;
    margin-bottom: var(--spacing-2xl);
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  .section {
    margin-bottom: var(--spacing-2xl);
  }

  .section-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
  }

  .feature-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    text-align: center;
    transition: all var(--transition-base);
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }

  .feature-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .feature-card p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .how-it-works {
    background: var(--color-bg-secondary);
    padding: var(--spacing-2xl);
    border-radius: var(--radius-lg);
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
  }

  .step-card {
    text-align: center;
  }

  .step-number {
    width: 60px;
    height: 60px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 auto var(--spacing-md);
  }

  .step-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .step-card p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }

  .cta-section {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    margin-top: var(--spacing-2xl);
  }

  .cta-section h2 {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .cta-section p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
    font-size: 1.1rem;
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

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .features-grid,
    .steps-grid {
      grid-template-columns: 1fr;
    }

    .cta-buttons,
    .hero-buttons {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>