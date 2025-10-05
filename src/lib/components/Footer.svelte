<footer class="footer">
  <div class="footer-content">
    <div class="footer-section">
      <h3>HireTestTakers</h3>
      <p>The trusted marketplace for academic services and test-taking professionals.</p>
      <div class="social-links">
        <a href="#" aria-label="Twitter">🐦</a>
        <a href="#" aria-label="LinkedIn">💼</a>
        <a href="#" aria-label="GitHub">🐙</a>
      </div>
    </div>

    <div class="footer-section">
      <h4>Services</h4>
      <ul>
        <li><a href="/tests">Test Taking</a></li>
        <li><a href="/homework">Homework Help</a></li>
        <li><a href="/programming">Programming</a></li>
        <li><a href="/assignments">Assignments</a></li>
        <li><a href="/tools">Free Tools</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Company</h4>
      <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/services">Our Services</a></li>
        <li><a href="/leaderboard">Leaderboard</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Legal</h4>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/cookies">Cookie Policy</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Support</h4>
      <ul>
        <li><a href="/help">Help Center</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact Support</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; {new Date().getFullYear()} HireTestTakers.com - All rights reserved</p>
    <p class="payment-methods">
      Accepted: BTC • ETH • DOGE • SOL
    </p>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    margin-top: var(--spacing-2xl);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-md);
    display: grid;
    grid-template-columns: 2fr repeat(4, 1fr);
    gap: var(--spacing-xl);
  }

  .footer-section h3 {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin-bottom: var(--spacing-md);
  }

  .footer-section h4 {
    color: var(--color-text);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-md);
    font-weight: 600;
  }

  .footer-section p {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-section li {
    margin-bottom: var(--spacing-sm);
  }

  .footer-section a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  .footer-section a:hover {
    color: var(--color-primary);
  }

  .social-links {
    display: flex;
    gap: var(--spacing-md);
    font-size: 1.5rem;
  }

  .social-links a {
    transition: transform var(--transition-base);
  }

  .social-links a:hover {
    transform: scale(1.2);
  }

  .footer-bottom {
    border-top: 1px solid var(--color-border);
    padding: var(--spacing-lg) var(--spacing-md);
    text-align: center;
    color: var(--color-text-secondary);
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-bottom p {
    margin: var(--spacing-xs) 0;
    font-size: 0.9rem;
  }

  .payment-methods {
    font-weight: 500;
    color: var(--color-text);
  }

  @media (max-width: 1024px) {
    .footer-content {
      grid-template-columns: repeat(3, 1fr);
    }

    .footer-section:first-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 768px) {
    .footer-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .footer-content {
      grid-template-columns: 1fr;
    }
  }
</style>