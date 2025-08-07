# DVulnDB Anchor Testing

This directory contains the test suite for the DVulnDB Solana programs after the EVM migration.

## Test Structure

- `framework.ts` - Basic test framework validation (works without built contracts)
- `bounty_escrow.ts` - Tests for the bounty escrow program
- `vulnerability_registry.ts` - Tests for the vulnerability registry program  
- `reputation_nft.ts` - Tests for the reputation NFT program
- `integration.ts` - Integration tests across all programs
- `utils.ts` - Test utilities and helper functions

## Running Tests

### Prerequisites

1. Install Anchor CLI: https://www.anchor-lang.com/docs/installation
2. Install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools
3. Install dependencies: `yarn install`

### Test Commands

```bash
# Run all tests (requires built contracts)
yarn test

# Run test framework validation only (works without built contracts)
yarn test:framework

# Build contracts and run tests
yarn test:build

# Run unit tests only
yarn test:unit
```

### Building Contracts First

If you get errors about missing types or programs, you need to build the contracts first:

```bash
cd anchor
anchor build
```

This will generate the necessary type definitions in `target/types/` that the tests import.

### Test Behavior

- Tests will automatically skip if contracts are not built yet
- Framework tests will always run to validate the test setup
- Integration tests require all three programs to be built
- Tests use local Solana validator for isolated testing

### Adding New Tests

When adding new tests:

1. Follow the existing pattern of checking if programs are built
2. Use the test utilities in `utils.ts` for common operations
3. Add proper error handling and cleanup
4. Document test requirements and expected behavior

## Test Configuration

- `tsconfig.json` - TypeScript configuration for tests
- `.mocharc.json` - Mocha test runner configuration
- Test timeout is set to 60 seconds to handle blockchain operations
- Tests use Chai assertion library