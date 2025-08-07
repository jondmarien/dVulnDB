#!/usr/bin/env node

/**
 * Build Check Script for DVulnDB Solana-Only Migration
 * This script ensures no EVM-related files are included in the build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running Solana-only build verification...');

// Files and directories that should NOT exist after EVM removal
const forbiddenPaths = [
  'evm/',
  'hardhat.config.ts',
  'truffle-config.js',
  'contracts/',
  'migrations/',
];

// Dependencies that should NOT be present
const forbiddenDependencies = [
  'wagmi',
  'viem',
  'ethers',
  'hardhat',
  '@hardhat/core',
  '@nomiclabs/hardhat-ethers',
  'truffle',
  'web3-eth',
  'web3-eth-contract',
];

// Check for forbidden files/directories
console.log('📁 Checking for EVM-related files...');
let hasEVMFiles = false;

forbiddenPaths.forEach(forbiddenPath => {
  if (fs.existsSync(forbiddenPath)) {
    console.error(`❌ Found EVM-related path: ${forbiddenPath}`);
    hasEVMFiles = true;
  }
});

if (!hasEVMFiles) {
  console.log('✅ No EVM-related files found');
}

// Check package.json for forbidden dependencies
console.log('📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

let hasEVMDependencies = false;

forbiddenDependencies.forEach(dep => {
  if (allDependencies[dep]) {
    console.error(`❌ Found EVM dependency: ${dep}`);
    hasEVMDependencies = true;
  }
});

if (!hasEVMDependencies) {
  console.log('✅ No EVM dependencies found');
}

// Check for Solana-specific dependencies
console.log('🔗 Verifying Solana dependencies...');
const requiredSolanaDeps = [
  '@solana/web3.js',
  '@reown/appkit',
  '@reown/appkit-adapter-solana',
];

let missingSolanaDeps = false;

requiredSolanaDeps.forEach(dep => {
  if (!allDependencies[dep]) {
    console.error(`❌ Missing required Solana dependency: ${dep}`);
    missingSolanaDeps = true;
  }
});

if (!missingSolanaDeps) {
  console.log('✅ All required Solana dependencies present');
}

// Check Anchor configuration
console.log('⚓ Checking Anchor configuration...');
if (fs.existsSync('Anchor.toml')) {
  const anchorConfig = fs.readFileSync('Anchor.toml', 'utf8');
  
  // Check for network configurations
  const hasDevnet = anchorConfig.includes('[programs.devnet]');
  const hasTestnet = anchorConfig.includes('[programs.testnet]');
  const hasMainnet = anchorConfig.includes('[programs.mainnet]');
  
  if (hasDevnet && hasTestnet && hasMainnet) {
    console.log('✅ Anchor configured for all Solana networks');
  } else {
    console.warn('⚠️  Anchor missing some network configurations');
  }
} else {
  console.error('❌ Anchor.toml not found');
}

// Check environment variables
console.log('🌍 Checking environment configuration...');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  
  const hasSolanaRPC = envContent.includes('NEXT_PUBLIC_SOLANA_');
  const hasReownConfig = envContent.includes('NEXT_PUBLIC_REOWN_PROJECT_ID');
  
  if (hasSolanaRPC && hasReownConfig) {
    console.log('✅ Environment configured for Solana');
  } else {
    console.warn('⚠️  Environment missing some Solana configurations');
  }
}

// Check TypeScript configuration
console.log('📝 Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  // Check for EVM-related path aliases
  const paths = tsConfig.compilerOptions?.paths || {};
  const hasEVMPaths = Object.keys(paths).some(path => path.includes('evm'));
  
  if (hasEVMPaths) {
    console.error('❌ Found EVM-related TypeScript paths');
  } else {
    console.log('✅ TypeScript configuration clean');
  }
}

// Final summary
console.log('\n📊 Build Verification Summary:');

const hasErrors = hasEVMFiles || hasEVMDependencies || missingSolanaDeps;

if (hasErrors) {
  console.error('❌ Build verification failed! Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ Build verification passed! Ready for Solana-only deployment.');
  process.exit(0);
}