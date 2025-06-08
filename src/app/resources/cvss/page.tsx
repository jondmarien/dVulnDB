export default function CVSSCalculator() {
  return (
    <div className="container" style={{ padding: '48px 0' }}>
      <h1 style={{ color: '#00ff00', marginBottom: 24 }}>CVSS Calculator</h1>
      <p>Use the CVSS calculator to score the severity of vulnerabilities according to industry standards.</p>
      <a href="https://www.first.org/cvss/calculator/3.1" target="_blank" rel="noopener noreferrer" style={{ color: '#00ff00', textDecoration: 'underline' }}>
        Open CVSS Calculator
      </a>
    </div>
  );
} 