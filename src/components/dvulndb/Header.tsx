import { useWallet } from '../../context/WalletContext';

type HeaderProps = {
  currentSection: string;
  onNavigate: (section: string) => void;
};

const NAV_LINKS = [
  { label: 'Home', section: 'landing' },
  { label: 'Dashboard', section: 'dashboard' },
  { label: 'Vulnerabilities', section: 'vulnerabilities' },
  { label: 'Submit', section: 'submit' },
  { label: 'Bounties', section: 'bounties' },
  { label: 'Tools', section: 'tools' },
];

const Header = ({ currentSection, onNavigate }: HeaderProps) => {
  const { isConnected, isConnecting, walletInfo, connectWallet } = useWallet();

  let walletContent;
  if (isConnected && walletInfo) {
    walletContent = (
      <div className="wallet-info" id="walletInfo">
        <div className="wallet-address" id="walletAddress">{walletInfo.address}</div>
        <div className="wallet-balance" id="walletBalance">{walletInfo.balance}</div>
      </div>
    );
  } else if (isConnecting) {
    walletContent = (
      <button className="btn btn--primary wallet-connect-btn" disabled>
        Connecting...
      </button>
    );
  } else {
    walletContent = (
      <button className="btn btn--primary wallet-connect-btn" id="walletConnectBtn" onClick={connectWallet}>
        Connect Wallet
      </button>
    );
  }

  return (
    <header className="header">
      <div className="container header__content">
        <button className="logo" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => onNavigate('landing')} aria-label="Go to Home">
          <span className="logo__ascii">▰▱▰</span>
          <span className="logo__text">DVulnDB</span>
        </button>
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
        <div className="wallet-section">
          {walletContent}
        </div>
      </div>
    </header>
  );
};

export default Header; 