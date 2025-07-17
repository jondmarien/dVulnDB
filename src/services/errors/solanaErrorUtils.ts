/**
 * Solana Error Utilities
 * 
 * This file provides utilities for handling Solana-specific errors
 * and formatting them in a user-friendly way.
 */

import { SendTransactionError } from '@solana/web3.js';

// Common Solana error codes and their user-friendly messages
export const SOLANA_ERROR_CODES = {
  // Transaction errors
  'TransactionExpiredBlockheightExceeded': 'Transaction expired. Please try again.',
  'BlockhashNotFound': 'Transaction expired. Please try again.',
  'InsufficientFundsForFee': 'Insufficient SOL for transaction fee. Please add more SOL to your wallet.',
  'InsufficientFundsForRent': 'Insufficient SOL for account rent. Please add more SOL to your wallet.',
  'InvalidAccountData': 'Invalid account data. Please check your inputs and try again.',
  'AccountNotFound': 'Account not found. The program account may not be initialized.',
  'SignatureVerificationFailed': 'Signature verification failed. Please try again.',
  
  // Program errors
  'Custom': 'Program error. Please check your inputs and try again.',
  'InvalidInstructionData': 'Invalid instruction data. Please check your inputs.',
  'InvalidArgument': 'Invalid argument provided to the program.',
  'ComputeBudgetExceeded': 'Compute budget exceeded. Try simplifying your transaction.',
  
  // Wallet errors
  'WalletNotConnected': 'Wallet not connected. Please connect your wallet and try again.',
  'WalletConnectionRejected': 'Wallet connection rejected. Please approve the connection request.',
  'WalletSignatureRejected': 'Transaction signing rejected. Please approve the transaction in your wallet.',
  
  // Network errors
  'NetworkError': 'Network error. Please check your internet connection and try again.',
  'RpcError': 'RPC error. The Solana network may be congested. Please try again later.',
  
  // Default error
  'Default': 'An error occurred. Please try again later.'
};

// Error type for structured error handling
export interface SolanaError {
  code: string;
  message: string;
  userMessage: string;
  txSignature?: string;
  retryable: boolean;
  logs?: string[];
}

/**
 * Parses a Solana error and returns a structured error object
 * @param error The error to parse
 * @param txSignature Optional transaction signature
 * @returns Structured error object
 */
export function parseSolanaError(error: any, txSignature?: string): SolanaError {
  // Default error structure
  const defaultError: SolanaError = {
    code: 'Default',
    message: error?.message || 'Unknown error',
    userMessage: SOLANA_ERROR_CODES.Default,
    txSignature,
    retryable: true,
    logs: error?.logs || []
  };

  // Handle SendTransactionError specifically
  if (error instanceof SendTransactionError) {
    const logs = error.logs || [];
    
    // Check for common error patterns in logs
    if (logs.some(log => log.includes('InsufficientFundsForFee'))) {
      return {
        code: 'InsufficientFundsForFee',
        message: error.message,
        userMessage: SOLANA_ERROR_CODES.InsufficientFundsForFee,
        txSignature,
        retryable: false,
        logs
      };
    }
    
    if (logs.some(log => log.includes('BlockhashNotFound'))) {
      return {
        code: 'BlockhashNotFound',
        message: error.message,
        userMessage: SOLANA_ERROR_CODES.BlockhashNotFound,
        txSignature,
        retryable: true,
        logs
      };
    }
    
    // Check for program errors (Custom program error)
    const programErrorMatch = logs.find(log => log.includes('Program log: Error:'));
    if (programErrorMatch) {
      return {
        code: 'Custom',
        message: programErrorMatch,
        userMessage: `Program error: ${programErrorMatch.split('Program log: Error:')[1]?.trim() || 'Unknown program error'}`,
        txSignature,
        retryable: true,
        logs
      };
    }
  }
  
  // Handle wallet connection errors
  if (error?.message?.includes('Wallet not connected')) {
    return {
      code: 'WalletNotConnected',
      message: error.message,
      userMessage: SOLANA_ERROR_CODES.WalletNotConnected,
      txSignature,
      retryable: true
    };
  }
  
  // Handle signature rejection
  if (error?.message?.includes('User rejected')) {
    return {
      code: 'WalletSignatureRejected',
      message: error.message,
      userMessage: SOLANA_ERROR_CODES.WalletSignatureRejected,
      txSignature,
      retryable: true
    };
  }
  
  // Handle network errors
  if (error?.message?.includes('Failed to fetch') || error?.message?.includes('Network request failed')) {
    return {
      code: 'NetworkError',
      message: error.message,
      userMessage: SOLANA_ERROR_CODES.NetworkError,
      txSignature,
      retryable: true
    };
  }
  
  // Handle RPC errors
  if (error?.message?.includes('RPC') || error?.message?.includes('429') || error?.message?.includes('503')) {
    return {
      code: 'RpcError',
      message: error.message,
      userMessage: SOLANA_ERROR_CODES.RpcError,
      txSignature,
      retryable: true
    };
  }
  
  return defaultError;
}

/**
 * Gets a Solana Explorer URL for a transaction
 * @param signature Transaction signature
 * @param network Solana network (mainnet-beta, testnet, devnet)
 * @returns Solana Explorer URL
 */
export function getSolanaExplorerUrl(signature: string, network: string = 'devnet'): string {
  const baseUrl = 'https://explorer.solana.com';
  const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
  return `${baseUrl}/tx/${signature}${cluster}`;
}

/**
 * Creates a mock Solana error for testing in mock mode
 * @param errorCode Error code to simulate
 * @returns Simulated error object
 */
export function createMockSolanaError(errorCode: keyof typeof SOLANA_ERROR_CODES): SolanaError {
  const mockSignature = 'mock' + Math.random().toString(36).substring(2, 15);
  
  return {
    code: errorCode,
    message: `Mock error: ${errorCode}`,
    userMessage: SOLANA_ERROR_CODES[errorCode] || SOLANA_ERROR_CODES.Default,
    txSignature: mockSignature,
    retryable: errorCode !== 'InsufficientFundsForFee' && errorCode !== 'WalletSignatureRejected',
    logs: [`Program log: Mock ${errorCode} error`]
  };
}