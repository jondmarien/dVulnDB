'use client';
import '@solana/wallet-adapter-react-ui/styles.css';
import React from 'react';
import './globals.css';
import { WalletProviderWrapper } from '@context/WalletProviderWrapper';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

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
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
