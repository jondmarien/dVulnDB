#!/bin/bash

# Upgrade Anchor CLI to latest version compatible with Solana 2.2.20

echo "🚀 Upgrading Anchor CLI to v0.31.0..."

# Remove existing Anchor CLI
echo "🗑️  Removing existing Anchor CLI..."
cargo uninstall anchor-cli 2>/dev/null || echo "No existing Anchor CLI found"

# Install latest version
echo "📦 Installing Anchor CLI v0.31.0..."
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --tag v0.31.0

# Verify installation
echo "✅ Verifying installation..."
anchor --version

echo "🎉 Anchor CLI upgrade complete!"
echo "💡 You can now build with: anchor build"