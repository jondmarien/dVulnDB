"use client";
import React, { createContext, useContext, useState } from "react";

interface WalletInfo {
  address: string;
  balance: string;
}

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletInfo: WalletInfo | null;
  connectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  const connectWallet = () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);
    // Simulate connection steps
    setTimeout(() => {
      // Step 1: Connecting...
      setTimeout(() => {
        // Step 2: Authenticating...
        setTimeout(() => {
          // Step 3: Connected!
          setIsConnected(true);
          setIsConnecting(false);
          setWalletInfo({
            address: "0x742...1234",
            balance: "12.5 SOL",
          });
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <WalletContext.Provider value={{ isConnected, isConnecting, walletInfo, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
}; 