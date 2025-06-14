Step 1: Clean Up and Prepare the Project Structure
Goals:
Clarify the separation between EVM (Ethereum) and Solana code.
Prepare for Solana wallet integration in the frontend.
Remove EVM wallet code from the frontend.
Actions:
Move all EVM-specific contracts and deployment scripts into a dedicated directory (e.g., evm/).
Create a new directory for Solana-specific code if you plan to add Rust programs in the future (e.g., solana/).
Clean up the frontend by removing the current EVM wallet context and related code.


Step 2: Install Solana Wallet Adapter Packages
Goals:
Add the required Solana wallet adapter packages for React/Next.js.
Ensure Phantom wallet and devnet/testnet support.


Step 3: Implement Solana Wallet Integration in the Frontend
Goals:
Add the Solana wallet adapter providers and Phantom wallet support.
Add a wallet connect button and update the app to use the new context/hooks.


Step 4: Remove EVM Wallet Integration from the Frontend
Goals:
Remove the old WalletContext.tsx and any EVM wallet UI/components.
Update any pages/components that used the old wallet context to use the new Solana wallet hooks.


Step 5: Final Project Structure Cleanup
Goals:
Ensure the project structure is clear, with EVM and Solana code separated.
Update documentation and configs as needed.