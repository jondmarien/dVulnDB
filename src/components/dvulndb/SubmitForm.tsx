"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@context/ToastContext';

type SubmitFormProps = {
  isActive: boolean;
};

// Smart defaults and validation rules
const VULNERABILITY_TYPES = [
  { value: 'xss', label: 'Cross-Site Scripting (XSS)', defaultCvss: 6.1, category: 'injection' },
  { value: 'sqli', label: 'SQL Injection', defaultCvss: 8.8, category: 'injection' },
  { value: 'rce', label: 'Remote Code Execution', defaultCvss: 9.8, category: 'execution' },
  { value: 'auth', label: 'Authentication Bypass', defaultCvss: 8.1, category: 'auth' },
  { value: 'idor', label: 'Insecure Direct Object Reference', defaultCvss: 6.5, category: 'access' },
  { value: 'csrf', label: 'Cross-Site Request Forgery', defaultCvss: 6.5, category: 'injection' },
  { value: 'lfi', label: 'Local File Inclusion', defaultCvss: 7.5, category: 'access' },
  { value: 'misc', label: 'Security Misconfiguration', defaultCvss: 5.3, category: 'config' },
  { value: 'other', label: 'Other', defaultCvss: 5.0, category: 'other' },
];

const SEVERITY_LABELS = {
  1: { label: 'Informational', color: '#888', description: 'No immediate risk' },
  2: { label: 'Low', color: '#00ff00', description: 'Minimal security impact' },
  4: { label: 'Medium', color: '#ffff00', description: 'Moderate security risk' },
  7: { label: 'High', color: '#ffa500', description: 'Significant security risk' },
  9: { label: 'Critical', color: '#ff3333', description: 'Severe security risk' },
};

const initialForm = {
  // Essential fields only
  targetUrl: '',
  vulnType: '',
  title: '',
  description: '',
  
  // Auto-calculated/smart defaults
  cvss: 5.0,
  severity: 4 as keyof typeof SEVERITY_LABELS, // Use numeric key value instead of 'medium'
  
  // Progressive disclosure fields
  reproductionSteps: '',
  impact: '',
  recommendation: '',
  files: [] as File[],
  
  // Advanced options (hidden by default)
  cwe: '',
  affectedVersions: '',
  references: '',
};


const SubmitForm: React.FC<SubmitFormProps> = ({ isActive }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // Smart CVSS calculation based on vulnerability type
  useEffect(() => {
    if (form.vulnType) {
      const vulnData = VULNERABILITY_TYPES.find(v => v.value === form.vulnType);
      if (vulnData) {
        setForm(prev => ({ 
          ...prev, 
          cvss: vulnData.defaultCvss,
          severity: getSeverityFromCvss(vulnData.defaultCvss)
        }));
      }
    }
  }, [form.vulnType]);

  // Auto-generate title based on vulnerability type and target
  useEffect(() => {
    if (form.vulnType && form.targetUrl && !form.title) {
      const vulnData = VULNERABILITY_TYPES.find(v => v.value === form.vulnType);
      const domain = extractDomain(form.targetUrl);
      if (vulnData && domain) {
        setForm(prev => ({
          ...prev,
          title: `${vulnData.label} in ${domain}`
        }));
      }
    }
  }, [form.vulnType, form.targetUrl]);

  const extractDomain = (url: string): string => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      return url;
    }
  };

  const getSeverityFromCvss = (cvss: number): keyof typeof SEVERITY_LABELS => {
    if (cvss >= 9) return 9;
    if (cvss >= 7) return 7;
    if (cvss >= 4) return 4;
    if (cvss >= 2) return 2;
    return 1;
  };

  // Real-time validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'targetUrl':
        if (!value) return 'Target URL is required';
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`);
          return '';
        } catch {
          return 'Please enter a valid URL';
        }
      case 'vulnType':
        return !value ? 'Please select a vulnerability type' : '';
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 50) return 'Please provide more details (minimum 50 characters)';
        return '';
      case 'title':
        if (!value) return 'Title is required';
        if (value.length < 10) return 'Title should be more descriptive';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'range' ? Number(value) : value;
    
    setForm(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for critical fields
    if (['targetUrl', 'vulnType', 'title'].includes(name)) {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const validTypes = ['.xml', '.txt', '.json', '.png', '.jpg', '.pdf'];
        const isValid = validTypes.some(type => file.name.toLowerCase().endsWith(type));
        if (!isValid) {
          showToast(`File ${file.name} is not supported`, 'info');
        }
        return isValid;
      });
      setForm(prev => ({ ...prev, files: validFiles }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    newErrors.targetUrl = validateField('targetUrl', form.targetUrl);
    newErrors.vulnType = validateField('vulnType', form.vulnType);
    newErrors.title = validateField('title', form.title);
    newErrors.description = validateField('description', form.description);
    
    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, error]) => error !== '')
    );
    
    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'info');
      return;
    }
    
    setIsSubmitting(true);
    showToast('Submitting vulnerability report...', 'loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('Vulnerability report submitted successfully!', 'success');
      setForm(initialForm);
      setCurrentStep(1);
      setShowAdvanced(false);
      setShowSteps(false);
    } catch (error) {
      showToast('Failed to submit report. Please try again.', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate essential fields before proceeding
      const essentialErrors = {
        targetUrl: validateField('targetUrl', form.targetUrl),
        vulnType: validateField('vulnType', form.vulnType),
      };
      
      const hasErrors = Object.values(essentialErrors).some(error => error !== '');
      if (hasErrors) {
        setErrors(essentialErrors);
        showToast('Please complete the required fields', 'info');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getSeverityInfo = (cvss: number) => {
    const severity = getSeverityFromCvss(cvss);
    return SEVERITY_LABELS[severity];
  };

  return (
    <section className={`section section--submit${isActive ? ' active' : ''}`} id="submit">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="terminal-prompt">user@dvulndb:~$ </span>
            Submit Vulnerability Report
          </h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowSteps(!showSteps)}
              className="btn btn--secondary btn--sm"
            >
              {showSteps ? 'Simple Form' : 'Step-by-Step'}
            </button>
          </div>
        </div>

        <form className="vulnerability-form" onSubmit={handleSubmit}>
          {/* Progress indicator for step-by-step mode */}
          {showSteps && (
            <div className="progress-steps mb-8">
              <div className="flex justify-between items-center">
                {['Basic Info', 'Details', 'Review'].map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center ${index + 1 <= currentStep ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        index + 1 <= currentStep
                          ? 'border-green-400 bg-green-400 text-black'
                          : 'border-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-2 font-medium">{step}</span>
                    {index < 2 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          index + 1 < currentStep ? 'bg-green-400' : 'bg-gray-500'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 or Full Form: Basic Information */}
          {(!showSteps || currentStep === 1) && (
            <div className="form-section">
              <h3>Essential Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    Target URL/Domain *
                    <span className="text-xs text-gray-400 ml-2">
                      (e.g., https://example.com or example.com)
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.targetUrl ? 'border-red-500' : ''}`}
                    placeholder="https://example.com"
                    name="targetUrl"
                    value={form.targetUrl}
                    onChange={handleChange}
                    required
                  />
                  {errors.targetUrl && (
                    <div className="text-red-400 text-sm mt-1">{errors.targetUrl}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Vulnerability Type *</label>
                  <select
                    className={`form-control ${errors.vulnType ? 'border-red-500' : ''}`}
                    name="vulnType"
                    value={form.vulnType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select vulnerability type</option>
                    {VULNERABILITY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.vulnType && (
                    <div className="text-red-400 text-sm mt-1">{errors.vulnType}</div>
                  )}
                </div>
              </div>

              {/* Auto-calculated severity display */}
              {form.vulnType && (
                <div className="form-group">
                  <label className="form-label">
                    Estimated Severity
                    <span className="text-xs text-gray-400 ml-2">
                      (Auto-calculated based on vulnerability type)
                    </span>
                  </label>
                  <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getSeverityInfo(form.cvss).color }}
                      />
                      <span className="font-semibold">
                        {getSeverityInfo(form.cvss).label}
                      </span>
                      <span className="text-gray-400">
                        (CVSS {form.cvss.toFixed(1)})
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {getSeverityInfo(form.cvss).description}
                    </span>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Title *
                  {form.vulnType && form.targetUrl && (
                    <span className="text-xs text-green-400 ml-2">(Auto-generated)</span>
                  )}
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Brief, descriptive title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && (
                  <div className="text-red-400 text-sm mt-1">{errors.title}</div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 or Full Form: Detailed Information */}
          {(!showSteps || currentStep === 2) && (
            <div className="form-section">
              <h3>Vulnerability Details</h3>
              
              <div className="form-group">
                <label className="form-label">
                  Description *
                  <span className="text-xs text-gray-400 ml-2">
                    (Minimum 50 characters)
                  </span>
                </label>
                <textarea
                  className={`form-control ${errors.description ? 'border-red-500' : ''}`}
                  rows={4}
                  placeholder="Describe the vulnerability, how it works, and what makes it exploitable..."
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{form.description.length}/50 minimum</span>
                  {errors.description && (
                    <span className="text-red-400">{errors.description}</span>
                  )}
                </div>
              </div>

              {/* Progressive disclosure for additional details */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <span>{showAdvanced ? '▼' : '▶'}</span>
                  Additional Details (Optional)
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pl-6 border-l-2 border-green-400/30">
                    <div className="form-group">
                      <label className="form-label">Reproduction Steps</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="1. Navigate to /login&#10;2. Enter payload in username field&#10;3. Click submit..."
                        name="reproductionSteps"
                        value={form.reproductionSteps}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Impact Assessment</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="What could an attacker achieve? What data/systems are at risk?"
                        name="impact"
                        value={form.impact}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Recommended Fix</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="How should this vulnerability be fixed?"
                        name="recommendation"
                        value={form.recommendation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* File upload with better UX */}
              <div className="form-group">
                <label className="form-label">
                  Proof of Concept Files
                  <span className="text-xs text-gray-400 ml-2">(Optional)</span>
                </label>
                <div className="file-upload-area">
                  <div className="upload-zone">
                    <div className="upload-icon">📁</div>
                    <p>Drop files here or click to browse</p>
                    <p className="upload-formats">
                      Supported: Screenshots, tool outputs (XML, TXT, JSON), PDFs
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".xml,.txt,.json,.png,.jpg,.jpeg,.pdf"
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
                  </div>
                  {form.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-green-400">Uploaded Files:</h4>
                      {form.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setForm(prev => ({
                              ...prev,
                              files: prev.files.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review (only in step mode) */}
          {showSteps && currentStep === 3 && (
            <div className="form-section">
              <h3>Review Your Submission</h3>
              <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                <div>
                  <strong className="text-green-400">Target:</strong> {form.targetUrl}
                </div>
                <div>
                  <strong className="text-green-400">Type:</strong> {
                    VULNERABILITY_TYPES.find(t => t.value === form.vulnType)?.label
                  }
                </div>
                <div>
                  <strong className="text-green-400">Severity:</strong> {
                    getSeverityInfo(form.cvss).label
                  } (CVSS {form.cvss.toFixed(1)})
                </div>
                <div>
                  <strong className="text-green-400">Title:</strong> {form.title}
                </div>
                <div>
                  <strong className="text-green-400">Description:</strong>
                  <p className="mt-1 text-gray-300">{form.description}</p>
                </div>
                {form.files.length > 0 && (
                  <div>
                    <strong className="text-green-400">Files:</strong> {form.files.length} file(s)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            {showSteps ? (
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`btn btn--secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentStep === 1}
                >
                  ← Previous
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn--primary"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn--primary btn--lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      '🚀 Submit Report'
                    )}
                  </button>
                )}
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  '🚀 Submit Vulnerability Report'
                )}
              </button>
            )}
            
            <div className="submission-note">
              <p>⚠️ All submissions follow responsible disclosure practices</p>
              <p className="text-xs text-gray-400 mt-1">
                Your report will be encrypted and stored securely. Only validated researchers can access sensitive details.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SubmitForm;