# Deploy DVulnDB Anchor programs to Solana Devnet
# This script deploys all Solana programs to devnet for testing

Write-Host "🚀 Deploying DVulnDB to Solana Devnet..." -ForegroundColor Green

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

# Set Solana config to devnet
Write-Host "🔧 Configuring Solana for devnet deployment..." -ForegroundColor Blue
solana config set --url devnet

# Check wallet balance
Write-Host "💰 Checking wallet balance..." -ForegroundColor Blue
$balance = solana balance
Write-Host "Current balance: $balance" -ForegroundColor Cyan

if ($balance -match "^0\.") {
    Write-Host "⚠️  Low balance detected. Requesting airdrop..." -ForegroundColor Yellow
    solana airdrop 2
    Start-Sleep -Seconds 5
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

# Deploy programs
Write-Host "🚀 Deploying programs to devnet..." -ForegroundColor Blue
try {
    anchor deploy --provider.cluster devnet
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}

# Verify deployment
Write-Host "🔍 Verifying deployment..." -ForegroundColor Blue
anchor test --skip-local-validator --provider.cluster devnet

Write-Host "🎉 Devnet deployment completed successfully!" -ForegroundColor Green
Write-Host "Programs deployed to Solana Devnet" -ForegroundColor Cyan