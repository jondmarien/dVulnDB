# Design Document

## Overview

This design document outlines the migration of DVulnDB from a multi-chain architecture (supporting both Solana and EVM chains) to a Solana-only implementation. The migration will simplify the codebase, improve performance, and leverage Solana's advantages including speed and proof-of-stake consensus while maintaining all existing functionality.

The migration involves removing all EVM-specific code, dependencies, and infrastructure while ensuring that all core features continue to work seamlessly on Solana. This includes vulnerability submission, bounty programs, multi-signature validation, and reputation tracking.

## Architecture

### Current Multi-Chain Architecture
- Frontend supports both Phantom (Solana) and EVM wallets via Reown AppKit
- Smart contracts deployed on both Solana (Anchor programs) and EVM chains (Solidity contracts)
- Dual RPC endpoint configuration for both blockchain types
- Separate deployment scripts and testing frameworks

### Target Solana-Only Architecture
- Frontend exclusively supports Phantom wallet connections
- All smart contract functionality consolidated into Anchor programs
- Single RPC endpoint configuration for Solana networks only
- Unified deployment and testing pipeline using Anchor framework

### Migration Strategy
The migration will follow a systematic approach:
1. **Code Removal**: Remove all EVM-specific files, dependencies, and configurations
2. **Wallet Integration**: Simplify wallet connection to Phantom-only
3. **Smart Contract Consolidation**: Ensure all EVM contract functionality exists in Anchor programs
4. **Configuration Updates**: Update all configuration files to reflect Solana-only setup
5. **Testing Updates**: Migrate all tests to use Solana/Anchor testing framework
## Co
mponents and Interfaces

### Wallet Connection Component
**Current Implementation:**
- Supports multiple wallet types through Reown AppKit
- Handles both Solana and EVM wallet connections
- Network switching between different blockchain types

**Target Implementation:**
- Phantom wallet connection only
- Simplified connection state management
- Solana network switching (devnet, testnet, mainnet)
- Maintains same UI/UX patterns for seamless user experience

```typescript
interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  network: 'devnet' | 'testnet' | 'mainnet-beta';
  connecting: boolean;
  error: string | null;
}
```

### Smart Contract Interface Layer
**Current Implementation:**
- Dual interface supporting both Anchor programs and EVM contracts
- Separate transaction builders for each blockchain type
- Different error handling patterns

**Target Implementation:**
- Unified Anchor program interface
- Single transaction building pattern
- Consistent Solana error handling
- Maintains same business logic and functionality

```typescript
interface ContractInterface {
  submitVulnerability(data: VulnerabilityData): Promise<string>;
  createBountyProgram(program: BountyProgram): Promise<string>;
  validateSubmission(submissionId: string): Promise<boolean>;
  updateReputation(researcher: string, points: number): Promise<void>;
}
```

### Configuration Management
**Current Implementation:**
- Multiple RPC endpoint configurations
- Separate environment variables for each blockchain
- Dual deployment configurations

**Target Implementation:**
- Single Solana RPC configuration with fallback providers
- Simplified environment variable structure
- Unified deployment configuration using Anchor

## Data Models

### Blockchain Transaction Data
```typescript
interface SolanaTransaction {
  signature: string;
  slot: number;
  blockTime: number;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized';
  fee: number;
  programId: string;
  accounts: string[];
}
```

### Vulnerability Record (On-Chain)
```typescript
interface VulnerabilityRecord {
  id: string;
  submitter: PublicKey;
  ipfsHash: string;
  cvssScore: number;
  cvssVector: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  status: 'Submitted' | 'Under Review' | 'Validated' | 'Rejected';
  bountyAmount: number;
  validatorCount: number;
  submittedAt: number; // Unix timestamp
  blockchainTxHash: string;
}
```

### Bounty Program (On-Chain)
```typescript
interface BountyProgram {
  id: string;
  creator: PublicKey;
  escrowAccount: PublicKey;
  totalPool: number;
  remainingPool: number;
  minSeverity: string;
  maxPayout: number;
  validatorRequirements: number;
  status: 'Active' | 'Paused' | 'Completed';
  createdAt: number;
}
```

## Error Handling

### Solana-Specific Error Handling
- **Insufficient Funds**: Handle SOL balance checks and provide clear user feedback
- **Account Not Found**: Graceful handling of uninitialized accounts
- **Transaction Timeout**: Retry mechanisms for failed transactions
- **Network Congestion**: Fallback RPC providers and user notifications
- **Program Errors**: Specific error codes from Anchor programs with user-friendly messages

### User Experience Error Patterns
```typescript
interface ErrorState {
  type: 'wallet' | 'transaction' | 'network' | 'program';
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  suggestedAction?: string;
}
```

### Mock Mode Error Simulation
- Simulate common Solana errors in mock mode for testing
- Provide realistic error scenarios for development
- Maintain error handling patterns consistent with live blockchain

## Testing Strategy

### Unit Testing
- **Component Tests**: Test wallet connection components with Solana-only logic
- **Hook Tests**: Test custom hooks for Solana interactions
- **Utility Tests**: Test Solana address validation and transaction building
- **Mock Integration**: Ensure all components work in mock mode

### Integration Testing
- **Anchor Program Tests**: Comprehensive testing of all smart contract functionality
- **RPC Integration**: Test with multiple Solana RPC providers
- **Transaction Flow**: End-to-end transaction testing
- **Error Scenarios**: Test all error handling paths

### Migration Testing
- **Feature Parity**: Verify all EVM features work equivalently on Solana
- **Data Migration**: Test migration of existing data to Solana-only format
- **Performance Testing**: Ensure performance improvements from simplification
- **Regression Testing**: Verify no functionality is lost during migration

### Test Environment Setup
```typescript
// Anchor test configuration
describe('DVulnDB Solana Programs', () => {
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.DvulndbProgram;
  
  beforeEach(async () => {
    // Setup test accounts and state
  });
  
  it('should submit vulnerability', async () => {
    // Test vulnerability submission
  });
});
```

## Design Decisions and Rationales

### Decision 1: Complete EVM Removal vs Gradual Deprecation
**Decision**: Complete removal of all EVM code and dependencies
**Rationale**: 
- Simplifies codebase maintenance significantly
- Eliminates dual-chain complexity and potential bugs
- Reduces bundle size and improves performance
- Focuses development resources on Solana optimization
- Cleaner architecture without legacy code paths

### Decision 2: Phantom Wallet Only vs Multi-Wallet Support
**Decision**: Support Phantom wallet exclusively
**Rationale**:
- Phantom is the most popular and well-supported Solana wallet
- Reduces complexity in wallet connection logic
- Maintains consistent user experience
- Can add other Solana wallets later if needed
- Aligns with Solana-first approach

### Decision 3: Anchor Program Consolidation
**Decision**: Ensure all EVM contract functionality exists in Anchor programs
**Rationale**:
- Maintains feature parity during migration
- Leverages Solana's performance advantages
- Provides better developer experience with Anchor framework
- Enables future Solana-specific optimizations
- Reduces smart contract audit surface area

### Decision 4: Configuration Simplification
**Decision**: Single RPC configuration with fallback providers
**Rationale**:
- Reduces configuration complexity
- Improves reliability with multiple RPC providers
- Simplifies deployment and environment management
- Better error handling and failover capabilities
- Easier to maintain and debug

### Decision 5: Gradual UI Migration
**Decision**: Maintain existing UI/UX patterns during migration
**Rationale**:
- Provides seamless user experience during transition
- Reduces user confusion and learning curve
- Allows focus on backend migration first
- Enables UI optimizations in future iterations
- Maintains brand consistency and user familiarity

## Implementation Considerations

### Performance Optimizations
- Leverage Solana's fast transaction speeds
- Optimize RPC call patterns for better performance
- Implement efficient caching strategies
- Reduce bundle size by removing EVM dependencies

### Security Considerations
- Maintain same security standards with Solana-specific implementations
- Ensure proper account validation and access control
- Implement secure transaction signing patterns
- Maintain audit trails and immutable records

### Backward Compatibility
- Provide clear migration path for existing users
- Maintain data integrity during transition
- Support legacy data formats where necessary
- Clear communication about changes to users

### Future Extensibility
- Design architecture to easily add Solana-specific features
- Maintain clean separation of concerns
- Enable future integration with Solana ecosystem tools
- Prepare for potential Solana protocol upgrades