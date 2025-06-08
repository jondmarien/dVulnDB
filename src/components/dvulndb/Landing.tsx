"use client";
import { useWallet } from '../../context/WalletContext';
import { useEffect } from 'react';

interface LandingProps {
  isActive: boolean;
  onNavigate: (section: string) => void;
}

const Landing = ({ isActive, onNavigate }: LandingProps) => {
  const { isConnected, isConnecting, connectWallet } = useWallet();

  useEffect(() => {
    if (isConnected) {
      onNavigate('dashboard');
    }
  }, [isConnected, onNavigate]);

  const handleInit = () => {
    if (!isConnected && !isConnecting) {
      connectWallet();
    }
  };

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
            <button className="btn btn--primary btn--lg hero__cta" onClick={handleInit} disabled={isConnecting || isConnected}>
              {isConnecting ? 'Connecting...' : '>> INITIALIZE CONNECTION'}
            </button>
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