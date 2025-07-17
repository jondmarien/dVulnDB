/**
 * Reputation NFT Service
 * 
 * This service provides functions for interacting with the Reputation NFT Anchor program
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
const reputationNftIdl: any = {
  version: "0.1.0",
  name: "reputation_nft",
  instructions: [
    {
      name: "createResearcherProfile",
      accounts: [
        { name: "nftMint", isMut: true, isSigner: true },
        { name: "owner", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "username", type: "string" },
        { name: "specializations", type: { vec: "string" } },
        { name: "metadataUri", type: "string" }
      ]
    },
    {
      name: "updateReputation",
      accounts: [
        { name: "nftMint", isMut: true, isSigner: false },
        { name: "updater", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "reputationChange", type: "i64" },
        { name: "reason", type: "string" }
      ]
    },
    {
      name: "awardBadge",
      accounts: [
        { name: "nftMint", isMut: true, isSigner: false },
        { name: "awarder", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "badgeName", type: "string" },
        { name: "badgeDescription", type: "string" },
        { name: "badgeImageUri", type: "string" }
      ]
    }
  ],
  accounts: [
    {
      name: "researcherProfile",
      type: {
        kind: "struct",
        fields: [
          { name: "username", type: "string" },
          { name: "owner", type: "publicKey" },
          { name: "reputation", type: "i64" },
          { name: "specializations", type: { vec: "string" } },
          { name: "vulnerabilitiesFound", type: "u32" },
          { name: "totalEarnings", type: "u64" },
          { name: "joinedAt", type: "i64" }
        ]
      }
    },
    {
      name: "badge",
      type: {
        kind: "struct",
        fields: [
          { name: "nftMint", type: "publicKey" },
          { name: "badgeName", type: "string" },
          { name: "badgeDescription", type: "string" },
          { name: "badgeImageUri", type: "string" },
          { name: "awardedAt", type: "i64" }
        ]
      }
    }
  ]
};

/**
 * Creates a new researcher profile NFT
 * @param username Researcher username
 * @param specializations Array of researcher specializations
 * @param metadataUri URI to the NFT metadata
 * @param network Solana network
 * @returns Transaction signature and NFT mint address
 */
export const createResearcherProfile = async (
  username: string,
  specializations: string[],
  metadataUri: string,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<{ signature: string, nftMint: PublicKey }> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.REPUTATION_NFT, reputationNftIdl, provider);
  
  // Generate a new keypair for the NFT mint
  const nftMint = PublicKey.unique();
  
  // Create the researcher profile NFT
  const instruction = await program.methods
    .createResearcherProfile(
      username,
      specializations,
      metadataUri
    )
    .accounts({
      nftMint,
      owner: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  const signature = await sendTransaction(connection, [instruction]);
  
  return { signature, nftMint };
};

/**
 * Updates a researcher's reputation score
 * @param nftMint NFT mint address
 * @param reputationChange Change in reputation points (positive or negative)
 * @param reason Reason for reputation change
 * @param network Solana network
 * @returns Transaction signature
 */
export const updateReputation = async (
  nftMint: PublicKey,
  reputationChange: number,
  reason: string,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<string> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.REPUTATION_NFT, reputationNftIdl, provider);
  
  // Update the reputation score
  const instruction = await program.methods
    .updateReputation(
      new BN(reputationChange),
      reason
    )
    .accounts({
      nftMint,
      updater: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  return await sendTransaction(connection, [instruction]);
};

/**
 * Awards a badge to a researcher
 * @param nftMint NFT mint address
 * @param badgeName Badge name
 * @param badgeDescription Badge description
 * @param badgeImageUri URI to the badge image
 * @param network Solana network
 * @returns Transaction signature
 */
export const awardBadge = async (
  nftMint: PublicKey,
  badgeName: string,
  badgeDescription: string,
  badgeImageUri: string,
  network: SolanaNetwork = DEFAULT_NETWORK
): Promise<string> => {
  const { connection, provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.REPUTATION_NFT, reputationNftIdl, provider);
  
  // Award the badge
  const instruction = await program.methods
    .awardBadge(
      badgeName,
      badgeDescription,
      badgeImageUri
    )
    .accounts({
      nftMint,
      awarder: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
  
  return await sendTransaction(connection, [instruction]);
};

/**
 * Gets a researcher's profile details
 * @param nftMint NFT mint address
 * @param network Solana network
 * @returns Researcher profile details
 */
export const getResearcherProfile = async (
  nftMint: PublicKey,
  network: SolanaNetwork = DEFAULT_NETWORK
) => {
  const { provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.REPUTATION_NFT, reputationNftIdl, provider);
  
  // Fetch the researcher profile account
  // @ts-ignore - We know this account exists in the IDL
  return await program.account.researcherProfile.fetch(nftMint);
};

/**
 * Gets all badges awarded to a researcher
 * @param nftMint NFT mint address
 * @param network Solana network
 * @returns Array of badges
 */
export const getResearcherBadges = async (
  nftMint: PublicKey,
  network: SolanaNetwork = DEFAULT_NETWORK
) => {
  const { provider } = await getConnectionAndProvider(network);
  const program = createProgram(PROGRAM_IDS.REPUTATION_NFT, reputationNftIdl, provider);
  
  // Fetch the researcher's badges
  // @ts-ignore - We know this account exists in the IDL
  return await program.account.badge.all([
    {
      memcmp: {
        offset: 8, // After discriminator
        bytes: nftMint.toBase58(),
      },
    },
  ]);
};