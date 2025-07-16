# DVulnDB Tech Stack & Architecture

## Frontend Stack
- **Next.js 15** with App Router for modern React development
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS 4** for utility-first styling with custom cyberpunk theme
- **Framer Motion** for animations and transitions
- **Lucide React** for consistent iconography

## Web3 & Blockchain
- **Multi-chain Architecture**: Support for both Solana and EVM chains
- **Solana**: Primary blockchain with Anchor framework for smart contracts
- **EVM**: Hardhat for Ethereum development and testing
- **Wallet Integration**: 
  - Phantom wallet for Solana
  - Reown AppKit (formerly WalletConnect) for multi-chain support
  - Wagmi for Ethereum wallet management
- **Web3 Libraries**: Solana web3.js, Viem for Ethereum interactions

## Smart Contracts
- **Solana**: Anchor framework with Rust-based programs
- **EVM**: Solidity contracts with Hardhat toolchain
- **Key Contracts**: Bounty escrow, multi-signature validation, reputation tracking

## Storage & Data
- **IPFS**: Decentralized storage using Helia for vulnerability reports and evidence
- **On-chain**: CVE records, CVSS scores, bounty information
- **Local State**: React Query for client-side caching

## Development Tools
- **TypeScript**: Strict type checking across the entire codebase
- **ESLint**: Code quality and consistency
- **Path Aliases**: Organized imports with @ prefixes
- **Environment**: Local development with ngrok for testing

## Architecture Patterns
- **Component-based**: Modular React components with clear separation of concerns
- **Hook-based State**: Custom hooks for Web3 interactions and data fetching
- **Context Providers**: Global state management for wallet and app state
- **Server Components**: Next.js App Router with RSC where appropriate