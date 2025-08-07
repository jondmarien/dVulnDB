# Deploy DVulnDB Anchor programs to Solana Mainnet
# This script deploys all Solana programs to mainnet for production
# ⚠️  WARNING: This deploys to MAINNET - use with caution!

Write-Host "🚀 Deploying DVulnDB to Solana Mainnet..." -ForegroundColor Red
Write-Host "⚠️  WARNING: You are about to deploy to MAINNET!" -ForegroundColor Yellow

# Confirmation prompt
$confirmation = Read-Host "Are you sure you want to deploy to MAINNET? Type 'DEPLOY' to confirm"
if ($confirmation -ne "DEPLOY") {
    Write-Host "❌ Deployment cancelled." -ForegroundColor Red
    exit 0
}

# Check if Anchor is installed
if (-not (Get-Command anchor -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Anchor CLI not found. Please install Anchor first." -ForegroundColor Red
    Write-Host "Visit: https://www.anchor-lang.com/docs/installation" -ForegroundColor Yellow
    exit 1
}

# Check if Solana CLI is installed
if (-not (Get-Command solana -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Solana CLI not found. Please install Solana CLI first." -ForegroundColor Red
    Write-Host "Visit: https://docs.solana.com/cli/install-solana-cli-tools" -ForegroundColor Yellow
    exit 1
}

# Set Solana config to mainnet
Write-Host "🔧 Configuring Solana for mainnet deployment..." -ForegroundColor Blue
solana config set --url mainnet-beta

# Check wallet balance
Write-Host "💰 Checking wallet balance..." -ForegroundColor Blue
$balance = solana balance
Write-Host "Current balance: $balance" -ForegroundColor Cyan

# Ensure sufficient balance for deployment
if ($balance -match "^0\.") {
    Write-Host "❌ Insufficient balance for mainnet deployment!" -ForegroundColor Red
    Write-Host "Please fund your wallet with SOL before deploying to mainnet." -ForegroundColor Yellow
    exit 1
}

# Build programs
Write-Host "🔨 Building Anchor programs..." -ForegroundColor Blue
try {
    anchor build
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Final confirmation
Write-Host "🚨 FINAL WARNING: Deploying to MAINNET with real SOL!" -ForegroundColor Red
$finalConfirmation = Read-Host "Type 'MAINNET' to proceed with deployment"
if ($finalConfirmation -ne "MAINNET") {
    Write-Host "❌ Deployment cancelled." -ForegroundColor Red
    exit 0
}

# Deploy programs
Write-Host "🚀 Deploying programs to mainnet..." -ForegroundColor Blue
try {
    anchor deploy --provider.cluster mainnet-beta
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Mainnet deployment completed successfully!" -ForegroundColor Green
Write-Host "Programs deployed to Solana Mainnet-Beta" -ForegroundColor Cyan
Write-Host "⚠️  Remember to update frontend with new program IDs!" -ForegroundColor Yellow