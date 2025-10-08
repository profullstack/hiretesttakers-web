<svelte:head>
  <title>Privacy Policy - TutorLinkup</title>
</svelte:head>

<div class="container">
  <h1>Privacy Policy</h1>
  <p class="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

  <section>
    <h2>1. Information We Collect</h2>
    <p>We collect information you provide directly to us, including:</p>
    <ul>
      <li>Account information (email, username)</li>
      <li>Profile information (skills, location, bio)</li>
      <li>Payment information (cryptocurrency wallet addresses)</li>
      <li>Communications and messages</li>
      <li>Usage data and analytics</li>
    </ul>
  </section>

  <section>
    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide, maintain, and improve our services</li>
      <li>Process transactions and send related information</li>
      <li>Send technical notices and support messages</li>
      <li>Respond to your comments and questions</li>
      <li>Monitor and analyze trends and usage</li>
    </ul>
  </section>

  <section>
    <h2>3. Information Sharing</h2>
    <p>We do not sell your personal information. We may share information:</p>
    <ul>
      <li>With service providers who assist our operations</li>
      <li>To comply with legal obligations</li>
      <li>To protect our rights and prevent fraud</li>
      <li>With your consent</li>
    </ul>
  </section>

  <section>
    <h2>4. Data Security</h2>
    <p>
      We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
    </p>
  </section>

  <section>
    <h2>5. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li>Access your personal information</li>
      <li>Correct inaccurate data</li>
      <li>Request deletion of your data</li>
      <li>Object to processing of your data</li>
      <li>Export your data</li>
    </ul>
  </section>

  <section>
    <h2>6. Contact Us</h2>
    <p>
      If you have questions about this Privacy Policy, please contact us at:
      <a href="/contact">support@tutorlinkup.com</a>
    </p>
  </section>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .last-updated {
    color: var(--color-text-secondary);
    font-style: italic;
    margin-bottom: var(--spacing-2xl);
  }

  section {
    margin-bottom: var(--spacing-2xl);
  }

  h2 {
    font-size: 1.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }

  p {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-bottom: var(--spacing-md);
  }

  ul {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin-left: var(--spacing-xl);
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
</style>