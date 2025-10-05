<svelte:head>
  <title>Cookie Policy - HireTestTakers</title>
</svelte:head>

<div class="container">
  <h1>Cookie Policy</h1>
  <p class="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

  <section>
    <h2>What Are Cookies?</h2>
    <p>
      Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
    </p>
  </section>

  <section>
    <h2>Types of Cookies We Use</h2>
    
    <h3>Essential Cookies</h3>
    <p>These cookies are necessary for the website to function properly:</p>
    <ul>
      <li>Authentication cookies (session management)</li>
      <li>Security cookies (CSRF protection)</li>
      <li>Load balancing cookies</li>
    </ul>

    <h3>Preference Cookies</h3>
    <p>These cookies remember your choices:</p>
    <ul>
      <li>Theme preference (light/dark mode)</li>
      <li>Language selection</li>
      <li>Display preferences</li>
    </ul>

    <h3>Analytics Cookies</h3>
    <p>These cookies help us understand how visitors use our site:</p>
    <ul>
      <li>Page views and navigation patterns</li>
      <li>Time spent on pages</li>
      <li>Error tracking</li>
    </ul>
  </section>

  <section>
    <h2>Managing Cookies</h2>
    <p>
      You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
    </p>
    <p>
      However, if you do this, you may have to manually adjust some preferences every time you visit our site and some services may not work properly.
    </p>
  </section>

  <section>
    <h2>Third-Party Cookies</h2>
    <p>
      We may use third-party services that set cookies on your device. These include:
    </p>
    <ul>
      <li>Analytics providers</li>
      <li>Payment processors</li>
      <li>Content delivery networks</li>
    </ul>
  </section>

  <section>
    <h2>Contact Us</h2>
    <p>
      If you have questions about our use of cookies, please <a href="/contact">contact us</a>.
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

  h3 {
    font-size: 1.2rem;
    color: var(--color-text);
    margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
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