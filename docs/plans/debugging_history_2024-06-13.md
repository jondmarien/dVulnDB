# Debugging & Migration History — 2024-06-13

## Project: DVulnDB — Solana Wallet Integration & Monorepo Migration

---

### 1. **Initial Migration Plan**
- Separated EVM (Ethereum) contracts/scripts into `evm/`.
- Cleaned up frontend, removed EVM wallet context.
- Planned Solana wallet integration using wallet adapter packages.

---

### 2. **Solana Wallet Adapter Setup**
- Installed:
  - `@solana/wallet-adapter-base`
  - `@solana/wallet-adapter-react`
  - `@solana/wallet-adapter-react-ui`
  - `@solana/wallet-adapter-wallets`
  - `@solana/web3.js`
- Updated frontend layout to use Solana wallet providers and Phantom wallet.
- Removed all EVM wallet UI/components from the frontend.

---

### 3. **Monorepo/Package Management**
- Decided to use a single root `package.json` for all dependencies (frontend + EVM).
- Removed `evm/package.json` and consolidated all dependencies in root.
- Cleaned up duplicate dependencies and ensured all wallet adapter packages are in `dependencies` (not `devDependencies`).

---

### 4. **React/Next.js Version Issues**
- Upgraded/downgraded between Next.js 14.x and 15.x to test compatibility.
- Ensured `react` and `react-dom` are both at `18.3.1` in root `package.json`.
- Cleaned up all duplicate/extra React versions in subfolders.
- Repeatedly deleted `node_modules`, `.next`, and `package-lock.json` and reinstalled.

---

### 5. **Persistent Errors Encountered**
- `TypeError: (0 , react__WEBPACK_IMPORTED_MODULE_0__.createContext) is not a function` (dev & build)
- `Cannot find module '@solana/wallet-adapter-wallets' or its corresponding type declarations.`
- Linter/type errors for all wallet adapter packages.
- Peer dependency warnings for React 18 vs. React 16/17 in some sub-dependencies.
- Build error: `Failed to collect page data for /resources/cvss` (same root cause)

---

### 6. **Troubleshooting Steps Attempted**
- Verified all wallet adapter packages are in `dependencies` and at latest stable versions ([npm reference](https://www.npmjs.com/package/@solana/wallet-adapter-react)).
- Checked for duplicate React installs with `npm ls react` and `find . -name react`.
- Checked for symlinks in `node_modules` with `find node_modules -type l`.
- Ensured no `node_modules` in subfolders (like `evm/`).
- Checked all React imports use ESM syntax (`import ... from 'react'`).
- Ensured no custom Webpack/Next.js config aliases for React.
- Renamed `next.config.ts` to `next.config.js` and used CommonJS export.
- Updated `tsconfig.json`:
  - Set `target` to `ES2020` (for BigInt support)
  - Set `moduleResolution` to `node`
- Reinstalled all wallet adapter packages after every config change.
- Used `npm install --save` to ensure packages are in `dependencies`.
- Verified all package versions against [official repo](https://github.com/anza-xyz/wallet-adapter).

---

### 7. **Other Issues/Warnings**
- Numerous npm warnings about deprecated packages (from EVM/legacy deps).
- Peer dependency warnings for React 16/17 in QR code and modal sub-deps (not fatal).
- Linter errors for missing type declarations (due to missing or misinstalled packages).

---

### 8. **Current Status**
- All wallet adapter packages are present and at correct versions.
- Still encountering `createContext` runtime error and module not found/type errors for wallet adapter packages.
- All major troubleshooting steps for React/Next.js module resolution have been attempted.

---

### 9. **Next Steps (Recommended)**
- Consider testing in a fresh clone or new environment to rule out local corruption.
- Try a minimal Next.js + Solana wallet adapter setup in a new folder to isolate the issue.
- If the error persists, escalate to the maintainers or community for deep-dive debugging.

---

**Document generated on 2024-06-13.** 