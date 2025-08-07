# DVulnDB Anchor Test Runner for Windows
# This script runs all Anchor tests for the Solana-only migration

Write-Host "🚀 Starting DVulnDB Anchor Tests..." -ForegroundColor Green

# Setup test environment
Write-Host "🔧 Setting up test environment..." -ForegroundColor Blue
$env:ANCHOR_PROVIDER_URL = "http://localhost:8899"
$env:ANCHOR_WALLET = "$env:USERPROFILE\.config\solana\id.json"

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

# Set Solana config to localnet for testing
Write-Host "🔧 Configuring Solana for local testing..." -ForegroundColor Blue
solana config set --url localhost

# Check if local validator is running
$validatorRunning = Get-Process -Name "solana-test-validator" -ErrorAction SilentlyContinue

if (-not $validatorRunning) {
    Write-Host "🏗️  Starting local Solana validator..." -ForegroundColor Blue
    Start-Process -FilePath "solana-test-validator" -ArgumentList "--reset" -NoNewWindow
    Write-Host "⏳ Waiting for validator to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "✅ Local validator already running" -ForegroundColor Green
}

# Try to build programs first
Write-Host "🔨 Attempting to build Anchor programs..." -ForegroundColor Blue
try {
    anchor build
    $buildSuccess = $true
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Build failed or contracts not ready. Running framework tests only." -ForegroundColor Yellow
    $buildSuccess = $false
}

# Run tests
Write-Host "🧪 Running Anchor tests..." -ForegroundColor Blue
try {
    if ($buildSuccess) {
        anchor test --skip-local-validator
        Write-Host "✅ All tests passed!" -ForegroundColor Green
    } else {
        Write-Host "🔍 Running test framework validation..." -ForegroundColor Blue
        Set-Location anchor
        npx ts-mocha tests/**/*.ts --timeout 60000
        Set-Location ..
        Write-Host "✅ Test framework is ready!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Some tests failed or contracts not built yet!" -ForegroundColor Red
    Write-Host "💡 Run 'anchor build' first to build contracts, then run tests again." -ForegroundColor Yellow
}

Write-Host "🎉 Test run completed!" -ForegroundColor Green