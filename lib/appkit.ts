import { createAppKit } from "@reown/appkit";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { clusterApiUrl } from "@solana/web3.js";
// Create the Solana adapter
export const solanaAdapter = new SolanaAdapter({
  // Using only the options available in AdapterOptions
  connectionSettings: "confirmed",
});

// Create AppKit instance with Solana only
export const appKit = createAppKit({
  adapters: [solanaAdapter],
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  networks: [
    {
      name: "Solana Devnet",
      id: "devnet",
      chainNamespace: "solana",
      caipNetworkId: "solana:devnet",
      rpcUrls: {
        default: {
          http: [clusterApiUrl("devnet")],
        },
      },
      nativeCurrency: {
        name: "Solana",
        symbol: "SOL",
        decimals: 9,
      },
      blockExplorers: {
        default: {
          name: "Solscan",
          url: "https://solscan.io",
        },
      },
    },
  ],
  metadata: {
    name: "DVulnDB - Decentralized Vulnerability Database",
    description: "Web3 vulnerability disclosure platform",
    url: "https://dvulndb.chron0.tech",
    icons: ["https://dvulndb.chron0.tech/logo.png"],
  },
  features: {
    analytics: true,
    email: true,
    socials: ["google", "github", "discord"],
  },
});
