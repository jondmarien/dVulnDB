import Link from "next/link";

export default function ResponsibleDisclosure() {
  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <h1 style={{ color: '#00ff00', marginBottom: 24 }}>Responsible Disclosure</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ marginBottom: '24px' }}>DVulnDB values the security research community and encourages responsible disclosure of security vulnerabilities. If you believe you've found a security issue, please follow these guidelines:</p>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>Disclosure Guidelines</h2>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Do not test vulnerabilities on production systems</li>
          <li>Do not access or modify other users' data</li>
          <li>Provide detailed information about the vulnerability</li>
          <li>Allow reasonable time for remediation before public disclosure</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>Reporting Process</h2>
        <p style={{ marginBottom: '24px' }}>When submitting a vulnerability report:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Include clear steps to reproduce the issue</li>
          <li>Describe the potential impact</li>
          <li>Provide any relevant technical details</li>
          <li>Submit through our secure reporting platform</li>
        </ul>

        <h2 style={{ color: '#00ff00', marginBottom: '16px' }}>Our Commitment</h2>
        <p style={{ marginBottom: '24px' }}>We commit to:</p>
        <ul style={{ marginBottom: '24px', marginLeft: '24px' }}>
          <li>Acknowledge receipt within 24 hours</li>
          <li>Provide regular updates on the fix progress</li>
          <li>Not take legal action for good faith research</li>
          <li>Give credit to researchers (if desired)</li>
        </ul>

        <p style={{ marginBottom: '24px' }}>For eligible vulnerabilities, researchers may qualify for our <Link href="/legal/bug-bounty" style={{ color: '#00ff00', textDecoration: 'underline' }}>bug bounty program</Link>.</p>

        <p style={{ color: '#888', fontSize: '14px' }}>For urgent security issues, contact our security team immediately at security@dvulndb.com</p>
      </div>
    </div>
  );
} 