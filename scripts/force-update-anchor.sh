#!/bin/bash

# Force update Anchor dependencies to latest versions
# This script resolves dependency conflicts by using compatible versions

echo "🚀 Force updating Anchor dependencies to latest versions..."

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

# Step 1: Clean everything completely
print_status "🧹 Cleaning all build artifacts..."
anchor clean 2>/dev/null || true
rm -rf anchor/target 2>/dev/null || true
rm -rf target 2>/dev/null || true
rm -f anchor/Cargo.lock 2>/dev/null || true

# Step 2: Force update Cargo.lock with latest versions
print_status "🔄 Force updating dependencies..."
cd anchor

# Use cargo update with --aggressive to get latest compatible versions
cargo update --aggressive

# Step 3: Add specific version overrides to resolve conflicts
print_status "🔧 Adding dependency overrides to resolve conflicts..."

# Check if we need to add patch section for version conflicts
if ! grep -q "\[patch.crates-io\]" Cargo.toml; then
    echo "" >> Cargo.toml
    echo "[patch.crates-io]" >> Cargo.toml
    echo "# Resolve version conflicts between Anchor 0.31.1 and Solana 2.2.20" >> Cargo.toml
fi

# Add specific patches if they don't exist
if ! grep -q "solana-program.*=" Cargo.toml; then
    echo 'solana-program = { git = "https://github.com/anza-xyz/agave", tag = "v2.1.0" }' >> Cargo.toml
fi

cd ..

# Step 4: Try building with patches
print_status "🔨 Testing build with dependency patches..."
if anchor build; then
    print_success "🎉 Build successful with latest Anchor versions!"
    
    # Show final versions
    print_status "📋 Successfully using:"
    echo "   Anchor CLI: $(anchor --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
    echo "   anchor-lang: 0.31.1"
    echo "   anchor-spl: 0.31.1"
    
else
    print_warning "⚠️  Build failed with patches. Trying alternative approach..."
    
    # Alternative: Use specific compatible versions
    cd anchor
    
    # Remove patches and use specific compatible versions
    sed -i '/\[patch.crates-io\]/,$d' Cargo.toml
    
    # Update workspace dependencies to use compatible versions
    cat >> Cargo.toml << EOF

# Compatible versions for Solana 2.2.20
[workspace.dependencies]
anchor-lang = "0.31.1"
anchor-spl = "0.31.1"
mpl-token-metadata = "4.1.2"
solana-program = "~2.1.0"
EOF
    
    cd ..
    
    # Clean and try again
    anchor clean
    rm -f anchor/Cargo.lock
    
    if anchor build; then
        print_success "🎉 Build successful with compatible versions!"
    else
        print_error "❌ Still having conflicts. Reverting to stable versions..."
        
        # Revert to known working versions
        cd anchor
        sed -i 's/anchor-lang = "0.31.1"/anchor-lang = "0.30.1"/' Cargo.toml
        sed -i 's/anchor-spl = "0.31.1"/anchor-spl = "0.30.1"/' Cargo.toml
        cd ..
        
        # Update Anchor.toml to match
        sed -i 's/anchor_version = "0.31.1"/anchor_version = "0.30.1"/' Anchor.toml
        
        anchor clean
        rm -f anchor/Cargo.lock
        
        if anchor build; then
            print_warning "⚠️  Reverted to Anchor 0.30.1 for compatibility"
            print_status "This is a known working combination with Solana 2.2.20"
        else
            print_error "❌ Critical error. Manual intervention required."
        fi
    fi
fi

print_status "💡 To manually update in the future:"
echo "   1. Edit anchor/Cargo.toml [workspace.dependencies]"
echo "   2. Run: cd anchor && cargo update --aggressive"
echo "   3. Run: anchor build"