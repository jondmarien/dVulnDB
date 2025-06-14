"use client";

import { useWallet } from '@context/MockWalletProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackRoute?: string;
  showToast?: boolean;
}

/**
 * Higher-Order Component for protecting routes that require wallet connection
 * Redirects to landing page if wallet is not connected
 * Allows access in mock mode even when disconnected for testing
 */
const ProtectedRoute = ({ 
  children, 
  fallbackRoute = '/', 
  showToast = true 
}: ProtectedRouteProps) => {
  const { connected, connecting } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if we're in mock mode
  const isMockMode = searchParams.get('mock') === 'true';

  useEffect(() => {
    // In mock mode, allow access even when disconnected so users can connect
    if (isMockMode) {
      console.log('🎭 ProtectedRoute: Mock mode detected, allowing access for wallet interaction');
      return;
    }
    
    // Only redirect if not connecting and not connected (real wallet mode only)
    if (!connecting && !connected) {
      console.log('🚫 ProtectedRoute: Wallet not connected, redirecting to:', fallbackRoute);
      
      if (showToast) {
        // Optional: Show toast notification
        // You can integrate with your toast system here
        console.log('💡 Please connect your wallet to access this page');
      }
      
      router.push(fallbackRoute);
    }
  }, [connected, connecting, router, fallbackRoute, showToast, isMockMode]);

  // Show loading state while connecting
  if (connecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  // In mock mode, always render content to allow wallet interaction
  if (isMockMode) {
    return <>{children}</>;
  }

  // If not connected and not connecting (real wallet mode), return null (redirect will happen)
  if (!connected) {
    return null;
  }

  // Wallet is connected, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
