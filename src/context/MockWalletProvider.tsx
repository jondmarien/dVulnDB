"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Define the wallet context state interface for Solana-only operations
interface MockWalletContextState {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>;
  signAllTransactions: <T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>;
  sendTransaction: (transaction: Transaction | VersionedTransaction) => Promise<string>;
  // Solana-specific methods
  signIn?: () => Promise<{
    account: {
      address: string;
      publicKey: Uint8Array;
      chains: string[];
      features: string[];
    };
    signedMessage: Uint8Array;
    signature: Uint8Array;
  }>;
}

// Create a context for the mock wallet
const MockWalletContext = createContext<MockWalletContextState | null>(null);

interface MockWalletProviderProps {
  children: ReactNode;
}

export const MockWalletProvider: React.FC<MockWalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  
  // Mock Solana public key with persistence
  const mockPublicKey = connected ? new PublicKey('11111111111111111111111111111112') : null;

  const connect = async () => {
    if (connected) return;
    setConnecting(true);
    console.log('🎭 Mock Solana Wallet: Connecting...');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setConnected(true);
    setConnecting(false);
    console.log('🔗 Mock Solana Wallet: Connected!');
  };

  const disconnect = async () => {
    if (!connected) return;
    setDisconnecting(true);
    console.log('🎭 Mock Solana Wallet: Disconnecting...');
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setConnected(false);
    setDisconnecting(false);
    console.log('📤 Mock Solana Wallet: Disconnected!');
  };

  // Mock Solana-specific wallet context state
  const mockWalletContextState: MockWalletContextState = {
    publicKey: mockPublicKey,
    connected,
    connecting,
    disconnecting,
    connect,
    disconnect,
    signMessage: async () => new Uint8Array(64),
    signTransaction: async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> => {
      console.log('🎭 Mock Solana Wallet: Signing transaction');
      return transaction;
    },
    signAllTransactions: async <T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> => {
      console.log(`🎭 Mock Solana Wallet: Signing ${transactions.length} transactions`);
      return transactions;
    },
    sendTransaction: async () => {
      console.log('🎭 Mock Solana Wallet: Sending transaction');
      return '5srKiI5VTv4sGAuJif8pPVvaFQNJezGjv8LkvV9NsKFNrKJLGbv1L4LdLqNGG6NfXNKg8ZqzKG1aCQYwYWQvRJqZ'; // Mock Solana signature format
    },
    // Solana-specific sign in method
    signIn: async () => ({ 
      account: { 
        address: mockPublicKey!.toBase58(), 
        publicKey: new Uint8Array(mockPublicKey!.toBytes()),
        chains: ['solana:devnet'],
        features: ['solana:signTransaction', 'solana:signMessage']
      }, 
      signedMessage: new Uint8Array(0), 
      signature: new Uint8Array(64) 
    })
  };

  return (
    <MockWalletContext.Provider value={mockWalletContextState}>
      {children}
    </MockWalletContext.Provider>
  );
};

// Hook to use the mock wallet context
export const useWallet = (): MockWalletContextState => {
  const context = useContext(MockWalletContext);
  
  // Check if we're in mock mode via URL parameter
  const isMockMode = typeof window !== 'undefined' && window.location.search.includes('mock=true');
  
  if (!context && isMockMode) {
    throw new Error('useWallet must be used within MockWalletProvider when in mock mode');
  }
  
  // Return mock context if available AND we're in mock mode
  if (context && isMockMode) {
    if (Math.random() < 0.01) { // Log ~1% of the time to reduce console spam
      console.log('🎭 Using Mock Solana Wallet Context - Connected:', context.connected);
    }
    return context;
  }
  
  // Return a default context when not in mock mode
  // This should never happen in practice as the hook should only be used in mock mode
  return {
    publicKey: null,
    connected: false,
    connecting: false,
    disconnecting: false,
    connect: async () => { console.error('Not in mock mode'); },
    disconnect: async () => { console.error('Not in mock mode'); },
    signMessage: async () => new Uint8Array(0),
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
    sendTransaction: async () => ''
  };
};

// Mock WalletButton component for testing - Solana-styled
export const MockWalletButton: React.FC<{ className?: string }> = ({ className }) => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  const getButtonText = () => {
    if (connecting) return 'Connecting...';
    if (connected && publicKey) {
      const key = publicKey.toString();
      return `${key.slice(0, 4)}...${key.slice(-4)}`;
    }
    return 'Connect Phantom';
  };

  return (
    <button 
      className={`${className || ''} wallet-connect-btn ${connected ? 'connected' : ''}`}
      onClick={handleClick}
      disabled={connecting}
    >
      <div className="custom-wallet-display">
        <span className="wallet-arrow">{'>'}</span>
        <span>&nbsp;</span>
        {connecting ? (
          <span>Connecting...</span>
        ) : connected ? (
          <span>{getButtonText()}</span>
        ) : (
          <span>Connect Phantom</span>
        )}
      </div>
    </button>
  );
};