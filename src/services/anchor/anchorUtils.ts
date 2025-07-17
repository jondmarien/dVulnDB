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
} from "@solana/web3.js";
import {
  createSolanaConnection,
  SolanaNetwork,
  DEFAULT_NETWORK,
} from "../../../lib/network-config";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { appKit } from "../../../lib/appkit";

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
 */
export const sendTransaction = async (
  connection: Connection,
  instructions: TransactionInstruction[],
  signers: any[] = []
): Promise<string> => {
  const wallet = getCurrentWallet();

  const transaction = new Transaction().add(...instructions);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  if (signers.length > 0) {
    transaction.sign(...signers);
  }
  const signedTransaction = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  );

  // Use the newer version of confirmTransaction
  await connection.confirmTransaction({
    signature,
    blockhash: transaction.recentBlockhash!,
    lastValidBlockHeight: (
      await connection.getLatestBlockhash()
    ).lastValidBlockHeight,
  });

  return signature;
};
