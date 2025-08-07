# Start Solana Test Validator - Reliable Startup Script
# This script handles common validator startup issues

Write-Host "🚀 Starting Solana Test Validator..." -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("127.0.0.1", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Function to kill existing validator processes
function Stop-ExistingValidators {
    Write-Host "🔍 Checking for existing validator processes..." -ForegroundColor Blue
    
    $processes = Get-Process -Name "solana-test-validator" -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "⚠️  Found existing validator processes. Stopping them..." -ForegroundColor Yellow
        $processes | Stop-Process -Force
        Start-Sleep -Seconds 2
        Write-Host "✅ Existing processes stopped" -ForegroundColor Green
    }
}

# Function to clean ledger directory
function Clean-LedgerDirectory {
    param([string]$LedgerPath = "test-ledger")
    
    if (Test-Path $LedgerPath) {
        Write-Host "🧹 Cleaning existing ledger directory..." -ForegroundColor Blue
        try {
            Remove-Item -Recurse -Force $LedgerPath -ErrorAction Stop
            Write-Host "✅ Ledger directory cleaned" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to clean ledger directory: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "💡 Try running as Administrator" -ForegroundColor Yellow
            return $false
        }
    }
    return $true
}

# Main startup logic
try {
    # Stop existing validators
    Stop-ExistingValidators
    
    # Check if RPC port is available
    $rpcPort = 8899
    if (Test-Port $rpcPort) {
        Write-Host "⚠️  Port $rpcPort is in use. Trying alternative port..." -ForegroundColor Yellow
        $rpcPort = 8900
        
        if (Test-Port $rpcPort) {
            Write-Host "❌ Port $rpcPort is also in use. Please free up ports 8899-8900" -ForegroundColor Red
            exit 1
        }
    }
    
    # Clean ledger directory
    if (-not (Clean-LedgerDirectory)) {
        exit 1
    }
    
    # Start validator with optimal settings
    Write-Host "🏗️  Starting validator on port $rpcPort..." -ForegroundColor Blue
    Write-Host "📍 Ledger location: test-ledger" -ForegroundColor Cyan
    Write-Host "🌐 RPC endpoint: http://localhost:$rpcPort" -ForegroundColor Cyan
    
    $validatorArgs = @(
        "--reset"
        "--quiet"
        "--rpc-port", $rpcPort
        "--rpc-bind-address", "127.0.0.1"
        "--ledger", "test-ledger"
        "--log"
    )
    
    # Start the validator
    Start-Process -FilePath "solana-test-validator" -ArgumentList $validatorArgs -NoNewWindow -PassThru
    
    # Wait for validator to be ready
    Write-Host "⏳ Waiting for validator to initialize..." -ForegroundColor Yellow
    $maxWaitTime = 30
    $waitTime = 0
    
    do {
        Start-Sleep -Seconds 1
        $waitTime++
        
        # Test if validator is responding
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:$rpcPort" -Method Post -Body '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' -ContentType "application/json" -TimeoutSec 2
            if ($response.result -eq "ok") {
                Write-Host "✅ Validator is ready!" -ForegroundColor Green
                Write-Host "🌐 RPC endpoint: http://localhost:$rpcPort" -ForegroundColor Cyan
                Write-Host "📊 Health check: OK" -ForegroundColor Green
                break
            }
        } catch {
            # Validator not ready yet, continue waiting
        }
        
        if ($waitTime -ge $maxWaitTime) {
            Write-Host "❌ Validator failed to start within $maxWaitTime seconds" -ForegroundColor Red
            Write-Host "💡 Check the logs in test-ledger/validator.log" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "." -NoNewline -ForegroundColor Yellow
    } while ($true)
    
    # Configure Solana CLI to use local validator
    Write-Host "⚙️  Configuring Solana CLI..." -ForegroundColor Blue
    solana config set --url "http://localhost:$rpcPort"
    
    # Show final status
    Write-Host "`n🎉 Solana test validator started successfully!" -ForegroundColor Green
    Write-Host "📋 Configuration:" -ForegroundColor Cyan
    Write-Host "   RPC URL: http://localhost:$rpcPort" -ForegroundColor Gray
    Write-Host "   Ledger: test-ledger/" -ForegroundColor Gray
    Write-Host "   Logs: test-ledger/validator.log" -ForegroundColor Gray
    Write-Host "`n💡 To stop the validator, press Ctrl+C or run: Get-Process solana-test-validator | Stop-Process" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Failed to start validator: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Try running as Administrator or check if Solana CLI is properly installed" -ForegroundColor Yellow
    exit 1
}