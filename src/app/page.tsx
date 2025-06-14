'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  // Auto-redirect to dvulndb if wallet is already connected
  useEffect(() => {
    if (connected) {
      router.push('/dvulndb');
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-4">
            <span className="text-6xl font-mono text-green-400 glow">▰▱▰</span>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              DVulnDB
            </h1>
          </div>
        </div>
        
        {/* Tagline */}
        <p className="text-2xl text-gray-300 mb-8 font-mono">
          Decentralized Vulnerability Database
        </p>
        
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          A modern Web3 vulnerability disclosure and bug bounty platform for cybersecurity professionals. 
          Connect your wallet to access the dashboard, submit vulnerabilities, and earn bounties.
        </p>
        
        {/* CTA Button */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/dvulndb')}
            className="px-8 py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-bold text-lg rounded-lg hover:from-green-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-400/25"
          >
            Enter Dashboard
          </button>
        </div>
        
        {/* Secondary CTA */}
        <div className="space-y-6">
          <div className="text-green-400 font-mono text-sm uppercase tracking-wider">
            Connect your Phantom wallet to get started
          </div>
          
          <div className="text-xs text-gray-500 font-mono">
            Network: Solana Devnet
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
