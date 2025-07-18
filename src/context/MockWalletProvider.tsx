"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  WalletContextState, 
  useWallet as useSolanaWallet
} from '@solana/wallet-adapter-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Create a context that overrides the Solana wallet context
const MockWalletContext = createContext<WalletContextState | null>(null);

interface MockWalletProviderProps {
  children: ReactNode;
}

export const MockWalletProvider: React.FC<MockWalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  
  // Mock public key with persistence
  const mockPublicKey = connected ? new PublicKey('11111111111111111111111111111112') : null;

  const connect = async () => {
    if (connected) return;
    setConnecting(true);
    console.log('🎭 Mock Wallet: Connecting...');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setConnected(true);
    setConnecting(false);
    console.log('🔗 Mock Wallet: Connected!');
  };

  const disconnect = async () => {
    if (!connected) return;
    setDisconnecting(true);
    console.log('🎭 Mock Wallet: Disconnecting...');
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setConnected(false);
    setDisconnecting(false);
    console.log('📤 Mock Wallet: Disconnected!');
  };

  // Create a reusable mock adapter object
  const createMockAdapter = () => {
    const adapter = {
      name: 'Mock Phantom' as WalletName,
      url: 'https://phantom.app/',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+',
      supportedTransactionVersions: null,
      autoConnect: async () => {}, // Function for adapter
      publicKey: mockPublicKey,
      connected,
      connecting,
      readyState: WalletReadyState.Installed,
      connect,
      disconnect,
      sendTransaction: async () => 'mock-signature',
      signTransaction: async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> => transaction,
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => txs,
      signMessage: async () => new Uint8Array(64),
      signIn: async () => ({ 
        account: { 
          address: mockPublicKey!.toBase58(), 
          publicKey: new Uint8Array(mockPublicKey!.toBytes()),
          chains: ['solana:devnet'],
          features: ['solana:signTransaction', 'solana:signMessage']
        }, 
        signedMessage: new Uint8Array(0), 
        signature: new Uint8Array(64) 
      }),
      // EventEmitter methods - return adapter instance for chaining
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      on: (_event: any, _fn: any) => adapter,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      off: (_event: any, _fn: any) => adapter,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      emit: (_event: any, ..._args: any[]) => true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      removeAllListeners: (_event?: any) => adapter,
      // Additional EventEmitter methods required by SignerWalletAdapter
      eventNames: () => [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      listeners: (_event: any) => [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      listenerCount: (_event: any) => 0,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      addListener: (_event: any, _fn: any) => adapter,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      removeListener: (_event: any, _fn: any) => adapter,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      once: (_event: any, _fn: any) => adapter,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      prependListener: (_event: any, _fn: any) => adapter,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      prependOnceListener: (_event: any, _fn: any) => adapter
    };
    return adapter;
  };

  // Create mock wallet context that matches WalletContextState interface
  const mockWalletContextState: WalletContextState = {
    autoConnect: false, // Boolean for WalletContextState
    wallets: [{
      adapter: createMockAdapter(),
      readyState: WalletReadyState.Installed
    }],
    wallet: connected ? {
      adapter: createMockAdapter(),
      readyState: WalletReadyState.Installed
    } : null,
    publicKey: mockPublicKey,
    connected,
    connecting,
    disconnecting,
    select: (walletName: WalletName | null) => {
      console.log('🎭 Mock: Selected wallet:', walletName);
    },
    connect,
    disconnect,
    sendTransaction: async () => 'mock-signature',
    signTransaction: async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> => transaction,
    signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => txs,
    signMessage: async () => new Uint8Array(64),
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

// Override useWallet hook to return mock wallet context when available
export const useWallet = (): WalletContextState => {
  const mockContext = useContext(MockWalletContext);
  const realContext = useSolanaWallet();
  
  // Check if we're in mock mode via URL parameter
  const isMockMode = typeof window !== 'undefined' && window.location.search.includes('mock=true');
  
  // Return mock context if available AND we're in mock mode, otherwise real context
  if (mockContext && isMockMode) {
    // Only log occasionally to reduce console spam
    if (Math.random() < 0.01) { // Log ~1% of the time
      console.log('🎭 Using Mock Wallet Context - Connected:', mockContext.connected);
    }
    return mockContext;
  }
  
  // Only log occasionally to reduce console spam
  if (Math.random() < 0.01) { // Log ~1% of the time
    console.log('🔗 Using Real Solana Wallet Context - Connected:', realContext.connected);
  }
  return realContext;
};

// Export for backward compatibility
export const useMockWallet = () => {
  const context = useContext(MockWalletContext);
  if (!context) {
    throw new Error('useMockWallet must be used within MockWalletProvider');
  }
  return context;
};

// Mock WalletMultiButton component for testing
export const MockWalletMultiButton: React.FC<{ className?: string }> = ({ className }) => {
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
    return 'Connect Mock Wallet';
  };

  return (
    <button 
      className={`${className} px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors`}
      onClick={handleClick}
      disabled={connecting}
    >
      {connecting && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
      )}
      {getButtonText()}
    </button>
  );
};
