'use client';

import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BaseWalletConnectionButton } from './wallet-button/BaseWalletConnectionButton';
import type { ButtonProps } from './wallet-button/Button';
import { useRouter } from 'next/navigation';

const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
} as const;

type Props = ButtonProps & {
    labels?: typeof LABELS; // Made labels optional
};

export function CustomWalletMultiButton({ children, labels = LABELS, ...props }: Props) { // Added default for labels
    const router = useRouter();
    const { setVisible: setModalVisible } = useWalletModal();
    const { buttonState, onConnect, onDisconnect, publicKey, walletIcon, walletName } = useWalletMultiButton({
        onSelectWallet() {
            setModalVisible(true);
        },
    });
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;
            if (!node || node.contains(event.target as Node)) return;
            setMenuOpen(false);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, []);

    const content = useMemo(() => {
        if (children) {
            return children;
        } else if (publicKey) {
            const base58 = publicKey.toBase58();
            const addressToShow = base58.slice(0, 4) + '..' + base58.slice(-4);
            return <span style={{ textTransform: 'none' }}>{addressToShow}</span>;
        } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
            return labels[buttonState];
        } else {
            return labels['no-wallet'];
        }
    }, [buttonState, children, labels, publicKey]);

    return (
        <div className="wallet-adapter-dropdown">
            <BaseWalletConnectionButton
                {...props}
                aria-expanded={menuOpen}
                style={{ pointerEvents: menuOpen ? 'none' : 'auto', ...props.style }}
                onClick={() => {
                    switch (buttonState) {
                        case 'no-wallet':
                            setModalVisible(true);
                            break;
                        case 'has-wallet':
                            if (onConnect) {
                                onConnect();
                            }
                            break;
                        case 'connected':
                            setMenuOpen(true);
                            break;
                    }
                }}
                walletIcon={walletIcon}
                walletName={walletName}
            >
                {content}
            </BaseWalletConnectionButton>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${menuOpen && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                <li
                    className="wallet-adapter-dropdown-list-item"
                    onClick={() => {
                        router.push('/profile');
                        setMenuOpen(false);
                    }}
                    role="menuitem"
                >
                    Profile
                </li>
                {publicKey ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={async () => {
                            await navigator.clipboard.writeText(publicKey.toBase58());
                            setCopied(true);
                            setTimeout(() => setCopied(false), 400);
                        }}
                        role="menuitem"
                    >
                        {copied ? labels['copied'] : labels['copy-address']}
                    </li>
                ) : null}
                <li
                    className="wallet-adapter-dropdown-list-item"
                    onClick={() => {
                        setModalVisible(true);
                        setMenuOpen(false);
                    }}
                    role="menuitem"
                >
                    {labels['change-wallet']}
                </li>
                {onDisconnect ? (
                    <li
                        className="wallet-adapter-dropdown-list-item"
                        onClick={() => {
                            onDisconnect();
                            setMenuOpen(false);
                        }}
                        role="menuitem"
                    >
                        {labels['disconnect']}
                    </li>
                ) : null}
            </ul>
        </div>
    );
}
