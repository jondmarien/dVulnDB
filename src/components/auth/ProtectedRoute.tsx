"use client";

import { useSearchParams } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';
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
  const { isConnected } = useAppKitAccount();
  // The 'connecting' state from the old useWallet isn't directly available in useAppKitAccount.
  // If a pending state is crucial, we might need to use useAppKitWallet's isPending state.
  // For now, we'll proceed without a direct 'connecting' equivalent.
  const searchParams = useSearchParams();
  
  // Check if we're in mock mode
  const isMockMode = searchParams.get('mock') === 'true';

  useEffect(() => {
    // Log the current authentication state for debugging
    if (isMockMode) {
      console.log('🎭 ProtectedRoute: Mock mode detected, showing page for wallet interaction');
    } else if (!isConnected) {
      console.log('🔒 ProtectedRoute: Wallet not connected, showing page with connect options');
    } else if (isConnected) {
      console.log('✅ ProtectedRoute: Wallet connected, showing protected content');
    }
  }, [isConnected, isMockMode]);

  // For now, ProtectedRoute will always render its children.
  // Individual components/pages should use useAppKitAccount() to determine 
  // what to display based on connection status and mock mode.
  return <>{children}</>;
};

export default ProtectedRoute;
