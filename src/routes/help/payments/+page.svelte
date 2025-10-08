<svelte:head>
  <title>Payments - Help Center - TutorLinkup</title>
</svelte:head>

<div class="container">
  <nav class="breadcrumb">
    <a href="/help">Help Center</a> / Payments
  </nav>

  <h1>💰 Understanding Payments</h1>

  <section>
    <h2>Supported Cryptocurrencies</h2>
    <p>We accept the following cryptocurrencies:</p>
    <ul>
      <li><strong>Bitcoin (BTC)</strong> - The original cryptocurrency</li>
      <li><strong>Ethereum (ETH)</strong> - Smart contract platform</li>
      <li><strong>Dogecoin (DOGE)</strong> - Fast and low-fee transactions</li>
      <li><strong>Solana (SOL)</strong> - High-speed blockchain</li>
    </ul>
  </section>

  <section>
    <h2>How Payments Work</h2>
    <ol>
      <li>Client posts a test with specified budget</li>
      <li>Test taker completes the work</li>
      <li>Client reviews and approves the work</li>
      <li>Payment is released to test taker's wallet</li>
      <li>Platform fee (3%) is automatically deducted</li>
    </ol>
  </section>

  <section>
    <h2>Setting Up Your Wallet</h2>
    <p>To receive payments, you need a cryptocurrency wallet:</p>
    <ol>
      <li>Choose a reputable wallet provider</li>
      <li>Create your wallet and secure your private keys</li>
      <li>Copy your wallet address</li>
      <li>Add it to your TutorLinkup profile</li>
    </ol>
  </section>

  <section>
    <h2>Payment Timeline</h2>
    <p>
      Payments are released immediately upon work approval. Blockchain confirmation times vary:
    </p>
    <ul>
      <li>Bitcoin: 10-60 minutes</li>
      <li>Ethereum: 1-5 minutes</li>
      <li>Dogecoin: 1-10 minutes</li>
      <li>Solana: Seconds to minutes</li>
    </ul>
  </section>

  <section>
    <h2>Platform Fees</h2>
    <p>
      We charge a 3% platform fee on all transactions. This fee helps us maintain and improve the platform, provide customer support, and ensure security.
    </p>
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