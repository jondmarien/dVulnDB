/**
 * Hook for handling Solana errors
 */
import { useState, useCallback } from 'react';
import { SolanaError, parseSolanaError } from '../services/errors/solanaErrorUtils';
import { useToast } from '../context/ToastContext';

interface UseSolanaErrorResult {
  error: SolanaError | null;
  setError: (error: any, txSignature?: string) => void;
  clearError: () => void;
  handleError: (error: any, txSignature?: string) => void;
  isError: boolean;
}

/**
 * Hook for handling Solana errors
 * @returns Error handling utilities
 */
export function useSolanaError(): UseSolanaErrorResult {
  const [error, setErrorState] = useState<SolanaError | null>(null);
  const { showToast } = useToast();
  
  const setError = useCallback((err: any, txSignature?: string) => {
    const parsedError = parseSolanaError(err, txSignature);
    setErrorState(parsedError);
    return parsedError;
  }, []);
  
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);
  
  const handleError = useCallback((err: any, txSignature?: string) => {
    const parsedError = setError(err, txSignature);
    showToast(parsedError.userMessage, 'info');
    console.error('Solana error:', parsedError);
  }, [setError, showToast]);
  
  return {
    error,
    setError,
    clearError,
    handleError,
    isError: error !== null
  };
}