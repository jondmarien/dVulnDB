'use client';

import type { Wallet } from '@solana/wallet-adapter-react';
import React from 'react';

export type WalletIconProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    wallet: Wallet | null;
};

export const WalletIcon = ({ wallet, ...props }: WalletIconProps) => {
    return wallet && <img src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} {...props} />;
};
