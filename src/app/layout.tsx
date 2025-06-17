'use client';
import React from 'react';
import './globals.css';
import { AppKitProviderWrapper } from '@context/AppKitProviderWrapper';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { JetBrains_Mono } from 'next/font/google';

const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrains_mono.variable}>
      <body className={jetbrains_mono.variable}>
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
