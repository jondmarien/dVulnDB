import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ReputationNFTArtifact from "@/app/abi/ReputationNFT.json";
import { getDeploymentConfig } from "@/app/utils/getDeployment";
import { useWallet } from "@/context/WalletContext";

export function useReputationNFTContract() {
  const { chainId, signer } = useWallet();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function setup() {
      if (!chainId || !signer) return;
      const deployment = await getDeploymentConfig(chainId);
      const address = deployment.contracts.ReputationNFT;
      const abi = ReputationNFTArtifact.abi;
      const instance = new ethers.Contract(address, abi, signer);
      setContract(instance);
    }
    setup();
  }, [chainId, signer]);

  return contract;
} 