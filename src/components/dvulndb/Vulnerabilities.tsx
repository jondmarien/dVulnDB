"use client";

import React, { useState } from 'react';

type VulnerabilitiesProps = {
  isActive: boolean;
};

const mockVulnerabilities = [
  {
    id: 'VLN-2025-001',
    title: 'Reflected XSS in Search Parameter',
    target: 'example.com',
    type: 'Cross-Site Scripting (XSS)',
    severity: 7,
    status: 'Validated',
    researcher: '0x742...1234',
    bounty: '500 SOL',
    submitted: '2025-01-15',
    description: 'Reflected XSS vulnerability found in search parameter allows arbitrary script execution',
    cvss: '7.3',
  },
  {
    id: 'VLN-2025-002',
    title: 'SQL Injection in User Login',
    target: 'webapp.dev',
    type: 'SQL Injection',
    severity: 9,
    status: 'Under Review',
    researcher: '0x857...5678',
    bounty: '1000 SOL',
    submitted: '2025-01-20',
    description: 'Boolean-based blind SQL injection in login form allows database enumeration',
    cvss: '9.1',
  },
  {
    id: 'VLN-2025-003',
    title: 'IDOR in User Profile Access',
    target: 'api.service.com',
    type: 'Insecure Direct Object Reference',
    severity: 6,
    status: 'Disclosed',
    researcher: '0x923...9012',
    bounty: '300 SOL',
    submitted: '2025-01-10',
    description: 'IDOR vulnerability allows unauthorized access to user profile data',
    cvss: '6.5',
  },
  {
    id: 'VLN-2025-004',
    title: 'Remote Code Execution via File Upload',
    target: 'upload.secureapp.io',
    type: 'Remote Code Execution',
    severity: 10,
    status: 'Validated',
    researcher: '0x742...1234',
    bounty: '2000 SOL',
    submitted: '2025-01-18',
    description: 'Unrestricted file upload leading to remote code execution through malicious PHP files',
    cvss: '10.0',
  },
  {
    id: 'VLN-2025-005',
    title: 'Authentication Bypass in Admin Panel',
    target: 'admin.webapp.com',
    type: 'Authentication Bypass',
    severity: 8,
    status: 'Under Review',
    researcher: '0x857...5678',
    bounty: '750 SOL',
    submitted: '2025-01-22',
    description: 'Session fixation vulnerability allows unauthorized access to administrative functions',
    cvss: '8.2',
  },
];

function getSeverityClass(severity: number) {
  if (severity >= 9) return 'severity-critical';
  if (severity >= 7) return 'severity-high';
  if (severity >= 4) return 'severity-medium';
  return 'severity-low';
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Validated':
      return 'status--success';
    case 'Under Review':
      return 'status--warning';
    case 'Disclosed':
      return 'status--info';
    default:
      return 'status--info';
  }
}

const Vulnerabilities: React.FC<VulnerabilitiesProps> = ({ isActive }) => {
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vulnerabilities] = useState(mockVulnerabilities);

  const filteredVulns = vulnerabilities.filter((vuln) => {
    let severityMatch = true;
    let statusMatch = true;
    if (severityFilter) {
      switch (severityFilter) {
        case 'critical':
          severityMatch = vuln.severity >= 9;
          break;
        case 'high':
          severityMatch = vuln.severity >= 7 && vuln.severity < 9;
          break;
        case 'medium':
          severityMatch = vuln.severity >= 4 && vuln.severity < 7;
          break;
        case 'low':
          severityMatch = vuln.severity < 4;
          break;
        default:
          severityMatch = true;
      }
    }
    if (statusFilter) {
      statusMatch = vuln.status === statusFilter;
    }
    return severityMatch && statusMatch;
  });

  return (
    <section className={`section section--vulnerabilities${isActive ? ' active' : ''}`} id="vulnerabilities">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="terminal-prompt">user@dvulndb:~$ </span>
            Vulnerability Database
          </h2>
          <div className="filters">
            <select
              className="form-control filter-select"
              id="severityFilter"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="">All Severities</option>
              <option value="critical">Critical (9-10)</option>
              <option value="high">High (7-8)</option>
              <option value="medium">Medium (4-6)</option>
              <option value="low">Low (1-3)</option>
            </select>
            <select
              className="form-control filter-select"
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Validated">Validated</option>
              <option value="Disclosed">Disclosed</option>
            </select>
          </div>
        </div>
        <div className="vulnerability-grid" id="vulnerabilityGrid">
          {filteredVulns.map((vuln) => (
            <div className="card vulnerability-card" key={vuln.id}>
              <div className="vuln-header">
                <div className="vuln-id">{vuln.id}</div>
                <div className={`severity-badge ${getSeverityClass(vuln.severity)}`}>
                  CVSS {vuln.cvss}
                </div>
              </div>
              <h3 className="vuln-title">{vuln.title}</h3>
              <div className="vuln-meta">
                <div className="vuln-target">{vuln.target}</div>
                <div className={`status ${getStatusClass(vuln.status)}`}>{vuln.status}</div>
              </div>
              <div className="vuln-type">{vuln.type}</div>
              <div className="vuln-description">{vuln.description}</div>
              <div className="vuln-footer">
                <div className="vuln-bounty">{vuln.bounty}</div>
                <div className="vuln-researcher">{vuln.researcher}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vulnerabilities; 