"use client";

import { ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

import { MockWalletProvider } from './MockWalletProvider';

interface WalletProviderWrapperProps {
  children: ReactNode;
}

// Check for mock mode - can be enabled via URL parameter ?mock=true
const isMockMode = () => {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('mock=true');
};

export const WalletProviderWrapper: React.FC<WalletProviderWrapperProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  // Render mock wallet provider if in mock mode
  if (isMockMode()) {
    console.log('🎭 MOCK MODE: Using Mock Wallet Provider');
    return (
      <MockWalletProvider>
        {children}
      </MockWalletProvider>
    );
  }

  // Otherwise render real Solana wallet providers
  console.log('🔗 PRODUCTION MODE: Using Real Solana Wallet Provider');
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
