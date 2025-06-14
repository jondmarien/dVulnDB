"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock wallet interface that matches Solana wallet adapter
interface MockWallet {
  publicKey: { toString: () => string } | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction?: () => Promise<void>;
  signAllTransactions?: () => Promise<void>;
}

interface MockWalletContextType {
  wallet: MockWallet;
  publicKey: { toString: () => string } | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  // Add mock methods that match useWallet hook
  select: (walletName: string) => void;
}

const MockWalletContext = createContext<MockWalletContextType | null>(null);

interface MockWalletProviderProps {
  children: ReactNode;
}

export const MockWalletProvider: React.FC<MockWalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  
  // Mock public key
  const mockPublicKey = connected ? { 
    toString: () => 'MockWallet123...abc' 
  } : null;

  const connect = async () => {
    setConnecting(true);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnected(true);
    setConnecting(false);
    console.log('🔗 Mock Wallet Connected!');
  };

  const disconnect = async () => {
    setDisconnecting(true);
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setConnected(false);
    setDisconnecting(false);
    console.log('📤 Mock Wallet Disconnected!');
  };

  const wallet: MockWallet = {
    publicKey: mockPublicKey,
    connected,
    connecting,
    disconnecting,
    connect,
    disconnect,
  };

  const contextValue: MockWalletContextType = {
    wallet,
    publicKey: mockPublicKey,
    connected,
    connecting,
    disconnecting,
    connect,
    disconnect,
    select: (walletName: string) => {
      console.log('🎭 Mock: Selected wallet:', walletName);
    },
    wallets: [
      { 
        adapter: { name: 'Mock Phantom', icon: '' },
        readyState: 'Installed'
      }
    ],
  };

  return (
    <MockWalletContext.Provider value={contextValue}>
      {children}
    </MockWalletContext.Provider>
  );
};

// Custom hook to use mock wallet (replaces useWallet from Solana)
export const useMockWallet = () => {
  const context = useContext(MockWalletContext);
  if (!context) {
    throw new Error('useMockWallet must be used within MockWalletProvider');
  }
  return context;
};

// Mock WalletMultiButton component for testing
export const MockWalletMultiButton: React.FC<{ className?: string }> = ({ className }) => {
  const { connected, connecting, connect, disconnect } = useMockWallet();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <button 
      className={`${className} px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors`}
      onClick={handleClick}
      disabled={connecting}
    >
      {connecting ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Connecting...
        </span>
      ) : connected ? (
        'MockWallet123...abc'
      ) : (
        'Connect Mock Wallet'
      )}
    </button>
  );
};
