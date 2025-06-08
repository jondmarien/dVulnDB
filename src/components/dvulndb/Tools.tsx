import React from 'react';

const tools = [
  {
    name: 'Nmap',
    icon: '🔍',
    description: 'Network discovery and security auditing',
    status: 'Active',
    code: 'nmap -sS -O target.com -oX output.xml',
    formats: ['XML', 'JSON'],
  },
  {
    name: 'Nikto',
    icon: '🌐',
    description: 'Web server scanner for vulnerabilities',
    status: 'Active',
    code: 'nikto -h target.com -Format xml -output report.xml',
    formats: ['XML', 'TXT'],
  },
  {
    name: 'Burp Suite',
    icon: '🔥',
    description: 'Web application security testing platform',
    status: 'Active',
    code: 'Export scan results as XML from Burp Suite Professional',
    formats: ['XML', 'JSON'],
  },
];

const apiEndpoints = [
  { method: 'POST', path: '/api/v1/vulnerabilities' },
  { method: 'GET', path: '/api/v1/bounties' },
  { method: 'GET', path: '/api/v1/researchers/{address}' },
];

const Tools: React.FC = () => (
  <section className="section section--tools" id="tools">
    <div className="container">
      <div className="section-header">
        <h2 className="section-title">
          <span className="terminal-prompt">user@dvulndb:~$ </span>
          Security Tool Integration
        </h2>
      </div>
      <div className="tools-grid">
        {tools.map((tool) => (
          <div className="card tool-card" key={tool.name}>
            <div className="tool-card__header">
              <h3>{tool.icon} {tool.name} Integration</h3>
              <span className="status status--success">{tool.status}</span>
            </div>
            <div className="tool-card__content">
              <p>{tool.description}</p>
              <div className="code-example">
                <code>{tool.code}</code>
              </div>
              <div className="supported-formats">
                {tool.formats.map((fmt) => (
                  <span className="format-tag" key={fmt}>{fmt}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="card api-docs" style={{ gridColumn: '1 / -1' }}>
          <div className="api-docs__header">
            <h3>📡 API Documentation</h3>
          </div>
          <div className="api-docs__content">
            {apiEndpoints.map((ep) => (
              <div className="api-endpoint" key={ep.path}>
                <div className="endpoint-method">{ep.method}</div>
                <div className="endpoint-path">{ep.path}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Tools; 