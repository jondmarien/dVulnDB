/**
 * Bounty Escrow Service
 * 
 * This service provides functions for interacting with the Bounty Escrow Anchor program
 * on the Solana blockchain.
 */

import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { 
  PROGRAM_IDS, 
  getConnectionAndProvider, 
  createProgram,
  sendTransaction
} from './anchorUtils';
import { SolanaNetwork, DEFAULT_NETWORK } from '../../../lib/network-config';

// Define a placeholder IDL until the actual IDL is available
// This will be replaced with the actual IDL once the Anchor programs are built
const bountyEscrowIdl: any = {
  version: "0.1.0",
  name: "bounty_escrow",
  instructions: [
    {
      name: "createBountyProgram",
      accounts: [
        { name: "bountyProgram", isMut: true, isSigner: true },
        { name: "creator", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "totalPool", type: "u64" },
        { name: "minSeverity", type: "string" }
      ]
    },
    {
      name: "fundBountyProgram",
      accounts: [
        { name: "bountyProgram", isMut: true, isSigner: false },
        { name: "funder", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "amount", type: "u64" }
      ]
    },
    {
      name: "approveBounty",
      accounts: [
        { name: "bountyProgram", isMut: true, isSigner: false },
        { name: "approver", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "vulnerabilityId", type: "publicKey" },
        { name: "amount", type: "u64" }
      ]
    },
    {
      name: "claimBounty",
      accounts: [
        { name: "bountyProgram", isMut: true, isSigner: false },
        { name: "claimer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "vulnerabilityId", type: "publicKey" }
      ]
    }
  ],
  accounts: [
    {
      name: "bountyProgram",
      type: {
        kind: "struct",
        fields: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "creator", type: "publicKey" },
          { name: "totalPool", type: "u64" },
          { name: "remainingPool", type: "u64" },
          { name: "minSeverity", type: "string" },
          { name: "status", type: "string" },
          { name: "createdAt", type: "i64" }
        ]
      }
    }
  ]
};

/**
 * Creates a new bounty program
 * @param name Bounty program name
 * @param description Bounty program description
 * @param totalPool Total bounty pool amount in lamports
 * @param minSeverity Minimum severity level for bounties
 * @param network Solana network
 * @returns Transaction signature
 */
export const createBountyProgram = async (
  name: string,
  description: string,
  totalPool: number,
  minSeverity: string,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<string> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.BOUNTY_ESCROW, bountyEscrowIdl, provider);
  
  // Generate a new keypair for the bounty program account
  const bountyProgramId = PublicKey.unique();
  
  // Create the bounty program
  const instruction = await program.methods
    .createBountyProgram(
      name,
      description,
      new BN(totalPool),
      minSeverity
    )
    .accounts({
      bountyProgram: bountyProgramId,
      creator: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  return await sendTransaction(connection, [instruction]);
};

/**
 * Funds an existing bounty program
 * @param bountyProgramId Bounty program ID
 * @param amount Amount to fund in lamports
 * @param network Solana network
 * @returns Transaction signature
 */
export const fundBountyProgram = async (
  bountyProgramId: PublicKey,
  amount: number,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<string> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.BOUNTY_ESCROW, bountyEscrowIdl, provider);
  
  // Fund the bounty program
  const instruction = await program.methods
    .fundBountyProgram(new BN(amount))
    .accounts({
      bountyProgram: bountyProgramId,
      funder: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  return await sendTransaction(connection, [instruction]);
};

/**
 * Approves a vulnerability for bounty payout
 * @param bountyProgramId Bounty program ID
 * @param vulnerabilityId Vulnerability ID
 * @param amount Amount to pay in lamports
 * @param network Solana network
 * @returns Transaction signature
 */
export const approveBounty = async (
  bountyProgramId: PublicKey,
  vulnerabilityId: PublicKey,
  amount: number,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<string> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.BOUNTY_ESCROW, bountyEscrowIdl, provider);
  
  // Approve the bounty
  const instruction = await program.methods
    .approveBounty(vulnerabilityId, new BN(amount))
    .accounts({
      bountyProgram: bountyProgramId,
      approver: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  return await sendTransaction(connection, [instruction]);
};

/**
 * Claims a bounty reward
 * @param bountyProgramId Bounty program ID
 * @param vulnerabilityId Vulnerability ID
 * @param network Solana network
 * @returns Transaction signature
 */
export const claimBounty = async (
  bountyProgramId: PublicKey,
  vulnerabilityId: PublicKey,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<string> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.BOUNTY_ESCROW, bountyEscrowIdl, provider);
  
  // Claim the bounty
  const instruction = await program.methods
    .claimBounty(vulnerabilityId)
    .accounts({
      bountyProgram: bountyProgramId,
      claimer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  return await sendTransaction(connection, [instruction]);
};

/**
 * Gets a bounty program's details
 * @param bountyProgramId Bounty program ID
 * @param network Solana network
 * @returns Bounty program details
 */
export const getBountyProgram = async (
  bountyProgramId: PublicKey,
  network: SolanaNetwork = DEFAULT_NETWORK
) => {
  const { provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.BOUNTY_ESCROW, bountyEscrowIdl, provider);
  
  // Fetch the bounty program account
  // @ts-ignore - We know this account exists in the IDL
  return await program.account.bountyProgram.fetch(bountyProgramId);
};