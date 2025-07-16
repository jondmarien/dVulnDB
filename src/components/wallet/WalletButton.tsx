"use client";

import React from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

interface WalletButtonProps {
    className?: string;
}

/**
 * Enhanced Wallet Button with proper AppKit integration
 */
export const WalletButton: React.FC<WalletButtonProps> = ({ className }) => {
    const { isConnected, address } = useAppKitAccount();
    const networkInfo = useAppKitNetwork();

    const handleClick = () => {
        try {
            // Try to use AppKit's open method
            const { useAppKit } = require('@reown/appkit/react');
            const { open } = useAppKit();
            open();
        } catch (error) {
            console.error('AppKit not initialized:', error);
            // Fallback: try to trigger appkit-button if it exists
            const appkitButton = document.querySelector('appkit-button');
            if (appkitButton) {
                (appkitButton as any).click();
            } else {
                alert('Please set up your Reown Project ID in the .env file to enable wallet connection.');
            }
        }
    };

    const getNetworkIcon = () => {
        // Check chainId for Solana networks - handle both string and number types
        const chainId = networkInfo?.chainId?.toString() || '';
        const networkName = networkInfo?.caipNetworkId?.toString() || '';

        console.log('Network Info:', { chainId, networkName, networkInfo }); // Debug log

        // Solana Devnet detection
        if (networkName.includes('devnet') || chainId.includes('devnet') || chainId.includes('EtWT')) return '◎';
        if (networkName.includes('mainnet') || chainId.includes('mainnet') || chainId.includes('5eykt')) return '●';
        if (networkName.includes('solana') || chainId.includes('solana')) return '◉';

        return '○'; // Default network icon
    };

    const renderCustomWalletButton = () => {
        if (isConnected) {
            return (
                <div className="custom-wallet-display">
                    <span className="wallet-arrow">{'>'}</span>
                    <span>&nbsp;</span>
                    <div className="appkit-button-wrapper">
                        <appkit-button />
                    </div>
                    <span className="network-icon" title={getNetworkDisplayName()}>
                        {getNetworkIcon()}
                    </span>
                </div>
            );
        }
        return (
            <div className="custom-wallet-display">
                <span className="wallet-arrow">{'>'}</span>
                <span>&nbsp;</span>
                <span>Select Wallet</span>
            </div>
        );
    };

    const getNetworkDisplayName = () => {
        const chainId = networkInfo?.chainId?.toString() || '';
        const networkName = networkInfo?.caipNetworkId?.toString() || '';

        if (networkName.includes('devnet') || chainId.includes('devnet')) return 'Solana Devnet';
        if (networkName.includes('mainnet') || chainId.includes('mainnet')) return 'Solana Mainnet';
        return networkName || chainId || 'Unknown Network';
    };

    const getTooltipText = () => {
        if (isConnected) {
            const network = getNetworkDisplayName();
            return `Network: ${network}\nAddress: ${address}\nClick to manage wallet`;
        }
        return 'Connect your wallet';
    };

    return (
        <button
            className={`wallet-connect-btn ${isConnected ? 'connected' : ''} ${className || ''}`}
            onClick={handleClick}
            title={getTooltipText()}
        >
            {renderCustomWalletButton()}
        </button>
    );
};

export default WalletButton;