import React, { ComponentType, useState } from 'react';
import { SolanaError, parseSolanaError } from '../../services/errors/solanaErrorUtils';
import SolanaErrorDisplay from './SolanaErrorDisplay';
import { useToast } from '../../context/ToastContext';

/**
 * Higher-order component that adds Solana error handling to a component
 * @param WrappedComponent The component to wrap
 * @returns A component with Solana error handling
 */
export function withSolanaErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function WithSolanaErrorHandling(props: P) {
    const [error, setError] = useState<SolanaError | null>(null);
    const { showToast } = useToast();
    
    const handleSolanaError = (err: any, txSignature?: string) => {
      const parsedError = parseSolanaError(err, txSignature);
      setError(parsedError);
      showToast(parsedError.userMessage, 'info');
      return parsedError;
    };
    
    const clearError = () => {
      setError(null);
    };
    
    const handleRetry = () => {
      clearError();
      // Additional retry logic can be implemented here
    };
    
    return (
      <>
        {error && (
          <SolanaErrorDisplay 
            error={error} 
            onClose={clearError} 
            onRetry={error.retryable ? handleRetry : undefined} 
          />
        )}
        <WrappedComponent 
          {...props} 
          handleSolanaError={handleSolanaError}
          clearSolanaError={clearError}
        />
      </>
    );
  };
}

// Type for components wrapped with Solana error handling
export interface WithSolanaErrorHandlingProps {
  handleSolanaError: (error: any, txSignature?: string) => SolanaError;
  clearSolanaError: () => void;
}