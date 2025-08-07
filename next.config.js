/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Solana-only configuration */
  allowedDevOrigins: [
    'funky-distinctly-civet.ngrok-free.app'
  ],
  
  // Optimize for Solana web3 libraries
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Optimize bundle for Solana libraries
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    
    return config;
  },
  
  // Environment variables for Solana networks
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  },
  
  // Optimize images and static assets
  images: {
    domains: ['yellow-fashionable-pinniped-195.mypinata.cloud'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Output configuration for Docker deployment
  output: 'standalone',
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@solana/web3.js', '@reown/appkit'],
  },
};

module.exports = nextConfig;
