#!/bin/bash

# Fix Solana toolchain rust-src component
# This script adds the missing rust-src component to the Solana toolchain

echo "🔧 Fixing Solana toolchain rust-src component..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Check available toolchains
print_status "📋 Available Rust toolchains:"
rustup toolchain list

# Try to add rust-src to solana toolchain
print_status "🔧 Adding rust-src component to Solana toolchain..."

# Try different possible Solana toolchain names
SOLANA_TOOLCHAINS=("solana" "solana-1.48.0" "solana-1.48" "bpf" "sbf")

for toolchain in "${SOLANA_TOOLCHAINS[@]}"; do
    if rustup toolchain list | grep -q "$toolchain"; then
        print_status "📦 Found toolchain: $toolchain"
        if rustup component add rust-src --toolchain "$toolchain"; then
            print_success "✅ Added rust-src to $toolchain toolchain"
            break
        else
            print_warning "⚠️  Failed to add rust-src to $toolchain"
        fi
    fi
done

# Also add to stable toolchain as fallback
print_status "📦 Adding rust-src to stable toolchain as fallback..."
rustup component add rust-src

# Update Solana installation
print_status "🔄 Updating Solana installation..."
solana-install update

# Check if the issue is resolved
print_status "🔍 Testing if the issue is resolved..."
if anchor build --verbose 2>&1 | grep -q "rust-src"; then
    print_error "❌ rust-src issue still present"
    
    print_status "💡 Alternative solutions:"
    echo "1. Try: rustup component add rust-src --toolchain stable"
    echo "2. Try: solana-install init"
    echo "3. Check: ls ~/.cache/solana/*/platform-tools/rust/lib/rustlib/src/"
    
else
    print_success "🎉 Toolchain issue resolved!"
fi

print_status "📋 Current toolchain status:"
rustup show