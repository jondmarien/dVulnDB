'use client';

import type { WalletName } from '@solana/wallet-adapter-base';
import React from 'react';
import { Button } from './Button';
import { WalletIcon } from './WalletIcon';

type Props = React.ComponentProps<typeof Button> & {
    walletIcon?: string;
    walletName?: WalletName;
};

export function BaseWalletConnectionButton({ walletIcon, walletName, className, ...props }: Props) {
    return (
        <Button
            {...props}
            className={`wallet-adapter-button wallet-adapter-button-trigger ${className || ''}`.trim()}
            startIcon={walletIcon && walletName ? <WalletIcon wallet={{ adapter: { icon: walletIcon, name: walletName } }} /> : undefined}
        />
    );
}
