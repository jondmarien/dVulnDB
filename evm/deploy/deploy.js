const { network } = require("hardhat");
const { verify } = require("../scripts/verify");

module.exports = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get, execute } = deployments;
  const { deployer, validator1, validator2 } = await getNamedAccounts();

  // Only run on localhost or when explicitly deployed
  if (network.name !== 'localhost' && network.name !== 'hardhat') {
    log('Skipping deployment: not running on localhost or hardhat network.');
    return;
  }

  log("===============================================");
  log("Deploying Decentralized Vulnerability Database");
  log("===============================================");
  log(`Network: ${network.name} (${network.config.chainId})`);
  log(`Deployer: ${deployer}`);

  // Deploy BountyEscrow first
  log("\n1. Deploying BountyEscrow...");
  const bountyEscrow = await deploy("BountyEscrow", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.chainId === 31337 ? 1 : 6,
  });
  log(`BountyEscrow deployed at: ${bountyEscrow.address}`);

  // Deploy ReputationNFT
  log("\n2. Deploying ReputationNFT...");
  const reputationNFT = await deploy("ReputationNFT", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.chainId === 31337 ? 1 : 6,
  });
  log(`ReputationNFT deployed at: ${reputationNFT.address}`);

  // Deploy VulnerabilityRegistry
  log("\n3. Deploying VulnerabilityRegistry...");
  const vulnerabilityRegistry = await deploy("VulnerabilityRegistry", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.chainId === 31337 ? 1 : 6,
  });
  log(`VulnerabilityRegistry deployed at: ${vulnerabilityRegistry.address}`);

  // Setup contract connections using deployments helpers
  log("\n4. Setting up contract connections...");
  await execute("BountyEscrow", { from: deployer }, "setVulnerabilityRegistry", vulnerabilityRegistry.address);
  log(`✓ Escrow registry set to: ${vulnerabilityRegistry.address}`);

  await execute("VulnerabilityRegistry", { from: deployer }, "setBountyEscrow", bountyEscrow.address);
  log(`✓ Registry escrow set to: ${bountyEscrow.address}`);

  await execute("ReputationNFT", { from: deployer }, "setVulnerabilityRegistry", vulnerabilityRegistry.address);
  log(`✓ NFT registry set to: ${vulnerabilityRegistry.address}`);

  // Add validators
  if (network.name !== 'hardhat' && validator1 && validator2) {
    await execute("VulnerabilityRegistry", { from: deployer }, "addValidator", validator1);
    log(`Added validator1: ${validator1}`);
    await execute("VulnerabilityRegistry", { from: deployer }, "addValidator", validator2);
    log(`Added validator2: ${validator2}`);

    await execute("BountyEscrow", { from: deployer }, "addApprover", validator1);
    log(`Added escrow approver1: ${validator1}`);
    await execute("BountyEscrow", { from: deployer }, "addApprover", validator2);
    log(`Added escrow approver2: ${validator2}`);
  }

  const supportedVerifyNetworks = [
    "mainnet", "goerli", "sepolia", "polygon", "polygonMumbai", "arbitrumOne", "arbitrumSepolia", "base", "baseGoerli", "baseSepolia", "optimisticEthereum", "optimisticGoerli", "bsc", "bscTestnet", "xdai", "gnosis", "avalanche", "avalancheFujiTestnet", "moonbeam", "moonriver", "moonbaseAlpha", "harmony", "harmonyTest", "aurora", "auroraTestnet", "opera", "ftmTestnet", "sokol", "chiado", "holesky", "polygonZkEVM", "polygonZkEVMTestnet", "ink", "inkSepolia"
  ];

  if (supportedVerifyNetworks.includes(network.name)) {
    log("\n5. Verifying contracts...");
    await verify(bountyEscrow.address, []);
    log("BountyEscrow verified");
    await verify(reputationNFT.address, []);
    log("ReputationNFT verified");
    await verify(vulnerabilityRegistry.address, []);
    log("VulnerabilityRegistry verified");
  } else {
    log(`Skipping contract verification on network: ${network.name}`);
  }

  log("\n===============================================");
  log("✅ Deployment completed successfully!");
  log("===============================================");
  log(`VulnerabilityRegistry: ${vulnerabilityRegistry.address}`);
  log(`BountyEscrow: ${bountyEscrow.address}`);
  log(`ReputationNFT: ${reputationNFT.address}`);
  log("===============================================");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    timestamp: new Date().toISOString(),
    contracts: {
      VulnerabilityRegistry: vulnerabilityRegistry.address,
      BountyEscrow: bountyEscrow.address,
      ReputationNFT: reputationNFT.address
    },
    deployer: deployer,
    blockNumbers: {
      VulnerabilityRegistry: vulnerabilityRegistry.receipt?.blockNumber,
      BountyEscrow: bountyEscrow.receipt?.blockNumber,
      ReputationNFT: reputationNFT.receipt?.blockNumber
    }
  };

  const fs = require("fs");
  const path = require("path");
  const deploymentDir = path.join(__dirname, "../frontend/src/config");
  const deploymentPath = path.join(deploymentDir, "deployments.json");
  const networkDeploymentPath = path.join(deploymentDir, `deployments.${network.name}.json`);

  // Ensure the directory exists
  fs.mkdirSync(deploymentDir, { recursive: true });

  try {
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    fs.writeFileSync(networkDeploymentPath, JSON.stringify(deploymentInfo, null, 2));
    log(`\n📄 Deployment info saved to: ${deploymentPath} and ${networkDeploymentPath}`);
  } catch (error) {
    log(`⚠️  Could not save deployment info: ${error.message}`);
  }
};

module.exports.tags = ["all", "vulnerability-db"];