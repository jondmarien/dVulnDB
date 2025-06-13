"use client";

import { useWallet } from "@/context/WalletContext";
import { useBountyEscrowContract } from "@/app/hooks/useBountyEscrowContract";
import { useReputationNFTContract } from "@/app/hooks/useReputationNFTContract";
import { useVulnerabilityRegistryContract } from "@/app/hooks/useVulnerabilityRegistryContract";
import { ethers } from "ethers";

export default function ContractDemo() {
  const { isConnected, connectWallet } = useWallet();

  const bountyEscrow = useBountyEscrowContract() as ethers.Contract | null;
  const reputationNFT = useReputationNFTContract() as ethers.Contract | null;
  const vulnerabilityRegistry = useVulnerabilityRegistryContract() as ethers.Contract | null;

  if (!isConnected) {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Contracts Ready</h2>
      <div><strong>BountyEscrow:</strong> {bountyEscrow?.address ? String(bountyEscrow.address) : "-"}</div>
      <div><strong>ReputationNFT:</strong> {reputationNFT?.address ? String(reputationNFT.address) : "-"}</div>
      <div><strong>VulnerabilityRegistry:</strong> {vulnerabilityRegistry?.address ? String(vulnerabilityRegistry.address) : "-"}</div>
      {/* You can now call contract methods, e.g. bountyEscrow.someFunction() */}
    </div>
  );
} 