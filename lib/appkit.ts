import { createAppKit } from "@reown/appkit";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { SOLANA_NETWORKS, getAllRpcEndpoints } from "./network-config";

// Create the Solana adapter with optimized settings
export const solanaAdapter = new SolanaAdapter({
  connectionSettings: {
    commitment: "confirmed",
    disableRetryOnRateLimit: false,
    confirmTransactionInitialTimeout: 60000, // 60 seconds
  },
});

// Create AppKit instance with Solana only
export const appKit = createAppKit({
  adapters: [solanaAdapter],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  networks: [
    // Mainnet configuration
    {
      name: SOLANA_NETWORKS["mainnet-beta"].name,
      id: SOLANA_NETWORKS["mainnet-beta"].id,
      chainNamespace: "solana",
      caipNetworkId: "solana:mainnet-beta",
      rpcUrls: {
        default: {
          http: getAllRpcEndpoints("mainnet-beta"),
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
          url: SOLANA_NETWORKS["mainnet-beta"].solscanUrl,
        },
        solana: {
          name: "Solana Explorer",
          url: SOLANA_NETWORKS["mainnet-beta"].explorerUrl,
        },
      },
    },
    // Devnet configuration
    {
      name: SOLANA_NETWORKS["devnet"].name,
      id: SOLANA_NETWORKS["devnet"].id,
      chainNamespace: "solana",
      caipNetworkId: "solana:devnet",
      rpcUrls: {
        default: {
          http: getAllRpcEndpoints("devnet"),
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
          url: SOLANA_NETWORKS["devnet"].solscanUrl,
        },
        solana: {
          name: "Solana Explorer",
          url: SOLANA_NETWORKS["devnet"].explorerUrl,
        },
      },
    },
    // Testnet configuration
    {
      name: SOLANA_NETWORKS["testnet"].name,
      id: SOLANA_NETWORKS["testnet"].id,
      chainNamespace: "solana",
      caipNetworkId: "solana:testnet",
      rpcUrls: {
        default: {
          http: getAllRpcEndpoints("testnet"),
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
          url: SOLANA_NETWORKS["testnet"].solscanUrl,
        },
        solana: {
          name: "Solana Explorer",
          url: SOLANA_NETWORKS["testnet"].explorerUrl,
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
