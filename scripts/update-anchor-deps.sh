#!/bin/bash

# Update Anchor dependencies to match CLI version
# This script updates all anchor-lang dependencies to match the CLI

echo "🔄 Updating Anchor dependencies..."

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

# Check current CLI version
CLI_VERSION=$(anchor --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
print_status "📋 Current Anchor CLI version: $CLI_VERSION"

# Clean all build artifacts
print_status "🧹 Cleaning build artifacts..."
anchor clean
rm -rf anchor/target
cargo clean --manifest-path anchor/Cargo.toml

# Update Cargo.lock
print_status "🔄 Updating dependencies..."
cd anchor
cargo update
cd ..

# Verify the update
print_status "🔍 Verifying dependency versions..."
if grep -q "anchor-lang = \"$CLI_VERSION\"" anchor/Cargo.toml; then
    print_success "✅ anchor-lang version matches CLI: $CLI_VERSION"
else
    print_warning "⚠️  anchor-lang version may not match CLI version"
    echo "Workspace dependencies:"
    grep -A 5 "\[workspace.dependencies\]" anchor/Cargo.toml
fi

# Try building
print_status "🔨 Testing build..."
if anchor build; then
    print_success "🎉 Build successful! Dependencies updated correctly."
else
    print_error "❌ Build failed. Check the error messages above."
    exit 1
fi

print_success "✅ Anchor dependencies updated successfully!"