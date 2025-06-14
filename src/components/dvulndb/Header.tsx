import { useWallet } from '@context/MockWalletProvider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MockWalletMultiButton } from '@context/MockWalletProvider';
import { useState, useEffect } from 'react';

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
  const [isMockMode, setIsMockMode] = useState(false);
  
  // Check mock mode on client side only
  useEffect(() => {
    const checkMockMode = () => {
      const mockMode = typeof window !== 'undefined' && window.location.search.includes('mock=true');
      setIsMockMode(mockMode);
      // Reduced logging frequency
      if (mockMode !== isMockMode) {
        console.log('🎭 Header mock mode detected:', mockMode);
      }
    };
    
    checkMockMode();
    
    // Listen for URL changes to update mock mode
    const handleUrlChange = () => checkMockMode();
    window.addEventListener('popstate', handleUrlChange);
    
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [isMockMode]);
  
  // Show public links always, protected links only when connected
  const visibleNavLinks = [...PUBLIC_NAV_LINKS, ...(connected ? PROTECTED_NAV_LINKS : [])];

  const handleNavigation = (section: string) => {
    // Preserve mock parameter during navigation
    if (typeof window !== 'undefined' && isMockMode) {
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
          {/* Conditional wallet button: Mock when ?mock=true, Real Phantom wallet otherwise */}
          {isMockMode ? (
            <MockWalletMultiButton className="wallet-connect-btn" />
          ) : (
            <WalletMultiButton className="wallet-connect-btn" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;