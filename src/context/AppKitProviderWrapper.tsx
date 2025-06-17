'use client';

import React, { useEffect, useState } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaDevnet, solanaTestnet } from '@reown/appkit/networks';

// Ensure this component is only rendered on the client
export function AppKitProviderWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
      if (!projectId) {
        console.error('Reown Project ID is undefined. Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your .env.local file.');
        return;
      }

      const metadata = {
        name: 'DVulnDB',
        description: 'Decentralized Vulnerability Database',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://dvulndb.com',
        icons: typeof window !== 'undefined' ? [new URL('/logo.png', window.location.origin).toString()] : ['/logo.png'],
      };

      const solanaWeb3JsAdapter = new SolanaAdapter();

      try {
        createAppKit({
          projectId,
          metadata,
          networks: [solanaDevnet, solana],
          adapters: [solanaWeb3JsAdapter],
          themeVariables: {
            '--w3m-font-family': 'monospace',
            '--w3m-z-index': '1000',
          },
          modalOptions: {
            themeMode: 'dark',
            privacyPolicyUrl: `${metadata.url}/legal/privacy`,
            termsOfServiceUrl: `${metadata.url}/legal/terms`,
          }
        });
        console.log('AppKit initialized successfully.');
      } catch (error) {
        console.error('Failed to initialize AppKit:', error);
      }
    }
  }, [isClient]);

  if (!isClient) {
    // Render nothing or a loading indicator on the server
    return null;
  }

  return <>{children}</>;
}
