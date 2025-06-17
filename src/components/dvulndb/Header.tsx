'use client';

import { useWallet } from '@context/MockWalletProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MockWalletMultiButton } from '@context/MockWalletProvider';
import { useSearchParams } from 'next/navigation';
import { CustomWalletMultiButton } from './CustomWalletMultiButton';

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
  const searchParams = useSearchParams();
  
  // Initialize mock mode directly from search params to avoid race condition
  const isMockMode = searchParams.get('mock') === 'true';
  
  console.log(' Header: Mock mode detected:', isMockMode);

  // Show public links always, protected links only when connected
  const visibleNavLinks = [...PUBLIC_NAV_LINKS, ...(connected ? PROTECTED_NAV_LINKS : [])];

  const handleNavigation = (section: string) => {
    // Preserve mock parameter during navigation
    if (isMockMode) {
      const url = new URL(window.location.href);
      url.searchParams.set('mock', 'true');
      window.history.replaceState({}, '', url.toString());
    }
    
    onNavigate(section);
  };

  return (
    <header className="header">
      <div className="container header__content">
        <button 
          className="logo" 
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} 
          onClick={() => handleNavigation('landing')} 
          aria-label="Go to Home"
        >
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
                handleNavigation(link.section);
              }}
              data-section={link.section}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="wallet-section">
          {isMockMode ? (
            <MockWalletMultiButton className="wallet-connect-btn" />
          ) : (
            <CustomWalletMultiButton className="wallet-connect-btn" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
