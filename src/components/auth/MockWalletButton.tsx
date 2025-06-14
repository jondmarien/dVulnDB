"use client";

import { useMockWallet } from '@context/MockWalletProvider';

interface MockWalletButtonProps {
  className?: string;
}

/**
 * Mock Wallet Button that mimics WalletMultiButton behavior
 * Only works when app is in mock mode (?mock=true)
 */
export const MockWalletButton: React.FC<MockWalletButtonProps> = ({ className }) => {
  const { connected, connecting, connect, disconnect, publicKey } = useMockWallet();

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
      // Truncate the mock public key like real wallets do
      const key = publicKey.toString();
      return `${key.slice(0, 4)}...${key.slice(-4)}`;
    }
    return 'Connect Mock Wallet';
  };

  const getButtonStyle = () => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
    
    if (connecting) {
      return `${baseClasses} bg-purple-600 text-white cursor-not-allowed opacity-50`;
    }
    
    if (connected) {
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white border border-green-500`;
    }
    
    return `${baseClasses} bg-purple-600 hover:bg-purple-700 text-white border border-purple-500 hover:scale-105`;
  };

  return (
    <button 
      className={`${getButtonStyle()} ${className || ''}`}
      onClick={handleClick}
      disabled={connecting}
      title={connected ? 'Click to disconnect' : 'Click to connect mock wallet'}
    >
      {connecting && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      <span>{getButtonText()}</span>
      {connected && (
        <span className="text-green-300 text-xs">●</span>
      )}
    </button>
  );
};
