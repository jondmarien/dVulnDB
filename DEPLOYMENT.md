# DVulnDB Deployment Guide - Solana Only

This guide covers the deployment process for DVulnDB's Solana-only architecture.

## Prerequisites

- Node.js 18+
- Yarn package manager
- Rust and Cargo
- Solana CLI (v1.18.0+)
- Anchor CLI (v0.30.1+)

## Environment Setup

### 1. Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

### 2. Install Anchor CLI
```bash
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

### 3. Setup Solana Keypair
```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

## Local Development

### 1. Start Local Validator
```bash
solana-test-validator --reset
```

### 2. Build and Deploy Locally
```bash
yarn build:anchor
yarn deploy:local
```

### 3. Run Tests
```bash
yarn test:anchor
```

## Network Deployments

### Devnet Deployment
```bash
# Deploy Anchor programs
yarn deploy:devnet

# Deploy frontend to Vercel staging
vercel --prod
```

### Testnet Deployment
```bash
# Deploy Anchor programs
yarn deploy:testnet

# Deploy frontend to Vercel staging
vercel --prod
```

### Mainnet Deployment
```bash
# Deploy Anchor programs (requires confirmation)
yarn deploy:mainnet

# Deploy frontend to Vercel production
vercel --prod
```

## CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

### Staging (develop branch)
- Runs tests and linting
- Deploys Anchor programs to Devnet
- Deploys frontend to Vercel staging

### Production (main branch)
- Runs full test suite and security scans
- Deploys Anchor programs to Mainnet
- Deploys frontend to Vercel production

## Environment Variables

### Required for Deployment
```bash
# Solana RPC endpoints
NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL=https://api.testnet.solana.com

# Reown AppKit
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id

# IPFS/Pinata
PINATA_GATEWAY_URL=your_gateway_url
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_api_secret
PINATA_JWT_SECRET=your_jwt_secret
```

### GitHub Secrets (for CI/CD)
```bash
# Vercel deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Solana deployment keypairs
SOLANA_DEPLOY_KEYPAIR=base64_encoded_keypair
SOLANA_MAINNET_DEPLOY_KEYPAIR=base64_encoded_mainnet_keypair

# Environment variables
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id
NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL=your_mainnet_rpc
NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL=your_devnet_rpc
NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL=your_testnet_rpc
```

## Program IDs

Update these in your frontend configuration after deployment:

### Localnet
- bounty_escrow: `3aiStNroDenw7KpSKXvFWVFox35gCk4FcUx8nzXRF2HH`
- vulnerability_registry: `5mCoaixH9VVepuSsnhB769263Gg4RqBCEkkoJuHaH69K`
- reputation_nft: `HsxZ1cg5H1zvvdyngaLTrB9DZ1YFrEAFMNR21fKCzioW`

### Devnet/Testnet/Mainnet
Program IDs will be generated during deployment and should be updated in:
- `Anchor.toml`
- Frontend configuration files
- Environment variables

## Verification

After deployment, verify:

1. **Programs are deployed**: Check program accounts on Solana Explorer
2. **Frontend is accessible**: Test wallet connection and basic functionality
3. **RPC endpoints are working**: Verify network connectivity
4. **IPFS integration**: Test file uploads and retrievals

## Rollback Procedure

If deployment fails or issues are detected:

1. **Revert frontend**: Use Vercel rollback feature
2. **Revert programs**: Deploy previous version using `anchor upgrade`
3. **Update program IDs**: Ensure frontend points to correct program versions

## Monitoring

- **Frontend**: Vercel analytics and error tracking
- **Programs**: Solana Explorer for transaction monitoring
- **RPC**: Monitor RPC endpoint health and rate limits
- **IPFS**: Monitor Pinata usage and gateway performance

## Security Considerations

- Use separate keypairs for different environments
- Store mainnet keypairs securely (hardware wallets recommended)
- Regularly rotate API keys and secrets
- Monitor for unusual transaction patterns
- Keep dependencies updated for security patches