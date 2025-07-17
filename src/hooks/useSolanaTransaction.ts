/**
 * Hook for handling Solana transactions with error handling
 */
import { useState, useCallback } from 'react';
import { Connection, TransactionInstruction } from '@solana/web3.js';
import { sendTransaction } from '../services/anchor/anchorUtils';
import { useSolanaError } from './useSolanaError';
import { useToast } from '../context/ToastContext';

interface UseSolanaTransactionResult {
  isLoading: boolean;
  txSignature: string | null;
  execute: (
    connection: Connection,
    instructions: TransactionInstruction[],
    signers?: any[]
  ) => Promise<string | null>;
  reset: () => void;
}

/**
 * Hook for handling Solana transactions with error handling
 * @returns Transaction execution utilities
 */
export function useSolanaTransaction(): UseSolanaTransactionResult {
  const [isLoading, setIsLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const { error, handleError, clearError } = useSolanaError();
  const { showToast } = useToast();
  
  const reset = useCallback(() => {
    setIsLoading(false);
    setTxSignature(null);
    clearError();
  }, [clearError]);
  
  const execute = useCallback(async (
    connection: Connection,
    instructions: TransactionInstruction[],
    signers: any[] = []
  ): Promise<string | null> => {
    setIsLoading(true);
    setTxSignature(null);
    clearError();
    
    try {
      showToast('Sending transaction...', 'loading');
      const signature = await sendTransaction(connection, instructions, signers);
      setTxSignature(signature);
      showToast('Transaction confirmed!', 'success');
      return signature;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showToast, handleError, clearError]);
  
  return {
    isLoading,
    txSignature,
    execute,
    reset
  };
}