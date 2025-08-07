# Solana Deploy Keypair Setup Guide

This guide covers how to generate, configure, and secure Solana keypairs for automated deployments in DVulnDB.

## Table of Contents
- [1. Generate Solana Keypairs](#1-generate-solana-keypairs)
- [2. Fund the Keypairs](#2-fund-the-keypairs)
- [3. Convert to Base64 for GitHub Secrets](#3-convert-to-base64-for-github-secrets)
- [4. Add to GitHub Secrets](#4-add-to-github-secrets)
- [5. Security Best Practices](#5-security-best-practices)
- [6. Hardware Wallet Integration](#6-hardware-wallet-integration)
- [7. Verify Keypair Setup](#7-verify-keypair-setup)
- [8. Usage Examples](#8-usage-examples)
- [9. Troubleshooting](#9-troubleshooting)

## 1. Generate Solana Keypairs

### For Development/Staging (Devnet/Testnet):
```bash
# Generate a new keypair without passphrase (easier for CI/CD)
solana-keygen new --outfile deploy-devnet.json --no-bip39-passphrase

# Or generate with a specific seed phrase (more secure)
solana-keygen new --outfile deploy-devnet.json
```

### For Production (Mainnet):
```bash
# Generate a dedicated mainnet keypair
solana-keygen new --outfile deploy-mainnet.json

# For maximum security, consider using a hardware wallet derivation path
solana-keygen new --outfile deploy-mainnet.json --derivation-path m/44'/501'/0'/0'
```

### Generate Testnet Keypair (Optional):
```bash
# Generate separate testnet keypair
solana-keygen new --outfile deploy-testnet.json --no-bip39-passphrase
```

## 2. Fund the Keypairs

### For Devnet/Testnet:
```bash
# Set the keypair as default for devnet
solana config set --keypair deploy-devnet.json --url devnet

# Request airdrop (free SOL for testing)
solana airdrop 2

# Check balance
solana balance

# For testnet (similar process)
solana config set --keypair deploy-testnet.json --url testnet
solana airdrop 2
```

### For Mainnet:
```bash
# Set the keypair
solana config set --keypair deploy-mainnet.json --url mainnet-beta

# Check the public key to fund
solana-keygen pubkey deploy-mainnet.json

# You'll need to fund this with real SOL
# Transfer SOL from your main wallet or exchange
# Minimum recommended: 0.5 SOL for deployment costs
```

**Funding Options for Mainnet:**
- Transfer from existing wallet
- Purchase from exchange and withdraw
- Use a DEX to swap other tokens for SOL

## 3. Convert to Base64 for GitHub Secrets

The CI/CD pipeline expects base64-encoded keypairs. Here's how to convert them:

### On Windows (PowerShell):
```powershell
# For devnet keypair
$keypairContent = Get-Content deploy-devnet.json -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($keypairContent))
Write-Output $base64

# For testnet keypair
$keypairContent = Get-Content deploy-testnet.json -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($keypairContent))
Write-Output $base64

# For mainnet keypair
$keypairContent = Get-Content deploy-mainnet.json -Raw
$base64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($keypairContent))
Write-Output $base64
```

### On Linux/macOS:
```bash
# For devnet keypair
base64 -i deploy-devnet.json

# For testnet keypair
base64 -i deploy-testnet.json

# For mainnet keypair
base64 -i deploy-mainnet.json
```

### Alternative Method (Cross-platform with Node.js):
```bash
# Create a quick conversion script
node -e "console.log(Buffer.from(require('fs').readFileSync('deploy-devnet.json')).toString('base64'))"
```

## 4. Add to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

### Required Secrets:
```
Name: SOLANA_DEPLOY_KEYPAIR
Value: <base64_encoded_devnet_keypair>

Name: SOLANA_MAINNET_DEPLOY_KEYPAIR  
Value: <base64_encoded_mainnet_keypair>
```

### Optional Secrets (if using testnet):
```
Name: SOLANA_TESTNET_DEPLOY_KEYPAIR
Value: <base64_encoded_testnet_keypair>
```

### Additional Required Secrets:
```
Name: VERCEL_TOKEN
Value: <your_vercel_token>

Name: VERCEL_ORG_ID
Value: <your_vercel_org_id>

Name: VERCEL_PROJECT_ID
Value: <your_vercel_project_id>

Name: NEXT_PUBLIC_REOWN_PROJECT_ID
Value: <your_reown_project_id>

Name: NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL
Value: <your_mainnet_rpc_url>

Name: NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL
Value: <your_devnet_rpc_url>

Name: NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL
Value: <your_testnet_rpc_url>
```

## 5. Security Best Practices

### For Development:
- ✅ Use separate keypairs for each environment
- ✅ Don't commit keypair files to git (add to .gitignore)
- ✅ Rotate keypairs periodically (every 3-6 months)
- ✅ Use minimal funding for test networks
- ✅ Monitor deployment costs and balances

### For Production:
- 🔒 **Never** store mainnet keypairs in plain text on local machines
- 🔒 Consider using a hardware wallet for mainnet deployments
- 🔒 Use multi-signature wallets for critical deployments
- 🔒 Implement approval workflows for mainnet deployments
- 🔒 Store backup seed phrases in secure, offline locations
- 🔒 Use environment-specific keypairs (never reuse across environments)
- 🔒 Monitor mainnet keypair balances and set up alerts

### Keypair Storage Security:
```bash
# Set proper file permissions (Linux/macOS)
chmod 600 deploy-*.json

# Store in secure directory
mkdir -p ~/.solana/deploy-keys
mv deploy-*.json ~/.solana/deploy-keys/
chmod 700 ~/.solana/deploy-keys
```

## 6. Hardware Wallet Integration

For maximum security on mainnet, you can use a hardware wallet:

### Setup Ledger Hardware Wallet:
```bash
# Install Ledger app dependencies
npm install -g @ledgerhq/hw-app-solana

# Connect hardware wallet
solana-keygen pubkey usb://ledger

# Use hardware wallet for deployment
solana config set --keypair usb://ledger --url mainnet-beta

# Verify connection
solana balance
```

### Manual Deployment with Hardware Wallet:
```bash
# For critical mainnet deployments, consider manual deployment
anchor build
anchor deploy --provider.cluster mainnet-beta --provider.wallet usb://ledger
```

## 7. Verify Keypair Setup

Use the verification script created in the project:

```bash
# Verify devnet keypair
node scripts/verify-keypair.js deploy-devnet.json devnet

# Verify testnet keypair
node scripts/verify-keypair.js deploy-testnet.json testnet

# Verify mainnet keypair
node scripts/verify-keypair.js deploy-mainnet.json mainnet
```

### Manual Verification:
```bash
# Check keypair public key
solana-keygen pubkey deploy-devnet.json

# Check balance on specific network
solana config set --keypair deploy-devnet.json --url devnet
solana balance

# Verify keypair can sign transactions
solana transfer --from deploy-devnet.json <RECIPIENT> 0.001 --url devnet
```

## 8. Usage Examples

### Complete Setup Flow:

#### Step 1: Generate Keypairs
```bash
# Development keypair
solana-keygen new --outfile deploy-devnet.json --no-bip39-passphrase

# Production keypair (with seed phrase for backup)
solana-keygen new --outfile deploy-mainnet.json
```

#### Step 2: Fund and Verify
```bash
# Fund devnet
solana config set --keypair deploy-devnet.json --url devnet
solana airdrop 2
node scripts/verify-keypair.js deploy-devnet.json devnet

# Fund mainnet (manual transfer required)
solana config set --keypair deploy-mainnet.json --url mainnet-beta
# Transfer SOL to the address shown by: solana-keygen pubkey deploy-mainnet.json
node scripts/verify-keypair.js deploy-mainnet.json mainnet
```

#### Step 3: Convert and Store
```bash
# Convert to base64 (PowerShell)
$devnetKeypair = Get-Content deploy-devnet.json -Raw
$devnetBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($devnetKeypair))
Write-Output "SOLANA_DEPLOY_KEYPAIR: $devnetBase64"

$mainnetKeypair = Get-Content deploy-mainnet.json -Raw
$mainnetBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($mainnetKeypair))
Write-Output "SOLANA_MAINNET_DEPLOY_KEYPAIR: $mainnetBase64"
```

#### Step 4: Test Deployment
```bash
# Test local deployment first
yarn deploy:local

# Test devnet deployment
yarn deploy:devnet

# Verify deployment
yarn verify:devnet
```

## 9. Troubleshooting

### Common Issues:

#### "Insufficient funds" Error:
```bash
# Check balance
solana balance

# For devnet/testnet, request airdrop
solana airdrop 2

# For mainnet, transfer more SOL
```

#### "Invalid keypair" Error:
```bash
# Verify keypair format
solana-keygen verify <PUBLIC_KEY> deploy-keypair.json

# Regenerate if corrupted
solana-keygen new --outfile deploy-keypair-new.json
```

#### "Network connection" Error:
```bash
# Check network configuration
solana config get

# Test RPC endpoint
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1, "method":"getHealth"}' https://api.devnet.solana.com
```

#### Base64 Encoding Issues:
```bash
# Verify base64 encoding
echo "<BASE64_STRING>" | base64 -d | jq .

# Re-encode if needed
base64 -i deploy-keypair.json
```

### Recovery Procedures:

#### Lost Keypair File:
1. If you have the seed phrase, recover using:
   ```bash
   solana-keygen recover --outfile recovered-keypair.json
   ```

2. If you have the private key array, recreate the JSON file:
   ```json
   [private_key_byte_array]
   ```

#### Compromised Keypair:
1. Generate new keypair immediately
2. Transfer remaining funds to new keypair
3. Update GitHub secrets with new keypair
4. Revoke old keypair access

### Monitoring and Maintenance:

#### Set Up Balance Monitoring:
```bash
# Create a monitoring script
#!/bin/bash
BALANCE=$(solana balance --keypair deploy-mainnet.json --url mainnet-beta)
if (( $(echo "$BALANCE < 0.1" | bc -l) )); then
    echo "WARNING: Low balance on mainnet deploy keypair: $BALANCE SOL"
fi
```

#### Regular Security Checks:
- Review GitHub Actions logs for unusual activity
- Monitor Solana Explorer for unexpected transactions
- Rotate keypairs every 6 months
- Audit access to GitHub secrets regularly

## Important Reminders

- 🚨 **Never commit keypair files to version control**
- 🚨 **Always test on devnet before mainnet**
- 🚨 **Keep seed phrases secure and backed up**
- 🚨 **Monitor keypair balances regularly**
- 🚨 **Use minimal permissions and funding**
- 🚨 **Implement proper access controls**

---

*This guide should be kept secure and only shared with authorized team members who need access to deployment infrastructure.*