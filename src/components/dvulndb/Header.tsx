import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

type HeaderProps = {
  currentSection: string;
  onNavigate: (section: string) => void;
};

const PUBLIC_NAV_LINKS = [
  { label: 'Home', section: 'landing' },
  { label: 'Vulnerabilities', section: 'vulnerabilities' },
];

const PROTECTED_NAV_LINKS = [
  { label: 'Dashboard', section: 'dashboard' },
  { label: 'Submit', section: 'submit' },
  { label: 'Bounties', section: 'bounties' },
  { label: 'Tools', section: 'tools' },
];

const Header = ({ currentSection, onNavigate }: HeaderProps) => {
  const { connected } = useWallet();
  
  // Show public links always, protected links only when connected
  const visibleNavLinks = [...PUBLIC_NAV_LINKS, ...(connected ? PROTECTED_NAV_LINKS : [])];

  return (
    <header className="header">
      <div className="container header__content">
        <button className="logo" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={() => onNavigate('landing')} aria-label="Go to Home">
          <span className="logo__ascii">▰▱▰</span>
          <span className="logo__text">DVulnDB</span>
        </button>
        <nav className="nav">
          {visibleNavLinks.map(link => (
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
          <WalletMultiButton className="wallet-connect-btn" />
        </div>
      </div>
    </header>
  );
};

export default Header;