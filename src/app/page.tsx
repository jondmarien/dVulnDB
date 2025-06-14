'use client';

import { useWallet } from '@context/MockWalletProvider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  // Removed aggressive auto-redirect - let users navigate freely
  // Users can manually click "Enter Dashboard" if they want to go to /dvulndb

  // Preserve mock mode parameter when navigating
  const preserveMockParam = (path: string) => {
    if (typeof window === 'undefined') return path;
    const urlParams = new URLSearchParams(window.location.search);
    const isMock = urlParams.get('mock') === 'true';
    
    if (isMock) {
      console.log('🎭 Preserving mock mode for navigation to:', path);
      return `${path}?mock=true`;
    }
    
    return path;
  };

  const handleEnterDashboard = () => {
    const preservedUrl = preserveMockParam('/dvulndb');
    router.push(preservedUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4">
            <span className="text-6xl font-mono text-green-400 glow">▰▱▰</span>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              DVulnDB
            </h1>
          </div>
        </div>
        
        {/* Tagline */}
        <div className="mb-8 flex justify-center">
          <p className="text-2xl text-gray-300 font-mono">
            Decentralized Vulnerability Database
          </p>
        </div>
        
        <div className="mb-12 flex justify-center">
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            A modern Web3 vulnerability disclosure and bug bounty platform for cybersecurity professionals. 
            Connect your wallet to access the dashboard, submit vulnerabilities, and earn bounties.
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="mb-12 flex justify-center">
          <button
            onClick={handleEnterDashboard}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-lg rounded-lg hover:from-green-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-400/25"
          >
            Enter Dashboard
          </button>
        </div>
        
        {/* Connection Status Indicator */}
        {connected && (
          <div className="mb-8 flex justify-center">
            <div className="bg-green-900/40 border border-green-400/50 rounded-md px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm">
                  Wallet Connected
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Tech-styled Connection Info */}
        <div className="space-y-4 mb-16 flex flex-col items-center">
          {/* Terminal-style wallet connection */}
          <div className="bg-black/40 border border-green-400/30 rounded-md px-6 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
              <span className="text-green-500">$</span>
              <span className="text-green-300">connect</span>
              <span className="text-cyan-400">--wallet</span>
              <span className="text-yellow-400">phantom</span>
              <span className="animate-pulse text-green-400">█</span>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-600/50 rounded-md px-4 py-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300 font-mono text-xs">
              <span className="text-cyan-400">NETWORK:</span> 
              <span className="text-green-400 font-bold">SOLANA_DEVNET</span>
            </span>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-black/30 border border-green-400/20 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-2">🔒 Secure Reporting</h3>
            <p className="text-gray-400 text-sm">Submit vulnerability reports with cryptographic proof and immutable records.</p>
          </div>
          
          <div className="p-6 bg-black/30 border border-green-400/20 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-2">💰 Bounty System</h3>
            <p className="text-gray-400 text-sm">Earn rewards for valid vulnerability disclosures through our decentralized bounty system.</p>
          </div>
          
          <div className="p-6 bg-black/30 border border-green-400/20 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-2">🛠️ Security Tools</h3>
            <p className="text-gray-400 text-sm">Access professional security tools and resources for vulnerability research.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
