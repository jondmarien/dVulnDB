# DVulnDB - Decentralized Vulnerability Database

This project is a modern Web3 vulnerability disclosure and bug bounty platform for cybersecurity professionals.

## Project Structure

- **src/**: Main frontend (Next.js, React, TypeScript, Solana wallet integration)
- **evm/**: All EVM (Ethereum) smart contracts, deployment scripts, and tests
- **public/**: Static assets

## Solana Wallet Integration

- The frontend uses the [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) for wallet connectivity (Phantom, etc.)
- Network: `devnet` by default
- Wallet connect UI is available globally via the WalletMultiButton

## Running the Frontend

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## EVM (Ethereum) Code

- All EVM contracts, deployment scripts, and tests are in the `evm/` directory
- To work with EVM contracts, `cd evm` and use Hardhat as usual

## Path Aliases

- Common path aliases are set up in `tsconfig.json` (e.g., `@components`, `@context`, `@app`, etc.)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
