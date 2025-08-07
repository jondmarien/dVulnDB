# Setup test environment for DVulnDB Anchor tests

Write-Host "🔧 Setting up test environment..." -ForegroundColor Blue

# Set environment variables for Anchor
$env:ANCHOR_PROVIDER_URL = "http://localhost:8899"
$env:ANCHOR_WALLET = "$env:USERPROFILE\.config\solana\id.json"

# Check if Solana config exists, create if not
$solanaConfigDir = "$env:USERPROFILE\.config\solana"
if (-not (Test-Path $solanaConfigDir)) {
    Write-Host "📁 Creating Solana config directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $solanaConfigDir -Force
}

# Check if wallet exists, create if not
$walletPath = "$solanaConfigDir\id.json"
if (-not (Test-Path $walletPath)) {
    Write-Host "🔑 Creating test wallet..." -ForegroundColor Yellow
    solana-keygen new --no-bip39-passphrase --silent --outfile $walletPath
}

# Set Solana config
Write-Host "⚙️  Configuring Solana CLI..." -ForegroundColor Blue
solana config set --url localhost --keypair $walletPath

Write-Host "✅ Test environment setup complete!" -ForegroundColor Green
Write-Host "Environment variables set:" -ForegroundColor Cyan
Write-Host "  ANCHOR_PROVIDER_URL: $env:ANCHOR_PROVIDER_URL" -ForegroundColor Gray
Write-Host "  ANCHOR_WALLET: $env:ANCHOR_WALLET" -ForegroundColor Gray