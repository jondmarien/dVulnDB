export default function TermsOfService() {
  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <h1 style={{ color: '#00ff00', marginBottom: 24 }}>Terms of Service</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ marginBottom: '24px' }}>Welcome to DVulnDB. These Terms of Service govern your use of our decentralized vulnerability disclosure platform. By accessing or using DVulnDB, you agree to be bound by these terms.</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '24px' }}>By accessing or using DVulnDB, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>2. Platform Usage</h2>
        <p style={{ marginBottom: '24px' }}>DVulnDB is a decentralized platform for security researchers to discover, validate, and disclose vulnerabilities. Users must follow responsible disclosure practices and not exploit vulnerabilities for malicious purposes.</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>3. User Responsibilities</h2>
        <p style={{ marginBottom: '24px' }}>Users are responsible for:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Maintaining the confidentiality of their wallet credentials</li>
          <li>Following ethical hacking and disclosure guidelines</li>
          <li>Providing accurate vulnerability information</li>
          <li>Not disclosing sensitive information about validated vulnerabilities</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>4. Bounty Programs</h2>
        <p style={{ marginBottom: '24px' }}>Bounty rewards are distributed through smart contracts. DVulnDB is not responsible for the amount or distribution of bounties offered by third-party programs.</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>5. Limitation of Liability</h2>
        <p style={{ marginBottom: '24px' }}>DVulnDB is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of the platform or any disclosed vulnerabilities.</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>6. Modifications</h2>
        <p style={{ marginBottom: '24px' }}>We reserve the right to modify these terms at any time. Continued use of DVulnDB after changes constitutes acceptance of modified terms.</p>

        <p style={{ color: '#888', fontSize: '14px' }}>Last updated: 2025-06-14</p>
      </div>
    </div>
  );
} 