# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository: dVulnDB (Solana-only migration). This is the initial WARP.md for this repo.

- Shell: Primary development shell is PowerShell (pwsh) on Windows (scripts use .ps1). Linux/macOS equivalents are standard Solana/Anchor/Node commands.
- Package manager: Yarn 4 (Berry) via package.json `packageManager: "yarn@4.5.1"`.

Common commands

- Install deps (Windows/pwsh):
  - yarn install
- Frontend
  - Dev server: yarn dev
  - Build: yarn build
  - Start (after build): yarn start
  - Lint: yarn lint
  - Type check: npx tsc --noEmit (CI uses this)
- Anchor programs
  - Build programs: yarn build:anchor  (alias for anchor build)
  - Local deploy: yarn deploy:local     (alias for anchor deploy; uses [provider] from Anchor.toml)
- Tests (see more in “Tests”)
  - Full suite (Windows runner): yarn test (runs anchor/scripts/test.ps1)
  - Anchor test directly: yarn test:anchor (anchor test)
  - Build contracts then run tests: yarn test:build
  - Unit tests without local validator: yarn test:unit (anchor test --skip-deploy --skip-local-validator)
  - Framework-only (no build needed): yarn test:framework
- Validator control (Windows/pwsh)
  - Start local validator: yarn validator:start (pwsh scripts/start-validator.ps1)
  - Stop local validator: yarn validator:stop (pwsh scripts/stop-validator.ps1)
- Verification utilities
  - Pre-build Solana-only sanity check: yarn build:check
  - Verify on-chain deployments by cluster: yarn verify:devnet | yarn verify:testnet | yarn verify:mainnet

Environment and prerequisites

- Required tooling (see DEPLOYMENT.md for versions): Node.js 18+, Yarn 4, Rust/Cargo, Solana CLI (>= 2.2.20), Anchor CLI (v0.31.1 recommended). Windows development uses pwsh.
- Environment variables commonly used:
  - Frontend: NEXT_PUBLIC_REOWN_PROJECT_ID, NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL, NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL, NEXT_PUBLIC_SOLANA_TESTNET_RPC_URL, NEXT_PUBLIC_SOLANA_NETWORK (default devnet via next.config.js)
  - Anchor/Solana (local/dev): ANCHOR_PROVIDER_URL, ANCHOR_WALLET (anchor/scripts/test.ps1 sets these for tests)
- Yarn is configured in package.json (Yarn 4). If Corepack is enabled, `corepack enable` can help on fresh environments.

High-level architecture and structure

- Frontend (Next.js 15 + TypeScript)
  - App Router under src/app (e.g., src/app/page.tsx, layout.tsx, feature pages under src/app/resources/*and src/app/dvulndb/*)
  - UI/components under src/components/* (dvulndb views, wallet UI, error handling components)
  - React context and hooks under src/context/*and src/hooks/* (ToastContext, Solana transaction/error hooks)
  - Web3/Anchor interaction layer under src/services/anchor/* with service modules per program: bountyEscrowService.ts, vulnerabilityRegistryService.ts, reputationNftService.ts; shared anchor utilities at src/services/anchor/anchorUtils.ts
  - Network/wallet config in lib/* (appkit integration and network-config)
  - TS path aliases (see tsconfig.json):
    - @/*-> ./src/*
    - @components/*-> src/components/*
    - @context/*-> src/context/*
    - @app/*-> src/app/*
    - @utils/*-> src/app/utils/*
    - @hooks/*-> src/app/hooks/*
    - @anchor/*-> anchor/programs/*
    - @public/*-> public/*
    - @lib/*-> lib/*
  - next.config.js contains client bundler fallbacks and externals tuned for Solana web3, security headers, image domains, and standalone output for Docker.
- On-chain programs (Anchor workspace)
  - Root Anchor workspace configured in Anchor.toml
    - Members: anchor/programs/bounty_escrow, anchor/programs/vulnerability_registry, anchor/programs/reputation_nft
    - [provider] defaults to localnet with wallet ~/.config/solana/id.json
    - Program IDs set per cluster under [programs.localnet|devnet|testnet|mainnet]
    - [test] settings include mocha invocation via scripts and timeouts
  - Workspace Cargo.toml pins anchor-lang/anchor-spl versions (0.30.1) and mpl-token-metadata
- CI summary (for reference alignment)
  - Lint/typecheck/build via Yarn and Next
  - Anchor workflow installs Solana/Anchor, builds programs, runs anchor test --skip-local-validator
  - Deploy jobs use anchor deploy to devnet/mainnet and Vercel for frontend

Tests

- Test suites live in anchor/tests/* using mocha/ts-mocha
  - anchor/tests/README.md documents test structure and commands
- Ways to run tests:
  - Full (build + mocha over local validator): yarn test (Windows-friendly runner that starts validator if needed)
  - Direct: yarn test:anchor (anchor test) or yarn test:build (anchor build && anchor test --skip-local-validator)
  - Unit without validator: yarn test:unit
  - Framework-only (no contracts built): yarn test:framework (sets env and runs ts-mocha on anchor/tests/framework.ts)
- Running a single test file (ts-mocha):
  - Windows pwsh from repo root:
    - pwsh -Command "$env:ANCHOR_PROVIDER_URL='http://localhost:8899'; $env:ANCHOR_WALLET='$env:USERPROFILE\.config\solana\id.json'; npx ts-mocha anchor/tests/bounty_escrow.ts --timeout 60000"
  - Or change the file path to one of: anchor/tests/vulnerability_registry.ts, reputation_nft.ts, integration.ts
- Running a single test by name (grep):
  - Add -g "<regex>". Example (Windows pwsh):
    - pwsh -Command "$env:ANCHOR_PROVIDER_URL='http://localhost:8899'; $env:ANCHOR_WALLET='$env:USERPROFILE\.config\solana\id.json'; npx ts-mocha anchor/tests/bounty_escrow.ts -g \"initializes escrow\" --timeout 60000"
  - Note: On pwsh, prefer double quotes and escape inner quotes as shown.

Local validator and clusters

- Start/stop on Windows via scripts:
  - Start: yarn validator:start (handles port conflicts, cleans test-ledger, waits for RPC health)
  - Stop: yarn validator:stop (optionally cleans test-ledger)
- Switch Solana CLI RPC URL for local testing:
  - solana config set --url localhost
- Anchor.toml provider defaults to localnet; for devnet/testnet/mainnet use solana config set --url devnet|testnet|mainnet-beta and provide appropriate wallet

Build, deploy, and verify flows (Anchor)

- Build programs: yarn build:anchor (anchor build)
- Local deploy: yarn deploy:local (anchor deploy)
- Network deploys (PowerShell wrappers):
  - Devnet: yarn deploy:devnet
  - Testnet: yarn deploy:testnet
  - Mainnet: yarn deploy:mainnet
- Post-deploy verification:
  - Verify program accounts by cluster:
    - yarn verify:devnet | yarn verify:testnet | yarn verify:mainnet
    - Optionally pass a frontend URL to scripts/verify-deployment.js to verify HTTP 200

Notes distilled from docs

- README.md: high-level product description and quick start; frontend runs at <http://localhost:3000>
- DEPLOYMENT.md and SOLANA_KEYPAIR_SETUP.md contain detailed Solana/Anchor install steps, keypair creation, CI secrets, and program ID updates per environment. Update Anchor.toml and frontend config with generated program IDs after deploys.

Maintenance

- Update this file when changing: Yarn/Node versions, Next.js major upgrades, Anchor/Solana versions, program IDs, or testing scripts/paths.
