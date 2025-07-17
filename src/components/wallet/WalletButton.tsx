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
            // Try to use AppKit's open method with proper import
            import('@reown/appkit/react').then(({ useAppKit }) => {
                const { open } = useAppKit();
                open();
            }).catch(error => {
                console.error('Failed to import AppKit:', error);
                fallbackWalletOpen();
            });
        } catch (error) {
            console.error('AppKit not initialized:', error);
            fallbackWalletOpen();
        }
    };
    
    // Fallback method for opening wallet connection
    const fallbackWalletOpen = () => {
        // Try multiple approaches to open the wallet modal
        
        // 1. Try to find and click appkit-button
        const appkitButton = document.querySelector('appkit-button');
        if (appkitButton) {
            console.log('Found appkit-button, clicking it');
            (appkitButton as any).click();
            return;
        }
        
        // 2. Try to dispatch a custom event for wallet adapter
        console.log('Dispatching wallet-adapter:open-modal event');
        window.dispatchEvent(new CustomEvent('wallet-adapter:open-modal'));
        
        // 3. Try to dispatch AppKit's custom event
        console.log('Dispatching appkit:connect event');
        window.dispatchEvent(new CustomEvent('appkit:connect'));
    };

    const getNetworkIcon = () => {
        // Check chainId for Solana networks only - handle both string and number types
        const chainId = networkInfo?.chainId?.toString() || '';
        const networkName = networkInfo?.caipNetworkId?.toString() || '';

        // Solana network detection
        if (networkName.includes('devnet') || chainId.includes('devnet') || chainId.includes('EtWT')) return '◎'; // Solana Devnet
        if (networkName.includes('testnet') || chainId.includes('testnet')) return '◆'; // Solana Testnet
        if (networkName.includes('mainnet') || chainId.includes('mainnet') || chainId.includes('5eykt')) return '●'; // Solana Mainnet
        
        return '◉'; // Default Solana network icon
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
                <span>Connect Phantom</span>
            </div>
        );
    };

    const getNetworkDisplayName = () => {
        const chainId = networkInfo?.chainId?.toString() || '';
        const networkName = networkInfo?.caipNetworkId?.toString() || '';

        if (networkName.includes('devnet') || chainId.includes('devnet')) return 'Solana Devnet';
        if (networkName.includes('testnet') || chainId.includes('testnet')) return 'Solana Testnet';
        if (networkName.includes('mainnet') || chainId.includes('mainnet')) return 'Solana Mainnet';
        return 'Solana Network'; // Default to generic Solana network
    };

    const getTooltipText = () => {
        if (isConnected) {
            const network = getNetworkDisplayName();
            return `Network: ${network}\nAddress: ${address}\nClick to manage Phantom wallet`;
        }
        return 'Connect your Phantom wallet';
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