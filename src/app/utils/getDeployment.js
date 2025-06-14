export async function getDeploymentConfig(chainId) {
  const mapping = {
    31337: "localhost",
    11155111: "sepolia",
    1: "mainnet",
    // Add more as needed
  };
  const network = mapping[chainId] || "localhost";
  return import(`evm/frontend/src/config/deployments.${network}.json`).then(mod => mod.default);
} 