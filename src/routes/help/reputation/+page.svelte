<svelte:head>
  <title>Reputation System - Help Center - TutorLinkup</title>
</svelte:head>

<div class="container">
  <nav class="breadcrumb">
    <a href="/help">Help Center</a> / Reputation System
  </nav>

  <h1>⭐ Reputation System</h1>

  <section>
    <h2>How Reputation Works</h2>
    <p>
      Your reputation score is a comprehensive measure of your performance on the platform. It's calculated based on multiple factors to give clients confidence in your abilities.
    </p>
  </section>

  <section>
    <h2>Reputation Factors</h2>
    <ul>
      <li><strong>Completed Services:</strong> Total number of successfully completed tests</li>
      <li><strong>Average Rating:</strong> Mean rating from all your reviews (1-5 stars)</li>
      <li><strong>Success Rate:</strong> Percentage of tests completed without issues</li>
      <li><strong>Total Earnings:</strong> Cumulative amount earned on the platform</li>
      <li><strong>Response Time:</strong> How quickly you respond to messages</li>
      <li><strong>On-Time Delivery:</strong> Percentage of work delivered by deadline</li>
    </ul>
  </section>

  <section>
    <h2>Improving Your Reputation</h2>
    <ol>
      <li>Complete more services successfully</li>
      <li>Maintain high quality work to get 5-star ratings</li>
      <li>Respond to messages within 24 hours</li>
      <li>Deliver work before or on the deadline</li>
      <li>Communicate clearly with clients</li>
      <li>Handle any issues professionally</li>
    </ol>
  </section>

  <section>
    <h2>Reputation Tiers</h2>
    <div class="tiers">
      <div class="tier">
        <h3>🥉 Bronze (0-100)</h3>
        <p>New users starting their journey</p>
      </div>
      <div class="tier">
        <h3>🥈 Silver (101-500)</h3>
        <p>Established users with proven track record</p>
      </div>
      <div class="tier">
        <h3>🥇 Gold (501-1000)</h3>
        <p>Top performers with excellent ratings</p>
      </div>
      <div class="tier">
        <h3>💎 Diamond (1000+)</h3>
        <p>Elite users with exceptional performance</p>
      </div>
    </div>
  </section>

  <section>
    <h2>Leaderboard</h2>
    <p>
      High reputation scores place you on our <a href="/leaderboard">leaderboard</a>, increasing your visibility to potential clients.
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

  .tiers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
  }

  .tier {
    background: var(--color-surface);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    text-align: center;
  }

  .tier h3 {
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .tier p {
    font-size: 0.9rem;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>