# Implementation Plan

- [ ] 1. Port EVM contract functionality to Anchor programs
  - Review existing EVM contracts in `evm/contracts/` for all business logic
  - Implement equivalent functionality in Anchor programs in `anchor/programs/`
  - Ensure all EVM contract methods have corresponding Solana program instructions
  - Migrate data structures and state management to Solana account model
  - Verify bounty escrow, multi-signature validation, and reputation tracking work identically
  - Test all contract interactions to ensure feature parity before EVM removal
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
- [ ] 2. Remove EVM-specific files and directories

  - Delete the entire `evm/` directory and all its contents
  - Remove `hardhat.config.ts` from project root
  - Remove `truffle-config.js` from project root
  - Clean up any EVM-related backup files in `Backups/` directory
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ] 3. Update package.json dependencies

  - Remove EVM-specific dependencies (wagmi, viem, ethers, hardhat)
  - Remove any EVM testing libraries and tools
  - Update package-lock.json to reflect dependency changes
  - Verify no unused EVM dependencies remain
  - _Requirements: 2.2_

- [ ] 4. Update TypeScript configuration

  - Remove EVM path aliases from tsconfig.json (@evm/\*)
  - Remove EVM-related excludes that are no longer needed
  - Update path mappings to reflect Solana-only structure
  - _Requirements: 2.1, 4.1_

- [ ] 5. Configure Reown AppKit for Solana-only connections

  - Update WalletProviderWrapper to configure Reown AppKit for Solana wallets only
  - Modify wallet connection logic to filter out non-Solana wallet options
  - Remove EVM wallet connection states and handlers
  - Configure SolanaAdapter within Reown AppKit for optimal Solana integration
  - _Requirements: 1.1, 1.2_

- [ ] 6. Update wallet connection UI components

  - Modify WalletDropdown component to show only Solana wallet options
  - Update wallet connection buttons to reflect Solana-only support
  - Ensure mock wallet mode still works for development
  - Update wallet status indicators for Solana networks only
  - _Requirements: 1.1, 1.2, 5.1, 5.2_

- [ ] 7. Update RPC configuration for Solana only

  - Remove EVM RPC endpoint configurations from environment files
  - Update RPC provider setup to use Solana endpoints exclusively
  - Implement fallback RPC providers for Solana networks
  - Update network switching logic for Solana networks (devnet, testnet, mainnet)
  - _Requirements: 1.4, 4.2_

- [ ] 8. Update smart contract interaction layer

  - Remove EVM contract interfaces and interaction code
  - Ensure all smart contract functionality uses Anchor programs only
  - Update transaction building to use Solana web3.js exclusively
  - Verify all contract addresses reference Solana program IDs
  - _Requirements: 2.3, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Update error handling for Solana-specific errors

  - Remove EVM-specific error handling code
  - Implement Solana-specific error messages and handling
  - Update error display components to show Solana transaction links
  - Ensure mock mode simulates Solana errors appropriately
  - _Requirements: 5.4, 5.5_

- [ ] 10. Update testing configuration

  - Remove EVM/Hardhat test configurations
  - Update test files to use Anchor testing framework only
  - Remove EVM-specific test files and utilities
  - Ensure all tests run with Solana/Anchor setup
  - _Requirements: 4.3, 6.4_

- [ ] 11. Update deployment and build configuration

  - Remove EVM deployment scripts and configurations
  - Update build process to exclude EVM-related files
  - Ensure deployment targets Solana networks only
  - Update CI/CD configuration to reflect Solana-only architecture
  - _Requirements: 4.4, 2.1_

- [ ] 12. Update documentation and README

  - Update README.md to reflect Solana-only architecture
  - Remove references to EVM support in documentation
  - Update setup instructions to require only Solana CLI and Anchor
  - Update architecture diagrams and technical specifications
  - _Requirements: 4.5_

- [ ] 13. Verify feature parity and functionality

  - Test vulnerability submission functionality on Solana
  - Test bounty program creation and management
  - Test multi-signature validation system
  - Test reputation tracking and updates
  - Verify all existing features work seamlessly on Solana
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14. Final cleanup and optimization
  - Remove any remaining EVM references in code comments
  - Optimize bundle size after EVM dependency removal
  - Run full test suite to ensure no regressions
  - Verify mock mode works correctly for all features
  - _Requirements: 2.1, 5.1, 5.5_
