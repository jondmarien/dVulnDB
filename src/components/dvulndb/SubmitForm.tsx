import React, { useState } from 'react';

const initialForm = {
  targetUrl: '',
  vulnType: '',
  cvss: 5,
  title: '',
  description: '',
  files: [] as File[],
};

const SubmitForm: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'range' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, files: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm(initialForm);
  };

  return (
    <section className="section section--submit" id="submit">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="terminal-prompt">user@dvulndb:~$ </span>
            Submit Vulnerability Report
          </h2>
        </div>
        <form className="vulnerability-form" id="vulnerabilityForm" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-section">
              <h3>Target Information</h3>
              <div className="form-group">
                <label className="form-label">Target URL/Domain</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com"
                  name="targetUrl"
                  value={form.targetUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vulnerability Type</label>
                <select
                  className="form-control"
                  name="vulnType"
                  value={form.vulnType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select vulnerability type</option>
                  <option value="xss">Cross-Site Scripting (XSS)</option>
                  <option value="sqli">SQL Injection</option>
                  <option value="idor">Insecure Direct Object Reference</option>
                  <option value="csrf">Cross-Site Request Forgery</option>
                  <option value="lfi">Local File Inclusion</option>
                  <option value="rce">Remote Code Execution</option>
                  <option value="auth">Authentication Bypass</option>
                  <option value="misc">Misconfiguration</option>
                </select>
              </div>
            </div>
            <div className="form-section">
              <h3>Severity Assessment</h3>
              <div className="form-group">
                <label className="form-label">
                  CVSS Score: <span id="cvssValue">{form.cvss.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  className="cvss-slider"
                  min={1}
                  max={10}
                  step={0.1}
                  name="cvss"
                  value={form.cvss}
                  onChange={handleChange}
                  id="cvssSlider"
                />
                <div className="cvss-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
            <div className="form-section full-width">
              <h3>Vulnerability Details</h3>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brief vulnerability title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Detailed description of the vulnerability..."
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-section full-width">
              <h3>Proof of Concept</h3>
              <div className="file-upload-area" id="fileUpload">
                <div className="upload-zone">
                  <div className="upload-icon">📁</div>
                  <p>Drag & drop security tool outputs here</p>
                  <p className="upload-formats">Supported: Nmap XML, Nikto TXT, Burp Suite XML</p>
                  <input
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    Choose Files
                  </button>
                  {form.files.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {form.files.map((file, idx) => (
                        <div key={idx}>{file.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--lg">
              🚀 Submit Vulnerability Report
            </button>
            <div className="submission-note">
              <p>⚠️ All submissions follow responsible disclosure practices</p>
            </div>
            {submitted && (
              <div className="notification notification--success" style={{ marginTop: 16 }}>
                <span style={{ fontSize: 20, marginRight: 8 }}>✅</span>
                Vulnerability report submitted successfully!
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default SubmitForm; 