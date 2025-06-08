import Link from 'next/link';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__content">
        <div className="footer__section">
          <h4>DVulnDB</h4>
          <p>Decentralized vulnerability<br />disclosure for Web3</p>
        </div>
        <div className="footer__section">
          <h4>Resources</h4>
          <Link href="/resources/owasp">OWASP Top 10</Link>
          <Link href="/resources/cvss">CVSS Calculator</Link>
          <Link href="/resources/disclosure">Responsible Disclosure</Link>
        </div>
        <div className="footer__section">
          <h4>Community</h4>
          <a href="#" target="_blank" rel="noopener noreferrer">Discord</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div className="footer__section">
          <h4>Legal</h4>
          <Link href="/legal/terms">Terms of Service</Link>
          <Link href="/legal/privacy">Privacy Policy</Link>
          <Link href="/legal/bug-bounty">Bug Bounty Policy</Link>
        </div>
      </div>
      <hr style={{ border: '1px solid #888', opacity: 0.2, margin: '24px 0' }} />
      <div className="footer__bottom">
        <div className="terminal-signature">
          <span className="terminal-prompt">root@dvulndb:~$ </span>
          <span>echo &quot;Securing the future, one vulnerability at a time&quot;</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 