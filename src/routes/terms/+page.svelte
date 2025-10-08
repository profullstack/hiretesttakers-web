<svelte:head>
  <title>Terms of Service - TutorLinkup</title>
</svelte:head>

<div class="container">
  <h1>Terms of Service</h1>
  <p class="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

  <section>
    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing and using TutorLinkup, you accept and agree to be bound by the terms and provision of this agreement.
    </p>
  </section>

  <section>
    <h2>2. Use of Service</h2>
    <p>You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
    <ul>
      <li>Violate any applicable laws or regulations</li>
      <li>Infringe on intellectual property rights</li>
      <li>Transmit malicious code or viruses</li>
      <li>Engage in fraudulent activities</li>
      <li>Harass or harm other users</li>
    </ul>
  </section>

  <section>
    <h2>3. User Accounts</h2>
    <p>
      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
    </p>
  </section>

  <section>
    <h2>4. Payments and Fees</h2>
    <p>
      All payments are processed through cryptocurrency. We charge a 3% platform fee on all transactions. Payments are non-refundable except as required by law or our refund policy.
    </p>
  </section>

  <section>
    <h2>5. Content and Intellectual Property</h2>
    <p>
      Users retain ownership of content they create. By posting content, you grant us a license to use, modify, and display that content on our platform.
    </p>
  </section>

  <section>
    <h2>6. Dispute Resolution</h2>
    <p>
      Any disputes arising from use of our service will be resolved through binding arbitration in accordance with our dispute resolution policy.
    </p>
  </section>

  <section>
    <h2>7. Limitation of Liability</h2>
    <p>
      TutorLinkup is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages.
    </p>
  </section>

  <section>
    <h2>8. Changes to Terms</h2>
    <p>
      We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
    </p>
  </section>

  <section>
    <h2>9. Contact</h2>
    <p>
      For questions about these Terms, please <a href="/contact">contact us</a>.
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