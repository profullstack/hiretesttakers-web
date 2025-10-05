<script>
  const features = [
    {
      title: 'Expert Writers',
      description: 'Professional academic writers with advanced degrees',
      icon: '🎓'
    },
    {
      title: 'Original Content',
      description: '100% plagiarism-free, custom-written assignments',
      icon: '✍️'
    },
    {
      title: 'All Subjects',
      description: 'Coverage across all academic disciplines and levels',
      icon: '📚'
    },
    {
      title: 'Citations Included',
      description: 'Proper formatting with APA, MLA, Chicago, or Harvard style',
      icon: '📝'
    },
    {
      title: 'Quality Guarantee',
      description: 'Free revisions until you\'re completely satisfied',
      icon: '✓'
    },
    {
      title: 'On-Time Delivery',
      description: 'Meet your deadlines with reliable, punctual service',
      icon: '⏰'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Submit Requirements',
      description: 'Provide assignment details, deadline, and any specific instructions'
    },
    {
      step: '2',
      title: 'Get Matched',
      description: 'We connect you with a qualified writer in your subject area'
    },
    {
      step: '3',
      title: 'Track Progress',
      description: 'Communicate with your writer and monitor assignment progress'
    },
    {
      step: '4',
      title: 'Receive & Review',
      description: 'Get your completed assignment and request revisions if needed'
    }
  ];

  const assignmentTypes = [
    'Essays & Research Papers',
    'Case Studies',
    'Lab Reports',
    'Book Reviews',
    'Dissertations & Theses',
    'Literature Reviews',
    'Annotated Bibliographies',
    'Presentations',
    'Discussion Posts',
    'Term Papers'
  ];
</script>

<svelte:head>
  <title>Professional Assignment Writing Services - HireTestTakers</title>
  <meta name="description" content="Get expert help with essays, research papers, and academic assignments. Professional writers, original content, and on-time delivery guaranteed." />
</svelte:head>

<div class="container">
  <!-- Hero Section -->
  <div class="hero">
    <h1>Professional Assignment Writing Services</h1>
    <p class="hero-subtitle">
      Connect with expert academic writers for essays, research papers, and all types of assignments
    </p>
    <div class="hero-buttons">
      <a href="/my-assignments/new" class="btn btn-primary">Request Assignment Help</a>
      <a href="/my-assignments" class="btn btn-secondary">View My Assignments</a>
    </div>
  </div>

  <!-- Features Grid -->
  <div class="section">
    <h2 class="section-title">Why Choose Our Service?</h2>
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

  <!-- Assignment Types -->
  <div class="section types-section">
    <h2 class="section-title">Assignment Types We Cover</h2>
    <div class="types-grid">
      {#each assignmentTypes as type}
        <div class="type-badge">{type}</div>
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
    <p>Join thousands of students getting expert assignment help</p>
    <div class="cta-buttons">
      <a href="/auth/signup" class="btn btn-primary">Sign Up Free</a>
      <a href="/my-assignments/new" class="btn btn-secondary">Request Help Now</a>
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

  .types-section {
    background: var(--color-bg-secondary);
    padding: var(--spacing-2xl);
    border-radius: var(--radius-lg);
  }

  .types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  .type-badge {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    text-align: center;
    font-weight: 500;
    color: var(--color-text);
    transition: all var(--transition-base);
  }

  .type-badge:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: translateY(-2px);
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
    .steps-grid,
    .types-grid {
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