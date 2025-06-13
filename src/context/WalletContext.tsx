"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

interface WalletInfo {
  address: string;
  balance: string;
}

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletInfo: WalletInfo | null;
  connectWallet: () => void;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);
    if (window.ethereum) {
      const _provider = new ethers.BrowserProvider(window.ethereum as any);
      setProvider(_provider);
      const _signer = await _provider.getSigner();
      setSigner(_signer);
      const address = await _signer.getAddress();
      const balance = ethers.formatEther(await _provider.getBalance(address));
      setWalletInfo({ address, balance });
      const network = await _provider.getNetwork();
      setChainId(Number(network.chainId));
      setIsConnected(true);
    }
    setIsConnecting(false);
  };

  useEffect(() => {
    // Optionally auto-connect if already authorized
    if (typeof window !== "undefined" && window.ethereum && typeof window.ethereum.request === "function") {
      (window.ethereum.request({ method: "eth_accounts" }) as Promise<string[]>)
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            connectWallet();
          }
        })
        .catch(() => {
          // Ignore errors (e.g., user not authorized)
        });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ isConnected, isConnecting, walletInfo, connectWallet, provider, signer, chainId }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
}; 