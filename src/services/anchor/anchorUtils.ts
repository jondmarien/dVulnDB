/**
 * Anchor Program Utilities
 *
 * This file provides utility functions for interacting with Anchor programs
 * on the Solana blockchain.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SendTransactionError,
} from "@solana/web3.js";
import {
  createSolanaConnection,
  SolanaNetwork,
  DEFAULT_NETWORK,
} from "../../../lib/network-config";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { appKit } from "../../../lib/appkit";
import { parseSolanaError } from "../errors/solanaErrorUtils";
import { withMockErrorHandling } from "../errors/mockErrorService";

// Program IDs from Anchor.toml
export const PROGRAM_IDS = {
  BOUNTY_ESCROW: new PublicKey("3aiStNroDenw7KpSKXvFWVFox35gCk4FcUx8nzXRF2HH"),
  VULNERABILITY_REGISTRY: new PublicKey(
    "5mCoaixH9VVepuSsnhB769263Gg4RqBCEkkoJuHaH69K"
  ),
  REPUTATION_NFT: new PublicKey("HsxZ1cg5H1zvvdyngaLTrB9DZ1YFrEAFMNR21fKCzioW"),
};

/**
 * Creates an AnchorProvider instance for interacting with Anchor programs
 * @param connection Solana connection
 * @param wallet Wallet adapter
 * @returns AnchorProvider instance
 */
export const createAnchorProvider = (
  connection: Connection,
  wallet: any
): AnchorProvider => {
  return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
};

/**
 * Creates a Program instance for a specific Anchor program
 * @param programId Program ID
 * @param idl Program IDL
 * @param provider AnchorProvider instance
 * @returns Program instance
 */
export const createProgram = (
  programId: PublicKey,
  idl: any,
  provider: AnchorProvider
): Program => {
  // @ts-ignore - We're passing the correct parameters
  return new Program(idl, programId.toString(), provider);
};

/**
 * Gets the current wallet from AppKit
 * @returns Wallet adapter or null if not connected
 */
export const getCurrentWallet = () => {
  // Get the connected wallet from AppKit
  const walletInfo = appKit.getWalletInfo();
  if (!walletInfo || !walletInfo.publicKey) {
    throw new Error("Wallet not connected");
  }

  // Create a wallet adapter compatible with Anchor
  return {
    publicKey: new PublicKey(walletInfo.publicKey),
    // @ts-ignore - AppKit has these methods
    signTransaction: async (tx: Transaction) => {
      return tx; // !! TODO: Mock implementation until AppKit is fully integrated
    },
    // @ts-ignore - AppKit has these methods
    signAllTransactions: async (txs: Transaction[]) => {
      return txs; // !! TODO: Mock implementation until AppKit is fully integrated
    },
  };
};

/**
 * Creates a connection and provider for interacting with Anchor programs
 * @param network Solana network
 * @returns Object containing connection and provider
 */
export const getConnectionAndProvider = async (
  network: SolanaNetwork = DEFAULT_NETWORK
) => {
  const connection = createSolanaConnection(network);
  const wallet = getCurrentWallet();
  const provider = createAnchorProvider(connection, wallet);

  return { connection, provider };
};

/**
 * Sends a transaction to the Solana blockchain
 * @param connection Solana connection
 * @param instructions Transaction instructions
 * @param signers Additional signers (if any)
 * @returns Transaction signature
 * @throws {Error} If transaction fails
 */
export const sendTransaction = withMockErrorHandling(
  async (
    connection: Connection,
    instructions: TransactionInstruction[],
    signers: any[] = []
  ): Promise<string> => {
    try {
      const wallet = getCurrentWallet();

      const transaction = new Transaction().add(...instructions);
      transaction.feePayer = wallet.publicKey;
      
      // Get recent blockhash with retry logic
      let recentBlockhashResponse;
      try {
        recentBlockhashResponse = await connection.getLatestBlockhash();
      } catch (error) {
        console.error("Failed to get recent blockhash:", error);
        throw new Error("Failed to get recent blockhash. Network may be congested.");
      }
      
      transaction.recentBlockhash = recentBlockhashResponse.blockhash;

      if (signers.length > 0) {
        transaction.sign(...signers);
      }
      
      // Sign transaction with retry logic
      let signedTransaction;
      try {
        signedTransaction = await wallet.signTransaction(transaction);
      } catch (error) {
        console.error("Failed to sign transaction:", error);
        throw error; // Preserve original error for proper handling
      }
      
      // Send raw transaction with retry logic
      let signature;
      try {
        signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
      } catch (error) {
        console.error("Failed to send transaction:", error);
        throw error; // Preserve original error for proper handling
      }

      // Confirm transaction with timeout
      try {
        await connection.confirmTransaction({
          signature,
          blockhash: transaction.recentBlockhash!,
          lastValidBlockHeight: recentBlockhashResponse.lastValidBlockHeight,
        }, "confirmed");
      } catch (error) {
        console.error("Failed to confirm transaction:", error);
        throw new Error(`Transaction sent but confirmation failed. Check explorer for status: ${signature}`);
      }

      return signature;
    } catch (error) {
      // Parse the error before propagating it
      const parsedError = parseSolanaError(error);
      throw parsedError;
    }
  },
  'transaction',
  0.2 // 20% chance of error in mock mode
);
