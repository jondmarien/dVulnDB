import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';
import { useWallet } from '@context/MockWalletProvider';

interface WalletDropdownProps {
  anchorRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({ anchorRef, onClose }) => {
  // Check if we're in mock mode via URL parameter
  const isMockMode = typeof window !== 'undefined' && window.location.search.includes('mock=true');
  
  // Use the appropriate wallet hook based on mode
  const mockWallet = useWallet();
  const appKitAccount = useAppKitAccount();
  
  // Get the appropriate values based on which mode we're in - Solana only
  const publicKey = isMockMode ? mockWallet.publicKey : appKitAccount.address ? { toString: () => appKitAccount.address } : null;
  const disconnect = isMockMode ? mockWallet.disconnect : () => window.dispatchEvent(new CustomEvent('appkit:disconnect'));
  
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Copy address to clipboard
  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  // Profile navigation
  const handleProfile = () => {
    onClose();
    router.push('/profile');
  };

  // Change wallet (open wallet modal)
  const handleChangeWallet = () => {
    // Trigger wallet modal for Phantom wallet selection
    onClose();
    try {
      // Try to use AppKit's open method for Solana wallet selection
      import('@reown/appkit/react').then(({ useAppKit }) => {
        const { open } = useAppKit();
        open();
      }).catch(error => {
        console.error('Failed to import AppKit:', error);
        // Fallback to custom events
        window.dispatchEvent(new CustomEvent('wallet-adapter:open-modal'));
        window.dispatchEvent(new CustomEvent('appkit:connect'));
      });
    } catch (error) {
      // Fallback to custom event
      console.error('Error opening wallet modal:', error);
      window.dispatchEvent(new CustomEvent('wallet-adapter:open-modal'));
      window.dispatchEvent(new CustomEvent('appkit:connect'));
    }
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={dropdownRef}
      className="dvulndb-wallet-dropdown"
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        zIndex: 1000,
        minWidth: 165,
        background: 'rgba(20, 20, 20, 0.98)',
        borderRadius: 10,
        boxShadow: '0 2px 16px 0 rgba(0,255,65,0.10)',
        border: '2px solid #00ff41',
        padding: 0,
        overflow: 'hidden',
        fontFamily: 'var(--font-family-mono)',
      }}
    >
      <button
        className="wallet-dropdown-item"
        style={{ width: '100%', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', lineHeight: 1.2 }}
        onClick={handleProfile}
      >
        Profile
      </button>
      <button
        className="wallet-dropdown-item"
        style={{ width: '100%', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', lineHeight: 1.2 }}
        onClick={handleCopy}
      >
        {copied ? 'Copied!' : 'Copy address'}
      </button>
      <button
        className="wallet-dropdown-item"
        style={{ width: '100%', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', lineHeight: 1.2 }}
        onClick={handleChangeWallet}
      >
        Change Phantom wallet
      </button>
      <button
        className="wallet-dropdown-item"
        style={{ width: '100%', padding: '10px 0', textAlign: 'center', fontWeight: 500, fontSize: 15, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', outline: 'none', lineHeight: 1.2 }}
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
};
