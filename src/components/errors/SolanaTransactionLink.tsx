"use client";

import React from 'react';
import { getSolanaExplorerUrl } from '../../services/errors/solanaErrorUtils';

interface SolanaTransactionLinkProps {
  signature: string;
  network?: string;
  showIcon?: boolean;
  className?: string;
  label?: string;
}

/**
 * Component for displaying a link to a Solana transaction on the explorer
 */
const SolanaTransactionLink: React.FC<SolanaTransactionLinkProps> = ({
  signature,
  network = 'devnet',
  showIcon = true,
  className = '',
  label
}) => {
  const url = getSolanaExplorerUrl(signature, network);
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-[#00ff41] hover:text-[#33cc33] underline inline-flex items-center ${className}`}
    >
      {showIcon && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
          />
        </svg>
      )}
      {label || `${signature.slice(0, 8)}...${signature.slice(-8)}`}
    </a>
  );
};

export default SolanaTransactionLink;