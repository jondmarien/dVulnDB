type HeaderProps = {
  currentSection: string;
  onNavigate: (section: string) => void;
};

const NAV_LINKS = [
  { label: 'Dashboard', section: 'dashboard' },
  { label: 'Vulnerabilities', section: 'vulnerabilities' },
  { label: 'Submit', section: 'submit' },
  { label: 'Bounties', section: 'bounties' },
  { label: 'Tools', section: 'tools' },
];

const Header = ({ currentSection, onNavigate }: HeaderProps) => (
  <header className="header">
    <div className="container header__content">
      <div className="logo">
        <span className="logo__ascii">▰▱▰</span>
        <span className="logo__text">DVulnDB</span>
      </div>
      <nav className="nav">
        {NAV_LINKS.map(link => (
          <a
            key={link.section}
            href="#"
            className={`nav__link${currentSection === link.section ? ' active' : ''}`}
            onClick={e => {
              e.preventDefault();
              onNavigate(link.section);
            }}
            data-section={link.section}
          >
            {link.label}
          </a>
        ))}
      </nav>
      {/* Wallet section placeholder */}
      <div className="wallet-section">
        <button className="btn btn--primary wallet-connect-btn" id="walletConnectBtn">
          Connect Wallet
        </button>
        <div className="wallet-info hidden" id="walletInfo">
          <div className="wallet-address" id="walletAddress"></div>
          <div className="wallet-balance" id="walletBalance"></div>
        </div>
      </div>
    </div>
  </header>
);

export default Header; 