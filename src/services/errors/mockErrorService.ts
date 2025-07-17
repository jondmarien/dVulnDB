/**
 * Mock Error Service
 * 
 * This service provides mock Solana errors for testing in mock mode.
 */

import { createMockSolanaError, SOLANA_ERROR_CODES } from './solanaErrorUtils';

/**
 * Simulates a Solana error based on the provided parameters
 * @param operation The operation being performed (e.g., 'submit', 'validate')
 * @param shouldFail Whether the operation should fail (for testing)
 * @returns A mock error or null if shouldFail is false
 */
export function simulateSolanaError(operation: string, shouldFail: boolean = false) {
  if (!shouldFail) {
    return null;
  }
  
  // Map operations to likely error types for realistic simulation
  const errorMap: Record<string, keyof typeof SOLANA_ERROR_CODES> = {
    'connect': 'WalletConnectionRejected',
    'submit': 'InsufficientFundsForFee',
    'validate': 'Custom',
    'claim': 'AccountNotFound',
    'create': 'ComputeBudgetExceeded',
    'update': 'InvalidAccountData',
    'default': 'NetworkError'
  };
  
  const errorCode = errorMap[operation] || errorMap.default;
  return createMockSolanaError(errorCode);
}

/**
 * Simulates a random Solana error
 * @param probability Probability of error (0-1)
 * @returns A random mock error or null
 */
export function simulateRandomSolanaError(probability: number = 0.2) {
  if (Math.random() > probability) {
    return null;
  }
  
  const errorCodes = Object.keys(SOLANA_ERROR_CODES) as Array<keyof typeof SOLANA_ERROR_CODES>;
  const randomIndex = Math.floor(Math.random() * errorCodes.length);
  const randomErrorCode = errorCodes[randomIndex];
  
  return createMockSolanaError(randomErrorCode);
}

/**
 * Wraps a function with mock error simulation
 * @param fn The function to wrap
 * @param operation The operation being performed
 * @param errorProbability Probability of error (0-1)
 * @returns The wrapped function
 */
export function withMockErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  operation: string,
  errorProbability: number = 0.2
): T {
  return (async (...args: Parameters<T>) => {
    // Check if we're in mock mode
    const isMockMode = typeof window !== 'undefined' && 
      window.location.search.includes('mock=true');
    
    if (!isMockMode) {
      return fn(...args);
    }
    
    // Simulate error in mock mode
    const mockError = simulateRandomSolanaError(errorProbability);
    if (mockError) {
      throw mockError;
    }
    
    return fn(...args);
  }) as T;
}