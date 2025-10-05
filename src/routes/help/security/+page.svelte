<svelte:head>
  <title>Security - Help Center - HireTestTakers</title>
</svelte:head>

<div class="container">
  <nav class="breadcrumb">
    <a href="/help">Help Center</a> / Security
  </nav>

  <h1>🔒 Security & Safety</h1>

  <section>
    <h2>Account Security</h2>
    <p>Protect your account with these best practices:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Never share your password with anyone</li>
      <li>Enable two-factor authentication (coming soon)</li>
      <li>Log out from shared devices</li>
      <li>Review account activity regularly</li>
    </ul>
  </section>

  <section>
    <h2>Payment Security</h2>
    <p>We use cryptocurrency for secure, decentralized payments:</p>
    <ul>
      <li>All transactions are recorded on the blockchain</li>
      <li>We never store your private keys</li>
      <li>Payments are irreversible - verify details before sending</li>
      <li>Use reputable wallet providers</li>
      <li>Keep your wallet private keys secure</li>
    </ul>
  </section>

  <section>
    <h2>Data Protection</h2>
    <p>Your data is protected through:</p>
    <ul>
      <li>Industry-standard encryption (TLS/SSL)</li>
      <li>Secure database storage</li>
      <li>Regular security audits</li>
      <li>Limited data retention policies</li>
      <li>GDPR compliance</li>
    </ul>
  </section>

  <section>
    <h2>Reporting Issues</h2>
    <p>If you notice suspicious activity or security concerns:</p>
    <ol>
      <li>Change your password immediately</li>
      <li>Contact our support team at <a href="/contact">support@hiretesttakers.com</a></li>
      <li>Provide details about the issue</li>
      <li>Follow our team's guidance</li>
    </ol>
  </section>

  <section>
    <h2>Safe Practices</h2>
    <ul>
      <li>Verify user profiles before engaging</li>
      <li>Use our messaging system for all communications</li>
      <li>Report suspicious behavior</li>
      <li>Don't share personal financial information</li>
      <li>Be cautious of phishing attempts</li>
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
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>