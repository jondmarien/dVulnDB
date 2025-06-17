"use client";

import { ReactNode, useState, useEffect, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SolanaMobileWalletAdapter, AppIdentity } from '@solana-mobile/wallet-adapter-mobile';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

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

  // Wallets are initialized dynamically on the client side to avoid SSR issues.
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const timestamp = new Date().toISOString();

    if (isMobile) {
      console.log(`[${timestamp}] 📱 Mobile device detected. Offering SolanaMobileWalletAdapter.`);
      console.log(`[${timestamp}] 📱 Mobile device detected. Offering WalletConnect as a fallback.`);
      setWallets([
        new WalletConnectWalletAdapter({
          network,
          options: {
            relayUrl: 'wss://relay.walletconnect.com',
            projectId: 'db145dc6aa39360feedd31479c219bca', // Your WalletConnect Project ID
            metadata: {
              name: 'DVulnDB',
              description: 'Decentralized Vulnerability Database',
              url: window.location.origin,
              icons: [new URL('/logo.png', window.location.origin).toString()],
            },
          },
        }),
      ]);
    } else {
      console.log(`[${timestamp}] 🖥️ Desktop device detected. Offering standard adapters.`);
      setWallets([
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
      ]);
    }
  }, [network]);

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
