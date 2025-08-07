#!/usr/bin/env node

/**
 * Keypair Verification Script
 * Verifies that deployment keypairs are properly configured
 */

const { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs');

const NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
};

async function verifyKeypair(keypairPath, network) {
  try {
    console.log(`🔑 Verifying keypair: ${keypairPath} on ${network}`);
    
    // Load keypair
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    console.log(`📍 Public Key: ${keypair.publicKey.toString()}`);
    
    // Check balance
    const connection = new Connection(NETWORKS[network]);
    const balance = await connection.getBalance(keypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    console.log(`💰 Balance: ${solBalance} SOL`);
    
    // Check if sufficient for deployment
    const minRequired = network === 'mainnet' ? 0.1 : 0.01;
    if (solBalance >= minRequired) {
      console.log(`✅ Sufficient balance for deployment`);
    } else {
      console.log(`⚠️  Low balance - may need funding (minimum: ${minRequired} SOL)`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error verifying keypair:`, error.message);
    return false;
  }
}

async function main() {
  const keypairPath = process.argv[2];
  const network = process.argv[3] || 'devnet';
  
  if (!keypairPath) {
    console.log(`
Usage: node scripts/verify-keypair.js <keypair-path> [network]

Examples:
  node scripts/verify-keypair.js deploy-devnet.json devnet
  node scripts/verify-keypair.js deploy-mainnet.json mainnet
    `);
    process.exit(1);
  }
  
  if (!fs.existsSync(keypairPath)) {
    console.error(`❌ Keypair file not found: ${keypairPath}`);
    process.exit(1);
  }
  
  const success = await verifyKeypair(keypairPath, network);
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}