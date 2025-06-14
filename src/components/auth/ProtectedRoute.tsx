"use client";

import { useWallet } from '@context/MockWalletProvider';
import { useSearchParams } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Higher-Order Component for protecting routes that require wallet connection
 * Allows access in mock mode even when disconnected for testing
 */
const ProtectedRoute = ({ 
  children 
}: ProtectedRouteProps) => {
  const { connected, connecting } = useWallet();
  const searchParams = useSearchParams();
  
  // Check if we're in mock mode
  const isMockMode = searchParams.get('mock') === 'true';

  useEffect(() => {
    // Log the current authentication state for debugging
    if (isMockMode) {
      console.log('🎭 ProtectedRoute: Mock mode detected, showing page for wallet interaction');
    } else if (!connected && !connecting) {
      console.log('🔒 ProtectedRoute: Wallet not connected, showing page with connect options');
    } else if (connected) {
      console.log('✅ ProtectedRoute: Wallet connected, showing protected content');
    }
  }, [connected, connecting, isMockMode]);

  // Show loading state while connecting
  if (connecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400 font-mono">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  // Always render the children - let the individual page components handle authentication state
  // This allows users to see the page and connect their wallet
  return <>{children}</>;
};

export default ProtectedRoute;
