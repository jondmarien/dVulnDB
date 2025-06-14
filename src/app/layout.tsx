'use client';
import '@solana/wallet-adapter-react-ui/styles.css';
import React from 'react';
import './globals.css';
import { WalletProviderWrapper } from '@context/WalletProviderWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProviderWrapper>
          {/* DVulnDB Header will go here */}
          <div id="__dvulndb">
            {children}
          </div>
          {/* DVulnDB Footer will go here */}
        </WalletProviderWrapper>
      </body>
    </html>
  );
}
