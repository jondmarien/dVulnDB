"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackRoute?: string;
  showToast?: boolean;
}

/**
 * Higher-Order Component for protecting routes that require wallet connection
 * Redirects to landing page if wallet is not connected
 */
const ProtectedRoute = ({ 
  children, 
  fallbackRoute = '/', 
  showToast = true 
}: ProtectedRouteProps) => {
  const { connected, connecting } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not connecting and not connected
    if (!connecting && !connected) {
      console.log('🚫 ProtectedRoute: Wallet not connected, redirecting to:', fallbackRoute);
      
      if (showToast) {
        // Optional: Show toast notification
        // You can integrate with your toast system here
        console.log('💡 Please connect your wallet to access this page');
      }
      
      router.push(fallbackRoute);
    }
  }, [connected, connecting, router, fallbackRoute, showToast]);

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

  // If not connected and not connecting, return null (redirect will happen)
  if (!connected) {
    return null;
  }

  // Wallet is connected, render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
