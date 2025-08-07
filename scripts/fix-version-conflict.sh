#!/bin/bash

# Fix Anchor/Solana version conflicts
# This script resolves dependency conflicts between Anchor and Solana versions

echo "🔧 Fixing Anchor/Solana version conflicts..."

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

# Check current versions
SOLANA_VERSION=$(solana --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
ANCHOR_VERSION=$(anchor --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')

print_status "📋 Current versions:"
echo "   Solana CLI: $SOLANA_VERSION"
echo "   Anchor CLI: $ANCHOR_VERSION"

# The issue: Solana 2.2.20 with Anchor 0.31.1 has dependency conflicts
# Solution: Use Anchor 0.30.1 which is stable with Solana 2.x

print_status "🔄 Setting compatible versions..."

# Use AVM to switch to compatible Anchor version
if command -v avm &> /dev/null; then
    print_status "📦 Installing compatible Anchor version with AVM..."
    avm install 0.30.1
    avm use 0.30.1
    
    # Verify the switch
    NEW_ANCHOR_VERSION=$(anchor --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
    print_success "✅ Switched to Anchor CLI: $NEW_ANCHOR_VERSION"
else
    print_warning "⚠️  AVM not found. You may need to manually install Anchor 0.30.1"
    echo "Run: cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --tag v0.30.1 --force"
fi

# Clean everything
print_status "🧹 Cleaning all build artifacts..."
anchor clean 2>/dev/null || true
rm -rf anchor/target 2>/dev/null || true
rm -rf target 2>/dev/null || true
rm -f anchor/Cargo.lock 2>/dev/null || true

# Update dependencies
print_status "🔄 Updating dependencies..."
cd anchor 2>/dev/null && cargo update && cd .. || echo "Skipping cargo update"

# Try building
print_status "🔨 Testing build with compatible versions..."
if anchor build; then
    print_success "🎉 Build successful! Version conflict resolved."
    
    # Show final versions
    print_status "📋 Final working configuration:"
    echo "   Solana CLI: $(solana --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
    echo "   Anchor CLI: $(anchor --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
    echo "   anchor-lang: $(grep 'anchor-lang =' anchor/Cargo.toml | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
    
else
    print_error "❌ Build still failing. Let's try alternative approach..."
    
    # Alternative: Try with specific solana-program version
    print_status "🔧 Trying with pinned solana-program version..."
    
    # Add specific solana-program version to workspace
    if ! grep -q "solana-program" anchor/Cargo.toml; then
        sed -i '/mpl-token-metadata/a solana-program = "2.1.0"' anchor/Cargo.toml
        print_status "📌 Pinned solana-program to 2.1.0"
    fi
    
    # Clean and try again
    anchor clean
    rm -f anchor/Cargo.lock
    
    if anchor build; then
        print_success "🎉 Build successful with pinned dependencies!"
    else
        print_error "❌ Build still failing. Manual intervention needed."
        print_warning "💡 Try these steps manually:"
        echo "   1. Check anchor/Cargo.toml for version conflicts"
        echo "   2. Run: cargo tree --manifest-path anchor/Cargo.toml"
        echo "   3. Consider using older Anchor version: avm use 0.29.0"
    fi
fi