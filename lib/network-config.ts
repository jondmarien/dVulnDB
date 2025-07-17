/**
 * Solana Network Configuration
 * 
 * This file centralizes all Solana network configurations including RPC endpoints,
 * fallback providers, and network switching logic.
 */

import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';

// Network types
export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
export type SolanaNetworkConfig = {
  name: string;
  id: SolanaNetwork;
  endpoint: string;
  fallbacks: string[];
  explorerUrl: string;
  solscanUrl: string;
};

// RPC endpoint configuration with fallbacks
export const SOLANA_NETWORKS: Record<SolanaNetwork, SolanaNetworkConfig> = {
  'mainnet-beta': {
    name: 'Mainnet',
    id: 'mainnet-beta',
    endpoint: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com',
    fallbacks: [
      'https://solana-mainnet.g.alchemy.com/v2/demo',
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com'
    ],
    explorerUrl: 'https://explorer.solana.com',
    solscanUrl: 'https://solscan.io'
  },
  'devnet': {
    name: 'Devnet',
    id: 'devnet',
    endpoint: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL || 'https://api.devnet.solana.com',
    fallbacks: [
      'https://api.devnet.solana.com',
      'https://devnet.genesysgo.net'
    ],
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    solscanUrl: 'https://solscan.io/?cluster=devnet'
  },
  'testnet': {
    name: 'Testnet',
    id: 'testnet',
    endpoint: process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL || 'https://api.testnet.solana.com',
    fallbacks: [
      'https://api.testnet.solana.com'
    ],
    explorerUrl: 'https://explorer.solana.com/?cluster=testnet',
    solscanUrl: 'https://solscan.io/?cluster=testnet'
  },
  'localnet': {
    name: 'Localnet',
    id: 'localnet',
    endpoint: 'http://localhost:8899',
    fallbacks: [],
    explorerUrl: 'https://explorer.solana.com/?cluster=custom',
    solscanUrl: 'https://solscan.io'
  }
};

// Default network
export const DEFAULT_NETWORK: SolanaNetwork = 'devnet';

/**
 * Creates a Solana connection with fallback support
 * @param network The Solana network to connect to
 * @returns A Connection instance
 */
export function createSolanaConnection(network: SolanaNetwork = DEFAULT_NETWORK): Connection {
  const networkConfig = SOLANA_NETWORKS[network];
  return new Connection(networkConfig.endpoint, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: false,
    confirmTransactionInitialTimeout: 60000 // 60 seconds
  });
}

/**
 * Get transaction explorer URL
 * @param signature Transaction signature
 * @param network Solana network
 * @param explorer Explorer type ('solana' or 'solscan')
 * @returns Explorer URL for the transaction
 */
export function getExplorerUrl(
  signature: string,
  network: SolanaNetwork = DEFAULT_NETWORK,
  explorer: 'solana' | 'solscan' = 'solana'
): string {
  const networkConfig = SOLANA_NETWORKS[network];
  
  if (explorer === 'solana') {
    return `${networkConfig.explorerUrl}/tx/${signature}`;
  } else {
    return `${networkConfig.solscanUrl}/tx/${signature}`;
  }
}

/**
 * Get all available RPC endpoints for a network including fallbacks
 * @param network Solana network
 * @returns Array of RPC endpoints
 */
export function getAllRpcEndpoints(network: SolanaNetwork = DEFAULT_NETWORK): string[] {
  const networkConfig = SOLANA_NETWORKS[network];
  return [networkConfig.endpoint, ...networkConfig.fallbacks];
}

/**
 * Checks if an RPC endpoint is responsive
 * @param endpoint RPC endpoint URL
 * @returns Promise resolving to boolean indicating if endpoint is responsive
 */
export async function isRpcEndpointResponsive(endpoint: string): Promise<boolean> {
  try {
    const connection = new Connection(endpoint, 'confirmed');
    await connection.getVersion();
    return true;
  } catch (error) {
    console.error(`RPC endpoint ${endpoint} is not responsive:`, error);
    return false;
  }
}

/**
 * Finds the first responsive RPC endpoint from a list
 * @param network Solana network
 * @returns Promise resolving to a responsive RPC endpoint or null if none found
 */
export async function findResponsiveRpcEndpoint(network: SolanaNetwork = DEFAULT_NETWORK): Promise<string | null> {
  const endpoints = getAllRpcEndpoints(network);
  
  for (const endpoint of endpoints) {
    if (await isRpcEndpointResponsive(endpoint)) {
      return endpoint;
    }
  }
  
  return null;
}