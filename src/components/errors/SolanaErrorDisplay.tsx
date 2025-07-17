"use client";

import React from 'react';
import { SolanaError, getSolanaExplorerUrl } from '../../services/errors/solanaErrorUtils';

interface SolanaErrorDisplayProps {
  error: SolanaError;
  onRetry?: () => void;
  onClose?: () => void;
}

/**
 * Component for displaying Solana-specific errors with transaction links
 */
const SolanaErrorDisplay: React.FC<SolanaErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  onClose 
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-md p-4 mb-4 text-[#00ff41] shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#ff3333]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold">Transaction Error</h3>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-[#00ff41] hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-[#00ff41] mb-2">{error.userMessage}</p>
        
        {error.txSignature && (
          <div className="mt-2 text-sm">
            <p className="text-[#00b4d8]">Transaction ID:</p>
            <a 
              href={getSolanaExplorerUrl(error.txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ff41] hover:text-[#33cc33] underline break-all"
            >
              {error.txSignature}
            </a>
          </div>
        )}
        
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-[#0f0f0f] border border-[#00ff41] text-[#00ff41] rounded hover:bg-[#00ff41] hover:text-black transition-colors"
          >
            Retry Transaction
          </button>
        )}
      </div>
    </div>
  );
};

export default SolanaErrorDisplay;