import Link from "next/link";
import styles from './page.module.css';

export default function ResponsibleDisclosure() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Responsible Disclosure</h1>
      <div className={styles.content}>
        <p className={styles.paragraph}>DVulnDB values the security research community and encourages responsible disclosure of security vulnerabilities. If you believe you&apos;ve found a security issue, please follow these guidelines:</p>

        <h2 className={styles.subtitle}>Disclosure Guidelines</h2>
        <ul className={styles.list}>
          <li>Do not test vulnerabilities on production systems</li>
          <li>Do not access or modify other users&apos; data</li>
          <li>Provide detailed information about the vulnerability</li>
          <li>Allow reasonable time for remediation before public disclosure</li>
        </ul>

        <h2 className={styles.subtitle}>Reporting Process</h2>
        <p className={styles.paragraph}>When submitting a vulnerability report:</p>
        <ul className={styles.list}>
          <li>Include clear steps to reproduce the issue</li>
          <li>Describe the potential impact</li>
          <li>Provide any relevant technical details</li>
          <li>Submit through our secure reporting platform</li>
        </ul>

        <h2 className={styles.subtitle}>Our Commitment</h2>
        <p className={styles.paragraph}>We commit to:</p>
        <ul className={styles.list}>
          <li>Acknowledge receipt within 24 hours</li>
          <li>Provide regular updates on the fix progress</li>
          <li>Not take legal action for good faith research</li>
          <li>Give credit to researchers (if desired)</li>
        </ul>

        <p className={styles.paragraph}>For eligible vulnerabilities, researchers may qualify for our <Link href="/legal/bug-bounty" className={styles.link}>bug bounty program</Link>.</p>

        <p className={styles.footer}>For urgent security issues, contact our security team immediately at security@chron0.tech</p>
      </div>
    </div>
  );
} 