"use client";

import React, { useState, useEffect } from 'react';

type DashboardProps = {
  onNavigate: (section: string) => void;
  isActive: boolean;
};

const mockUser = {
  vulnerabilities_found: 23,
  reputation: 850,
  total_earnings: '5,250 SOL',
  rank: 3,
};

const mockActivity = [
  {
    type: 'vulnerability_submitted',
    researcher: 'CyberSecJon',
    target: 'example.com',
    timestamp: '2 hours ago',
  },
  {
    type: 'bounty_paid',
    amount: '500 SOL',
    researcher: 'SQLNinja',
    timestamp: '4 hours ago',
  },
  {
    type: 'validation_completed',
    vulnerability: 'VLN-2025-001',
    timestamp: '6 hours ago',
  },
  {
    type: 'new_researcher',
    researcher: 'BlockchainHacker',
    timestamp: '8 hours ago',
  },
];

const mockResearchers = [
  {
    username: 'SQLNinja',
    vulnerabilities_found: 31,
    total_earnings: '7,100 SOL',
    reputation: 920,
  },
  {
    username: 'CyberSecJon',
    vulnerabilities_found: 23,
    total_earnings: '5,250 SOL',
    reputation: 850,
  },
  {
    username: 'PentestPro',
    vulnerabilities_found: 19,
    total_earnings: '4,200 SOL',
    reputation: 780,
  },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, isActive }) => {
  const [user] = useState(mockUser);
  const [activity, setActivity] = useState(mockActivity);
  const [researchers] = useState(mockResearchers);

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActivity((prev) =>
        prev.map((a) => {
          if (a.timestamp.includes('hour')) {
            const hours = parseInt(a.timestamp.match(/\d+/)?.[0] || '0', 10) + 1;
            return { ...a, timestamp: `${hours} hours ago` };
          }
          return a;
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`section section--dashboard${isActive ? ' active' : ''}`} id="dashboard">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="terminal-prompt">user@dvulndb:~$ </span>
            Security Dashboard
          </h2>
          <div className="network-status">
            <span className="status-dot"></span>
            <span>Solana Mainnet</span>
          </div>
        </div>
        <div className="dashboard-grid">
          {/* User Statistics */}
          <div className="card stat-widget">
            <div className="stat-widget__header">
              <h3>Your Statistics</h3>
              <span className="stat-widget__icon">📊</span>
            </div>
            <div className="stat-widget__content">
              <div className="stat-item">
                <span className="stat-item__label">Vulnerabilities Found</span>
                <span className="stat-item__value" id="userVulns">{user.vulnerabilities_found}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item__label">Reputation Score</span>
                <span className="stat-item__value reputation-score" id="userRep">{user.reputation}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item__label">Total Earnings</span>
                <span className="stat-item__value earnings" id="userEarnings">{user.total_earnings}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item__label">Global Rank</span>
                <span className="stat-item__value rank" id="userRank">#{user.rank}</span>
              </div>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="card activity-feed">
            <div className="activity-feed__header">
              <h3>Recent Activity</h3>
              <div className="activity-indicator">
                <span className="pulse"></span>
                <span>Live</span>
              </div>
            </div>
            <div className="activity-feed__content" id="activityFeed">
              {activity.map((a, i) => {
                let icon = '📋', iconBg = '#888', text = '';
                switch (a.type) {
                  case 'vulnerability_submitted':
                    icon = '🎯'; iconBg = '#00ff00';
                    text = `${a.researcher} submitted vulnerability report for ${a.target}`;
                    break;
                  case 'bounty_paid':
                    icon = '💰'; iconBg = '#ffd700';
                    text = `${a.amount} bounty paid to ${a.researcher}`;
                    break;
                  case 'validation_completed':
                    icon = '✅'; iconBg = '#00ff00';
                    text = `Vulnerability ${a.vulnerability} validation completed`;
                    break;
                  case 'new_researcher':
                    icon = '👤'; iconBg = '#00b4d8';
                    text = `${a.researcher} joined the platform`;
                    break;
                  default:
                    text = 'Unknown activity';
                }
                return (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon" style={{ background: iconBg, color: '#000' }}>{icon}</div>
                    <div className="activity-content">
                      <div className="activity-text">{text}</div>
                      <div className="activity-time">{a.timestamp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Leaderboard */}
          <div className="card leaderboard">
            <div className="leaderboard__header">
              <h3>Top Researchers</h3>
              <span className="leaderboard__icon">🏆</span>
            </div>
            <div className="leaderboard__content" id="leaderboard">
              {researchers
                .sort((a, b) => b.reputation - a.reputation)
                .slice(0, 5)
                .map((r, i) => (
                  <div className="researcher-item" key={r.username}>
                    <div className="researcher-rank">{i + 1}</div>
                    <div className="researcher-info">
                      <div className="researcher-name">{r.username}</div>
                      <div className="researcher-stats">{r.vulnerabilities_found} vulns • {r.total_earnings}</div>
                    </div>
                    <div className="researcher-rep">{r.reputation}</div>
                  </div>
                ))}
            </div>
          </div>
          {/* Quick Actions */}
          <div className="card quick-actions">
            <div className="quick-actions__header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions__content">
              <button className="btn btn--secondary btn--full-width" onClick={() => onNavigate('submit')}>
                🎯 Submit Vulnerability
              </button>
              <button className="btn btn--secondary btn--full-width" onClick={() => onNavigate('vulnerabilities')}>
                🔍 Browse Reports
              </button>
              <button className="btn btn--secondary btn--full-width" onClick={() => onNavigate('bounties')}>
                💰 View Bounties
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard; 