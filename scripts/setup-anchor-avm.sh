#!/bin/bash

# Setup Anchor using AVM (Anchor Version Manager)
# This script properly handles AVM installations

echo "🚀 Setting up Anchor CLI using AVM..."

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

# Check if AVM is installed
if command -v avm &> /dev/null; then
    print_success "✅ AVM (Anchor Version Manager) found"
    
    # List available versions
    print_status "📋 Available Anchor versions:"
    avm list
    
    # Install and use latest version
    print_status "📦 Installing Anchor v0.31.1..."
    avm install 0.31.1
    
    print_status "🔧 Setting Anchor v0.31.1 as default..."
    avm use 0.31.1
    
    # Verify installation
    print_status "✅ Verifying installation..."
    anchor --version
    
    # Create symlink if needed
    if ! command -v anchor &> /dev/null; then
        print_warning "⚠️  'anchor' command not found, checking for versioned binary..."
        
        # Find the anchor binary
        ANCHOR_BIN=$(find ~/.avm/bin -name "anchor-*" | head -1)
        if [ -n "$ANCHOR_BIN" ]; then
            print_status "🔗 Found anchor binary at: $ANCHOR_BIN"
            
            # Add to PATH or create alias
            echo "export PATH=\"\$HOME/.avm/bin:\$PATH\"" >> ~/.bashrc
            echo "alias anchor='$ANCHOR_BIN'" >> ~/.bashrc
            
            print_success "✅ Added anchor to PATH and created alias"
            print_warning "💡 Run 'source ~/.bashrc' or restart your terminal"
        fi
    fi
    
else
    print_error "❌ AVM not found. Installing AVM first..."
    
    # Install AVM
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    
    # Add to PATH
    echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/.cargo/bin:$PATH"
    
    print_success "✅ AVM installed"
    
    # Now install Anchor
    print_status "📦 Installing Anchor v0.31.1 with AVM..."
    avm install 0.31.1
    avm use 0.31.1
fi

print_success "🎉 Anchor setup complete!"
print_status "💡 You can now use: anchor --version"