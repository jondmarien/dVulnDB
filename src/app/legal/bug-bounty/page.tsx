export default function BugBountyPolicy() {
  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <h1 style={{ color: '#00ff00', marginBottom: 24 }}>Bug Bounty Policy</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ marginBottom: '24px' }}>DVulnDB is committed to maintaining the security of our platform. We encourage security researchers to responsibly disclose vulnerabilities and offer rewards for valid submissions.</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>1. Scope</h2>
        <p style={{ marginBottom: '24px' }}>Our bug bounty program covers:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>DVulnDB web application</li>
          <li>Smart contracts used for bounty distribution</li>
          <li>API endpoints and infrastructure</li>
          <li>Authentication mechanisms</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>2. Reward Structure</h2>
        <p style={{ marginBottom: '24px' }}>Bounty rewards are based on severity:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Critical: Up to 5,000 SOL</li>
          <li>High: Up to 2,000 SOL</li>
          <li>Medium: Up to 500 SOL</li>
          <li>Low: Up to 100 SOL</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>3. Submission Guidelines</h2>
        <p style={{ marginBottom: '24px' }}>When submitting a vulnerability:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Provide detailed reproduction steps</li>
          <li>Include proof-of-concept code when applicable</li>
          <li>Demonstrate potential impact</li>
          <li>Submit through our secure submission form</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>4. Rules of Engagement</h2>
        <p style={{ marginBottom: '24px' }}>Researchers must:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Not disclose vulnerabilities publicly before resolution</li>
          <li>Avoid testing on production systems</li>
          <li>Not access or modify user data</li>
          <li>Report findings promptly</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>5. Response Timeline</h2>
        <p style={{ marginBottom: '24px' }}>Our team commits to:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Initial response within 24 hours</li>
          <li>Vulnerability triage within 3 days</li>
          <li>Resolution timeline communication within 7 days</li>
          <li>Reward distribution within 14 days of validation</li>
        </ul>

        <p style={{ color: '#888', fontSize: '14px' }}>Last updated: 2024-01-25</p>
      </div>
    </div>
  );
} 