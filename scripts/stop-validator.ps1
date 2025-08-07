# Stop Solana Test Validator
# This script safely stops the test validator and cleans up

Write-Host "🛑 Stopping Solana Test Validator..." -ForegroundColor Red

# Find and stop validator processes
$processes = Get-Process -Name "solana-test-validator" -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "🔍 Found $($processes.Count) validator process(es)" -ForegroundColor Blue
    
    foreach ($process in $processes) {
        Write-Host "⚠️  Stopping process ID: $($process.Id)" -ForegroundColor Yellow
        try {
            $process.Kill()
            $process.WaitForExit(5000)  # Wait up to 5 seconds
            Write-Host "✅ Process stopped successfully" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to stop process: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ℹ️  No validator processes found" -ForegroundColor Blue
}

# Optional: Clean up ledger data
$cleanup = Read-Host "🧹 Do you want to clean up the test ledger? (y/N)"
if ($cleanup -eq "y" -or $cleanup -eq "Y") {
    if (Test-Path "test-ledger") {
        try {
            Remove-Item -Recurse -Force "test-ledger"
            Write-Host "✅ Test ledger cleaned up" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to clean ledger: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "ℹ️  No test ledger found" -ForegroundColor Blue
    }
}

Write-Host "🎉 Validator stopped!" -ForegroundColor Green