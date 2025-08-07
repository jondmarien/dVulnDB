#!/bin/bash

# Ubuntu-specific Anchor build script for DVulnDB
# This script handles common build issues on Ubuntu

set -e

echo "🚀 Building DVulnDB Anchor Programs on Ubuntu..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "🔍 Checking dependencies..."
    
    if ! command -v solana &> /dev/null; then
        print_error "❌ Solana CLI not found. Please install it first."
        echo "Run: sh -c \"\$(curl -sSfL https://release.solana.com/v1.18.26/install)\""
        exit 1
    fi
    
    if ! command -v anchor &> /dev/null; then
        # Check if AVM is installed
        if command -v avm &> /dev/null; then
            print_warning "⚠️  AVM found but 'anchor' command not available."
            echo "Run: avm install 0.31.0 && avm use 0.31.0"
            echo "Or run: ./scripts/setup-anchor-avm.sh"
        else
            print_error "❌ Anchor CLI not found. Please install it first."
            echo "Option 1 (AVM): cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
            echo "Option 2 (Direct): cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --tag v0.31.0"
        fi
        exit 1
    fi
    
    if ! command -v cargo &> /dev/null; then
        print_error "❌ Rust/Cargo not found. Please install Rust first."
        echo "Run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        exit 1
    fi
    
    print_success "✅ All dependencies found"
}

# Check versions for compatibility
check_versions() {
    print_status "📋 Checking tool versions..."
    
    SOLANA_VERSION=$(solana --version | cut -d' ' -f2)
    ANCHOR_VERSION=$(anchor --version | cut -d' ' -f2)
    RUST_VERSION=$(rustc --version | cut -d' ' -f2)
    
    echo "   Solana CLI: $SOLANA_VERSION"
    echo "   Anchor CLI: $ANCHOR_VERSION"
    echo "   Rust: $RUST_VERSION"
    
    # Check if versions are compatible
    if [[ ! "$SOLANA_VERSION" =~ ^2\.[0-9]+\. ]]; then
        print_warning "⚠️  Solana version $SOLANA_VERSION may not be compatible. Recommended: 2.x.x"
    fi
    
    if [[ ! "$ANCHOR_VERSION" =~ ^0\.31\. ]]; then
        print_warning "⚠️  Anchor version $ANCHOR_VERSION may not be compatible. Recommended: 0.31.x"
    fi
}

# Clean build artifacts
clean_build() {
    print_status "🧹 Cleaning build artifacts..."
    
    # Clean Anchor artifacts
    if [ -d "anchor/target" ]; then
        rm -rf anchor/target
        print_success "   Cleaned anchor/target"
    fi
    
    # Clean Cargo artifacts
    if [ -d "target" ]; then
        rm -rf target
        print_success "   Cleaned target"
    fi
    
    # Clean Anchor cache
    anchor clean 2>/dev/null || true
    print_success "   Cleaned Anchor cache"
    
    # Clean Cargo cache for this project
    cargo clean 2>/dev/null || true
    print_success "   Cleaned Cargo cache"
}

# Setup Rust toolchain
setup_toolchain() {
    print_status "🔧 Setting up Rust toolchain..."
    
    # Ensure we're using stable Rust
    rustup default stable
    rustup update stable
    
    # Add SBF target for Solana (replaces old BPF target)
    if ! rustup target list --installed | grep -q "sbf-solana-solana"; then
        print_status "   Adding SBF target for Solana..."
        rustup target add sbf-solana-solana
    fi
    
    # Also add wasm32 target which is commonly needed
    if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
        print_status "   Adding WASM target..."
        rustup target add wasm32-unknown-unknown
    fi
    
    print_success "✅ Rust toolchain configured"
}

# Build programs
build_programs() {
    print_status "🔨 Building Anchor programs..."
    
    # Set environment variables for consistent builds
    export RUST_LOG=error
    export ANCHOR_PROVIDER_URL="http://localhost:8899"
    
    # Build with verbose output for debugging
    if anchor build --verbose; then
        print_success "✅ Build successful!"
        
        # Show build artifacts
        print_status "📦 Build artifacts:"
        if [ -d "anchor/target/deploy" ]; then
            ls -la anchor/target/deploy/
        fi
        
        return 0
    else
        print_error "❌ Build failed!"
        return 1
    fi
}

# Verify build
verify_build() {
    print_status "🔍 Verifying build..."
    
    local programs=("bounty_escrow" "vulnerability_registry" "reputation_nft")
    local all_found=true
    
    for program in "${programs[@]}"; do
        if [ -f "anchor/target/deploy/${program}.so" ]; then
            print_success "   ✅ ${program}.so found"
        else
            print_error "   ❌ ${program}.so missing"
            all_found=false
        fi
    done
    
    if [ "$all_found" = true ]; then
        print_success "✅ All programs built successfully"
        return 0
    else
        print_error "❌ Some programs failed to build"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 Starting DVulnDB Anchor build process..."
    echo "================================================"
    
    check_dependencies
    check_versions
    
    # Ask user if they want to clean first
    read -p "🧹 Clean build artifacts first? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        clean_build
    fi
    
    setup_toolchain
    
    if build_programs && verify_build; then
        echo "================================================"
        print_success "🎉 Build completed successfully!"
        print_status "💡 You can now run tests with: anchor test"
        exit 0
    else
        echo "================================================"
        print_error "❌ Build failed!"
        print_warning "💡 Try the following troubleshooting steps:"
        echo "   1. Run with clean: $0 --clean"
        echo "   2. Check Solana/Anchor versions are compatible"
        echo "   3. Ensure you have enough disk space"
        echo "   4. Check the error messages above"
        exit 1
    fi
}

# Handle command line arguments
if [[ "$1" == "--clean" ]]; then
    clean_build
    exit 0
elif [[ "$1" == "--help" || "$1" == "-h" ]]; then
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --clean    Clean build artifacts and exit"
    echo "  --help     Show this help message"
    echo ""
    echo "This script builds DVulnDB Anchor programs on Ubuntu with proper"
    echo "toolchain management and error handling."
    exit 0
fi

# Run main function
main