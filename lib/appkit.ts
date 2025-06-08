import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains'

// 1. Create the Wagmi adapter for multiple chains
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  networks: [mainnet, sepolia, polygon, arbitrum], // Multi-chain support for vulnerabilities
})

// 2. Create AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  networks: [mainnet, sepolia, polygon, arbitrum],
  defaultNetwork: sepolia,
  metadata: {
    name: 'DVulnDB - Decentralized Vulnerability Database',
    description: 'Web3 vulnerability disclosure platform',
    url: 'https://dvulndb.app',
    icons: ['https://dvulndb.app/logo.png']
  },
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'github', 'discord']
  }
})
