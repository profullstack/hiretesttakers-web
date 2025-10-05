<svelte:head>
  <title>Posting Tests - Help Center - HireTestTakers</title>
</svelte:head>

<div class="container">
  <nav class="breadcrumb">
    <a href="/help">Help Center</a> / Posting Tests
  </nav>

  <h1>📝 How to Post Tests</h1>

  <section>
    <h2>Creating a Test Listing</h2>
    <ol>
      <li>Navigate to the <a href="/browse-tests/new">Post a Test</a> page</li>
      <li>Fill in the test details (title, description, requirements)</li>
      <li>Set your budget and payment cryptocurrency</li>
      <li>Specify the deadline</li>
      <li>Add any additional requirements or files</li>
      <li>Review and publish your listing</li>
    </ol>
  </section>

  <section>
    <h2>Best Practices</h2>
    <ul>
      <li><strong>Be Clear:</strong> Provide detailed requirements and expectations</li>
      <li><strong>Set Realistic Budgets:</strong> Fair compensation attracts quality applicants</li>
      <li><strong>Respond Quickly:</strong> Fast responses lead to better matches</li>
      <li><strong>Review Carefully:</strong> Check applicant profiles and ratings</li>
    </ul>
  </section>

  <section>
    <h2>Managing Applications</h2>
    <p>Once your test is posted, you'll receive applications from qualified test takers:</p>
    <ul>
      <li>Review each applicant's profile and reputation score</li>
      <li>Check their past ratings and completed tests</li>
      <li>Communicate through our messaging system</li>
      <li>Select the best candidate for your needs</li>
    </ul>
  </section>

  <p class="help-link"><a href="/help">← Back to Help Center</a></p>
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

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
  }

  h2 {
    font-size: 1.8rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  p, li {
    color: var(--color-text-secondary);
    line-height: 1.8;
  }

  ol, ul {
    margin-left: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
  }

  li {
    margin-bottom: var(--spacing-sm);
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .help-link {
    margin-top: var(--spacing-2xl);
  }
</style>