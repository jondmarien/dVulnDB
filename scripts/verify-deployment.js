#!/usr/bin/env node

/**
 * Deployment Verification Script for DVulnDB Solana-Only
 * This script verifies that the deployment is working correctly
 */

const https = require('https');
const { Connection, PublicKey } = require('@solana/web3.js');

const NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
};

const PROGRAM_IDS = {
  bounty_escrow: '3aiStNroDenw7KpSKXvFWVFox35gCk4FcUx8nzXRF2HH',
  vulnerability_registry: '5mCoaixH9VVepuSsnhB769263Gg4RqBCEkkoJuHaH69K',
  reputation_nft: 'HsxZ1cg5H1zvvdyngaLTrB9DZ1YFrEAFMNR21fKCzioW',
};

async function verifyProgramDeployment(network, programId, programName) {
  try {
    const connection = new Connection(NETWORKS[network]);
    const publicKey = new PublicKey(programId);
    
    const accountInfo = await connection.getAccountInfo(publicKey);
    
    if (accountInfo && accountInfo.executable) {
      console.log(`✅ ${programName} deployed successfully on ${network}`);
      return true;
    } else {
      console.error(`❌ ${programName} not found or not executable on ${network}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error verifying ${programName} on ${network}:`, error.message);
    return false;
  }
}

async function verifyFrontendDeployment(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        console.log(`✅ Frontend accessible at ${url}`);
        resolve(true);
      } else {
        console.error(`❌ Frontend returned status ${response.statusCode} at ${url}`);
        resolve(false);
      }
    });
    
    request.on('error', (error) => {
      console.error(`❌ Error accessing frontend at ${url}:`, error.message);
      resolve(false);
    });
    
    request.setTimeout(10000, () => {
      console.error(`❌ Timeout accessing frontend at ${url}`);
      request.destroy();
      resolve(false);
    });
  });
}

async function verifyRPCEndpoints() {
  console.log('🔗 Verifying RPC endpoints...');
  
  for (const [network, rpcUrl] of Object.entries(NETWORKS)) {
    try {
      const connection = new Connection(rpcUrl);
      const version = await connection.getVersion();
      console.log(`✅ ${network} RPC endpoint working (Solana ${version['solana-core']})`);
    } catch (error) {
      console.error(`❌ ${network} RPC endpoint failed:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting deployment verification...\n');
  
  const network = process.argv[2] || 'devnet';
  const frontendUrl = process.argv[3];
  
  console.log(`📍 Verifying deployment on ${network}...\n`);
  
  // Verify RPC endpoints
  await verifyRPCEndpoints();
  console.log('');
  
  // Verify program deployments
  console.log('⚓ Verifying Anchor program deployments...');
  let allProgramsDeployed = true;
  
  for (const [programName, programId] of Object.entries(PROGRAM_IDS)) {
    const isDeployed = await verifyProgramDeployment(network, programId, programName);
    if (!isDeployed) {
      allProgramsDeployed = false;
    }
  }
  
  console.log('');
  
  // Verify frontend deployment
  if (frontendUrl) {
    console.log('🌐 Verifying frontend deployment...');
    const frontendWorking = await verifyFrontendDeployment(frontendUrl);
    console.log('');
    
    if (allProgramsDeployed && frontendWorking) {
      console.log('🎉 All deployments verified successfully!');
      process.exit(0);
    } else {
      console.error('❌ Some deployments failed verification!');
      process.exit(1);
    }
  } else {
    if (allProgramsDeployed) {
      console.log('🎉 All program deployments verified successfully!');
      console.log('💡 Add frontend URL as second argument to verify frontend deployment');
      process.exit(0);
    } else {
      console.error('❌ Some program deployments failed verification!');
      process.exit(1);
    }
  }
}

// Handle command line usage
if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Usage: node scripts/verify-deployment.js [network] [frontend-url]

Arguments:
  network       Solana network to verify (devnet, testnet, mainnet) [default: devnet]
  frontend-url  Frontend URL to verify (optional)

Examples:
  node scripts/verify-deployment.js devnet
  node scripts/verify-deployment.js mainnet https://dvulndb.vercel.app
  node scripts/verify-deployment.js testnet https://staging.dvulndb.vercel.app
    `);
    process.exit(0);
  }
  
  main().catch(console.error);
}