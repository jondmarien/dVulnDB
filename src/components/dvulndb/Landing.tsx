"use client";
import { useWallet } from '@context/MockWalletProvider';

interface LandingProps {
  isActive: boolean;
  onNavigate: (section: string) => void;
}

const Landing = ({ isActive, onNavigate }: LandingProps) => {
  const { publicKey } = useWallet();

  // Removed aggressive auto-redirect to dashboard - let users stay on landing if they want
  // Users can manually navigate to dashboard via nav links when connected

  return (
    <section className={`section section--landing${isActive ? ' active' : ''}`} id="landing">
      <div className="container">
        <div className="hero">
          <div className="hero__content">
            <div className="terminal-text">
              <span className="terminal-prompt">root@dvulndb:~$ </span>
              <span className="typewriter">Securing the decentralized web...</span>
            </div>
            <h1 className="hero__title">
              Decentralized Vulnerability Database
            </h1>
            <p className="hero__subtitle">
              The premier Web3 platform for security researchers to discover, validate, and monetize vulnerability disclosures through blockchain-powered bounty programs.
            </p>
            <div className="hero__stats">
              <div className="stat-card">
                <div className="stat-card__value">2,847</div>
                <div className="stat-card__label">Vulnerabilities</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">₹35,000</div>
                <div className="stat-card__label">SOL Distributed</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">1,234</div>
                <div className="stat-card__label">Researchers</div>
              </div>
            </div>
            {/* Wallet button removed - only use header wallet button */}
            {publicKey && (
              <div className="mt-6">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn btn--secondary btn--sm"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
          <div className="hero__visual">
            <div className="matrix-bg"></div>
            <div className="ascii-art">
              <pre>{`
╔══════════════════════════╗
║    SECURITY PROTOCOL     ║
║         ACTIVE           ║
╠══════════════════════════╣
║  > Scanning networks...  ║
║  > Analyzing threats...  ║
║  > Validating reports... ║
╚══════════════════════════╝
`}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;