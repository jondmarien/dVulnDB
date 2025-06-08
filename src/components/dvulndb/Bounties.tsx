"use client";

import React, { useState } from 'react';

type BountiesProps = {
  isActive: boolean;
};

const mockBounties = [
  {
    id: 'BP-001',
    organization: 'DeFi Protocol X',
    totalPool: '10,000 SOL',
    maxBounty: '2,000 SOL',
    scope: 'Smart Contracts, Web Application',
    status: 'Active',
    vulnerabilities: 12,
    participants: 45,
  },
  {
    id: 'BP-002',
    organization: 'Web3 Exchange Pro',
    totalPool: '25,000 SOL',
    maxBounty: '5,000 SOL',
    scope: 'Trading Engine, API, Frontend',
    status: 'Active',
    vulnerabilities: 8,
    participants: 67,
  },
  {
    id: 'BP-003',
    organization: 'NFT Marketplace Elite',
    totalPool: '15,000 SOL',
    maxBounty: '3,000 SOL',
    scope: 'Smart Contracts, IPFS Integration',
    status: 'Active',
    vulnerabilities: 15,
    participants: 52,
  },
];

const Bounties: React.FC<BountiesProps> = ({ isActive }) => {
  const [bounties] = useState(mockBounties);

  return (
    <section className={`section section--bounties${isActive ? ' active' : ''}`} id="bounties">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="terminal-prompt">user@dvulndb:~$ </span>
            Active Bounty Programs
          </h2>
        </div>
        <div className="bounty-grid" id="bountyGrid">
          {bounties.map((bounty) => (
            <div className="card bounty-card" key={bounty.id}>
              <div className="bounty-header">
                <div className="bounty-org">{bounty.organization}</div>
                <div className="status status--success">{bounty.status}</div>
              </div>
              <div className="bounty-pool">{bounty.totalPool}</div>
              <div className="bounty-scope">Scope: {bounty.scope}</div>
              <div className="bounty-stats">
                <div className="bounty-stat">
                  <div className="bounty-stat-value">{bounty.vulnerabilities}</div>
                  <div className="bounty-stat-label">Vulnerabilities</div>
                </div>
                <div className="bounty-stat">
                  <div className="bounty-stat-value">{bounty.participants}</div>
                  <div className="bounty-stat-label">Participants</div>
                </div>
              </div>
              <div className="form-group">
                <button className="btn btn--primary btn--full-width">
                  🎯 Join Program
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bounties; 