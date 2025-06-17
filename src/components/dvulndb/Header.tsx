'use client';

import { useSearchParams } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';
import HamburgerMenu from '../layout/HamburgerMenu';

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
  const searchParams = useSearchParams();
  const { isConnected, address } = useAppKitAccount();
  
  // Initialize mock mode directly from search params
  const isMockMode = searchParams.get('mock') === 'true';

  // Determine effective connection state for UI logic
  const effectiveIsConnected = isMockMode || isConnected;
  // const effectiveAddress = isMockMode ? '0xMockWalletAddress...123' : address; // For future use if needed

  // Show public links always, protected links only when effectively connected
  const visibleNavLinks = [...PUBLIC_NAV_LINKS, ...(effectiveIsConnected ? PROTECTED_NAV_LINKS : [])];

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
        <HamburgerMenu 
          navLinks={visibleNavLinks}
          onNavigate={handleNavigation}
          currentSection={currentSection}
        />
        <div className="wallet-section">
            <div className="wallet-connect-btn-wrapper">
              <appkit-button />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
