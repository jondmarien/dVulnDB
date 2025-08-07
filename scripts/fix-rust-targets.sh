#!/bin/bash

# Fix Rust targets for Solana development
# This script adds the correct targets for modern Solana development

echo "🔧 Fixing Rust targets for Solana development..."

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

# Update Rust to latest stable
print_status "📦 Updating Rust to latest stable..."
rustup update stable
rustup default stable

# Add required targets for Solana
print_status "🎯 Adding required targets..."

# SBF target (replaces old BPF)
if rustup target add sbf-solana-solana 2>/dev/null; then
    print_success "✅ Added sbf-solana-solana target"
else
    print_warning "⚠️  sbf-solana-solana target not available, trying alternatives..."
    
    # Try wasm32 as fallback
    if rustup target add wasm32-unknown-unknown; then
        print_success "✅ Added wasm32-unknown-unknown target as fallback"
    else
        print_error "❌ Failed to add required targets"
    fi
fi

# Add WASM target (commonly needed)
if rustup target add wasm32-unknown-unknown; then
    print_success "✅ Added wasm32-unknown-unknown target"
fi

# List installed targets
print_status "📋 Currently installed targets:"
rustup target list --installed

print_success "🎉 Rust targets updated!"
print_status "💡 You can now try building with: anchor build"