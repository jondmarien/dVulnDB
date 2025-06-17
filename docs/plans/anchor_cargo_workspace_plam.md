# Anchor Cargo Workspace Plan

## Notes
- Anchor programs reside in `anchor/programs/` (e.g., `bounty_escrow`).
- Program-level `Cargo.toml` for `bounty_escrow` has been recreated and now references workspace dependencies.
- Workspace-level `anchor/Cargo.toml` has been created and validated.
- Anchor build currently fails: missing `cargo-build-sbf` and version mismatch between Anchor CLI (0.31.1) and `anchor-lang` (0.31.0).
- User wants a generalized workspace-level `Cargo.toml` under the `anchor/` folder to handle many programs.

## Task List
- [x] Research minimal Anchor `Cargo.toml` template.
- [x] Create `anchor/programs/bounty_escrow/Cargo.toml`.
- [x] Create `anchor/Cargo.toml` workspace referencing `programs/*` and common dependencies.
- [x] Recreate minimal program-level `Cargo.toml` for `bounty_escrow` referencing workspace dependencies.
- [x] Refactor program-level `Cargo.toml` to use workspace dependencies (e.g., `anchor-lang` via `[workspace.dependencies]`).
- [ ] Install `cargo-build-sbf` / required Anchor BPF toolchain.
- [ ] Align Anchor CLI and `anchor-lang` versions; update `Anchor.toml`.
- [ ] Run `anchor build` to verify workspace builds successfully.
- [ ] Document procedure for adding additional programs to the workspace.

## Current Goal
Fix anchor build by installing BPF toolchain and version alignment