'use client';
import React from 'react';
import './globals.css';
import { AppKitProviderWrapper } from '@context/AppKitProviderWrapper';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppKitProviderWrapper>
          {/* DVulnDB Header will go here */}
          <div id="__dvulndb">
            {children}
          </div>
          {/* DVulnDB Footer will go here */}
        </AppKitProviderWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
