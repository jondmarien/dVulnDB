'use client';

import React, { useEffect, useState } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { solana, solanaDevnet, solanaTestnet } from '@reown/appkit/networks';
import { MockWalletProvider } from './MockWalletProvider';

// Ensure this component is only rendered on the client
export function AppKitProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  // Check for mock mode - can be enabled via URL parameter ?mock=true
  const isMockMode = typeof window !== 'undefined' && window.location.search.includes('mock=true');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isMockMode) {
      const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
      if (!projectId) {
        console.error('Reown Project ID is undefined. Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your .env.local file.');
        return;
      }

      // Define application metadata
      const metadata = {
        name: 'DVulnDB',
        description: 'Decentralized Vulnerability Database',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://dvulndb.chron0.tech',
        icons: ['/logo.png'],
      };

      // Get Solana RPC URL from environment or use fallback
      const solanaRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      
      // Configure Solana-only adapter with optimal settings
      const solanaAdapter = new SolanaAdapter({
        connectionSettings: {
          commitment: 'confirmed',
        },
      });

      try {
        // Create AppKit with Solana-only configuration
        createAppKit({
          projectId,
          metadata,
          // Only include Solana networks (devnet, testnet, mainnet)
          networks: [solanaDevnet, solanaTestnet, solana],
          // Only include Solana adapter - no EVM adapters
          adapters: [solanaAdapter],
          // Configure theme variables for consistent UI with cyberpunk theme
          themeVariables: {
            '--w3m-font-family': 'JetBrains Mono, monospace',
            '--w3m-z-index': 1000,
            '--w3m-accent': '#00ff00',
            '--w3m-color-mix': '#0f0f0f',
            '--w3m-border-radius-master': '4px',
          },
          // Filter out non-Solana wallet options - only show Phantom as per requirement 1.1
          featuredWalletIds: ['c4d8a53e-2743-4fea-91a8-b9e9c3e87609'], // Phantom wallet ID
          // Exclude all EVM wallets
          excludeWalletIds: [
            // Common EVM wallet IDs
            '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4', // MetaMask
            '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Coinbase Wallet
            '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
            // Additional EVM wallet IDs
            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // Rainbow
            'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18', // Trust Wallet (alt)
            'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef', // Argent
            '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Frame
          ],
          // Disable EVM features
          enableEIP6963: false, // Disable EVM injection detection
          enableInjected: false, // Disable injected EVM wallets
        });
        console.log('AppKit initialized successfully with Solana-only configuration.');
      } catch (error) {
        console.error('Failed to initialize AppKit:', error);
      }
    }
  }, [isClient, isMockMode]);

  if (!isClient) {
    // Render nothing or a loading indicator on the server
    return null;
  }

  // Use MockWalletProvider in mock mode
  if (isMockMode) {
    console.log('🎭 MOCK MODE: Using Mock Wallet Provider (Solana-only)');
    return <MockWalletProvider>{children}</MockWalletProvider>;
  }

  return <>{children}</>;
}