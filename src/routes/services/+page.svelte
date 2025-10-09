<script>
  const services = [
    {
      title: 'Test Taking Services',
      description: 'Professional test takers available for hire. Browse qualified candidates on our leaderboard.',
      icon: '🎯',
      link: '/browse-tests/',
      features: ['Verified test takers', 'Reputation system', 'Secure payments']
    },
    {
      title: 'Homework Help',
      description: 'Get expert assistance with your homework assignments across all subjects.',
      icon: '📚',
      link: '/homework',
      features: ['All subjects covered', 'Quick turnaround', 'Quality guaranteed']
    },
    {
      title: 'Programming Assignments',
      description: 'Expert programmers ready to help with coding projects and assignments.',
      icon: '💻',
      link: '/programming',
      features: ['Multiple languages', 'Code review', 'Documentation included']
    },
    {
      title: 'Assignment Writing',
      description: 'Professional writers for essays, research papers, and academic assignments.',
      icon: '✍️',
      link: '/jobs',
      features: ['Original content', 'Plagiarism-free', 'Citations included']
    },
    {
      title: 'Free AI Tools',
      description: 'Access 8+ free AI-powered tools including paraphrase, grammar checker, and more.',
      icon: '🤖',
      link: '/tools',
      features: ['Paraphrase tool', 'Grammar checker', 'Citation generator']
    },
    {
      title: 'Leaderboard',
      description: 'View top-rated test takers and service providers based on performance and reviews.',
      icon: '🏆',
      link: '/leaderboard',
      features: ['Verified ratings', 'Performance metrics', 'Hire top talent']
    }
  ];
</script>

<svelte:head>
  <title>Our Services - TutorLinkup</title>
  <meta name="description" content="Explore our comprehensive range of academic services including test taking, homework help, programming assignments, and free AI tools." />
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Our Services</h1>
    <p class="subtitle">Comprehensive academic assistance and tools to help you succeed</p>
  </div>

  <div class="services-grid">
    {#each services as service}
      <div class="service-card">
        <div class="service-icon">{service.icon}</div>
        <h2>{service.title}</h2>
        <p class="service-description">{service.description}</p>
        
        <ul class="features-list">
          {#each service.features as feature}
            <li>✓ {feature}</li>
          {/each}
        </ul>
        
        <a href={service.link} class="service-link">
          Learn More →
        </a>
      </div>
    {/each}
  </div>

  <div class="cta-section">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of students and professionals using our platform</p>
    <div class="cta-buttons">
      <a href="/auth/signup" class="btn btn-primary">Sign Up Free</a>
      <a href="/browse-tests/" class="btn btn-secondary">Browse Tests</a>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
  }

  .service-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  .service-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }

  .service-card h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .service-description {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--spacing-lg) 0;
  }

  .features-list li {
    color: var(--color-text-secondary);
    padding: var(--spacing-xs) 0;
    font-size: 0.9rem;
  }

  .service-link {
    display: inline-block;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-base);
  }

  .service-link:hover {
    color: var(--color-primary-hover);
    transform: translateX(4px);
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

    .services-grid {
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