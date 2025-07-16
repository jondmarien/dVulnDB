# DVulnDB Web3 & Blockchain Guidelines

## Wallet Integration Standards
- **Multi-Wallet Support**: Support both Phantom (Solana) and EVM wallets through Reown AppKit
- **Connection States**: Handle connected, connecting, disconnected, and error states
- **Network Switching**: Allow users to switch between supported networks
- **Mock Mode**: Always support `?mock=true` parameter for development and demos
- **Graceful Degradation**: Provide fallback UI when wallets are not available

## Solana Development
- **Anchor Framework**: Use Anchor for all Solana smart contract development
- **Program Structure**: Follow Anchor conventions for program organization
- **Account Management**: Properly handle PDA (Program Derived Address) creation
- **Transaction Building**: Use Anchor's transaction builder for complex operations
- **Error Handling**: Handle Solana-specific errors (insufficient funds, account not found, etc.)

## EVM Development
- **Hardhat Toolchain**: Use Hardhat for contract development, testing, and deployment
- **Solidity Best Practices**: Follow OpenZeppelin standards for security
- **Gas Optimization**: Optimize contracts for gas efficiency
- **Multi-signature**: Implement multi-sig validation for critical operations
- **Upgradeable Contracts**: Use proxy patterns for contract upgrades when needed

## Smart Contract Patterns
- **Bounty Escrow**: Implement secure escrow mechanisms for bug bounty payments
- **Multi-signature Validation**: Require multiple validators for bounty approval
- **Reputation System**: Track researcher reputation on-chain
- **CVE Storage**: Store vulnerability records with IPFS hashes for detailed reports
- **CVSS Integration**: Store official CVSS scores and vectors on-chain

## Security Considerations
- **Input Validation**: Always validate user inputs before blockchain operations
- **Reentrancy Protection**: Use reentrancy guards for state-changing functions
- **Access Control**: Implement proper role-based access control
- **Rate Limiting**: Prevent spam and abuse through rate limiting
- **Audit Trail**: Maintain immutable audit trails for all critical operations

## IPFS Integration
- **Helia Client**: Use Helia for IPFS operations in the browser
- **Content Addressing**: Store vulnerability reports and evidence on IPFS
- **Pinning Strategy**: Implement proper pinning for important content
- **Fallback Mechanisms**: Provide fallbacks when IPFS content is unavailable

## Transaction Management
- **User Confirmation**: Always show transaction details before signing
- **Progress Tracking**: Provide real-time transaction status updates
- **Error Recovery**: Handle failed transactions gracefully with retry options
- **Gas Estimation**: Provide accurate gas estimates for EVM transactions
- **Confirmation Waiting**: Wait for appropriate confirmations before UI updates

## Data Synchronization
- **Event Listening**: Listen to blockchain events for real-time updates
- **State Reconciliation**: Reconcile local state with blockchain state
- **Caching Strategy**: Cache blockchain data appropriately to reduce RPC calls
- **Offline Handling**: Handle offline scenarios gracefully