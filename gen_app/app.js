// DVulnDB Application JavaScript
class DVulnDBApp {
    constructor() {
        this.isWalletConnected = false;
        this.currentUser = null;
        this.vulnerabilities = [];
        this.researchers = [];
        this.bountyPrograms = [];
        this.recentActivity = [];
        this.toolIntegrations = [];
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderInitialContent();
        this.startActivityFeed();
    }

    loadData() {
        // Sample data from the provided JSON
        this.vulnerabilities = [
            {
                id: "VLN-2025-001",
                title: "Reflected XSS in Search Parameter",
                target: "example.com",
                type: "Cross-Site Scripting (XSS)",
                severity: 7,
                status: "Validated",
                researcher: "0x742...1234",
                bounty: "500 SOL",
                submitted: "2025-01-15",
                description: "Reflected XSS vulnerability found in search parameter allows arbitrary script execution",
                cvss: "7.3"
            },
            {
                id: "VLN-2025-002",
                title: "SQL Injection in User Login",
                target: "webapp.dev",
                type: "SQL Injection",
                severity: 9,
                status: "Under Review",
                researcher: "0x857...5678",
                bounty: "1000 SOL",
                submitted: "2025-01-20",
                description: "Boolean-based blind SQL injection in login form allows database enumeration",
                cvss: "9.1"
            },
            {
                id: "VLN-2025-003",
                title: "IDOR in User Profile Access",
                target: "api.service.com",
                type: "Insecure Direct Object Reference",
                severity: 6,
                status: "Disclosed",
                researcher: "0x923...9012",
                bounty: "300 SOL",
                submitted: "2025-01-10",
                description: "IDOR vulnerability allows unauthorized access to user profile data",
                cvss: "6.5"
            },
            {
                id: "VLN-2025-004",
                title: "Remote Code Execution via File Upload",
                target: "upload.secureapp.io",
                type: "Remote Code Execution",
                severity: 10,
                status: "Validated",
                researcher: "0x742...1234",
                bounty: "2000 SOL",
                submitted: "2025-01-18",
                description: "Unrestricted file upload leading to remote code execution through malicious PHP files",
                cvss: "10.0"
            },
            {
                id: "VLN-2025-005",
                title: "Authentication Bypass in Admin Panel",
                target: "admin.webapp.com",
                type: "Authentication Bypass",
                severity: 8,
                status: "Under Review",
                researcher: "0x857...5678",
                bounty: "750 SOL",
                submitted: "2025-01-22",
                description: "Session fixation vulnerability allows unauthorized access to administrative functions",
                cvss: "8.2"
            }
        ];

        this.researchers = [
            {
                address: "0x742...1234",
                username: "CyberSecJon",
                reputation: 850,
                specialization: "Web Application Security",
                vulnerabilities_found: 23,
                critical_finds: 5,
                total_earnings: "5,250 SOL",
                rank: 3,
                badges: ["Web Security Expert", "OWASP Top 10", "Critical Finder"]
            },
            {
                address: "0x857...5678",
                username: "SQLNinja",
                reputation: 920,
                specialization: "Database Security", 
                vulnerabilities_found: 31,
                critical_finds: 8,
                total_earnings: "7,100 SOL",
                rank: 2,
                badges: ["SQL Expert", "Database Security", "Elite Researcher"]
            },
            {
                address: "0x923...9012",
                username: "PentestPro",
                reputation: 780,
                specialization: "Network Security",
                vulnerabilities_found: 19,
                critical_finds: 3,
                total_earnings: "4,200 SOL",
                rank: 5,
                badges: ["Network Expert", "CISSP Certified"]
            }
        ];

        this.bountyPrograms = [
            {
                id: "BP-001",
                organization: "DeFi Protocol X",
                totalPool: "10,000 SOL",
                maxBounty: "2,000 SOL",
                scope: "Smart Contracts, Web Application",
                status: "Active",
                vulnerabilities: 12,
                participants: 45
            },
            {
                id: "BP-002",
                organization: "Web3 Exchange Pro",
                totalPool: "25,000 SOL",
                maxBounty: "5,000 SOL", 
                scope: "Trading Engine, API, Frontend",
                status: "Active",
                vulnerabilities: 8,
                participants: 67
            },
            {
                id: "BP-003",
                organization: "NFT Marketplace Elite",
                totalPool: "15,000 SOL",
                maxBounty: "3,000 SOL",
                scope: "Smart Contracts, IPFS Integration",
                status: "Active",
                vulnerabilities: 15,
                participants: 52
            }
        ];

        this.recentActivity = [
            {
                type: "vulnerability_submitted",
                researcher: "CyberSecJon",
                target: "example.com",
                timestamp: "2 hours ago"
            },
            {
                type: "bounty_paid",
                amount: "500 SOL",
                researcher: "SQLNinja",
                timestamp: "4 hours ago"
            },
            {
                type: "validation_completed",
                vulnerability: "VLN-2025-001",
                timestamp: "6 hours ago"
            },
            {
                type: "new_researcher",
                researcher: "BlockchainHacker",
                timestamp: "8 hours ago"
            }
        ];

        this.toolIntegrations = [
            {
                tool: "Nmap",
                description: "Network discovery and security auditing",
                supportedFormats: ["XML", "JSON"],
                sampleCommand: "nmap -sS -O target.com -oX output.xml"
            },
            {
                tool: "Nikto",
                description: "Web server scanner for vulnerabilities",
                supportedFormats: ["XML", "TXT"],
                sampleCommand: "nikto -h target.com -Format xml -output report.xml"
            },
            {
                tool: "Burp Suite",
                description: "Web application security testing platform",
                supportedFormats: ["XML", "JSON"],
                sampleCommand: "Export scan results as XML from Burp Suite Professional"
            }
        ];
    }

    setupEventListeners() {
        // Wallet connection
        const walletConnectBtn = document.getElementById('walletConnectBtn');
        const getStartedBtn = document.getElementById('getStarted');
        
        if (walletConnectBtn) {
            walletConnectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.connectWallet();
            });
        }
        
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.connectWallet();
            });
        }

        // Navigation
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
                this.updateActiveNavLink(link);
            });
        });

        // Quick actions
        const quickActionBtns = document.querySelectorAll('[data-action]');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Filters
        const severityFilter = document.getElementById('severityFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (severityFilter) {
            severityFilter.addEventListener('change', () => this.filterVulnerabilities());
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterVulnerabilities());
        }

        // CVSS Slider
        const cvssSlider = document.getElementById('cvssSlider');
        const cvssValue = document.getElementById('cvssValue');
        
        if (cvssSlider && cvssValue) {
            cvssSlider.addEventListener('input', (e) => {
                cvssValue.textContent = e.target.value;
            });
        }

        // Form submission
        const vulnerabilityForm = document.getElementById('vulnerabilityForm');
        if (vulnerabilityForm) {
            vulnerabilityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitVulnerability();
            });
        }
    }

    connectWallet() {
        // Simulate wallet connection with faster response
        this.showLoadingNotification("Connecting to wallet...");
        
        // Disable button during connection
        const walletConnectBtn = document.getElementById('walletConnectBtn');
        const getStartedBtn = document.getElementById('getStarted');
        
        if (walletConnectBtn) {
            walletConnectBtn.disabled = true;
            walletConnectBtn.textContent = "Connecting...";
        }
        if (getStartedBtn) {
            getStartedBtn.disabled = true;
            getStartedBtn.textContent = "Connecting...";
        }
        
        // Show connection steps
        setTimeout(() => {
            this.showLoadingNotification("Authenticating wallet signature...");
        }, 500);
        
        setTimeout(() => {
            this.showLoadingNotification("Initializing security protocol...");
        }, 1000);
        
        setTimeout(() => {
            this.isWalletConnected = true;
            this.currentUser = this.researchers[0]; // Use CyberSecJon as current user
            
            // Update UI
            const walletInfo = document.getElementById('walletInfo');
            const walletAddress = document.getElementById('walletAddress');
            const walletBalance = document.getElementById('walletBalance');
            
            if (walletConnectBtn) walletConnectBtn.classList.add('hidden');
            if (walletInfo) walletInfo.classList.remove('hidden');
            if (walletAddress) walletAddress.textContent = this.currentUser.address;
            if (walletBalance) walletBalance.textContent = '12.5 SOL';
            
            this.showSuccessNotification("Wallet connected successfully! Welcome to DVulnDB");
            
            // Automatically navigate to dashboard
            setTimeout(() => {
                this.navigateToSection('dashboard');
                const dashboardNavLink = document.querySelector('[data-section="dashboard"]');
                if (dashboardNavLink) {
                    this.updateActiveNavLink(dashboardNavLink);
                }
                this.updateUserStats();
            }, 1000);
            
        }, 1500); // Reduced from 2000ms to 1500ms
    }

    navigateToSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Handle section-specific rendering
        switch(sectionName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'vulnerabilities':
                this.renderVulnerabilities();
                break;
            case 'bounties':
                this.renderBounties();
                break;
            case 'tools':
                this.renderTools();
                break;
        }
    }

    updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    renderInitialContent() {
        if (!this.isWalletConnected) {
            this.navigateToSection('landing');
        }
    }

    renderDashboard() {
        this.renderActivityFeed();
        this.renderLeaderboard();
    }

    renderActivityFeed() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;

        const activityHTML = this.recentActivity.map(activity => {
            let icon, text, iconBg;
            
            switch(activity.type) {
                case 'vulnerability_submitted':
                    icon = '🎯';
                    iconBg = '#00ff00';
                    text = `${activity.researcher} submitted vulnerability report for ${activity.target}`;
                    break;
                case 'bounty_paid':
                    icon = '💰';
                    iconBg = '#ffd700';
                    text = `${activity.amount} bounty paid to ${activity.researcher}`;
                    break;
                case 'validation_completed':
                    icon = '✅';
                    iconBg = '#00ff00';
                    text = `Vulnerability ${activity.vulnerability} validation completed`;
                    break;
                case 'new_researcher':
                    icon = '👤';
                    iconBg = '#00b4d8';
                    text = `${activity.researcher} joined the platform`;
                    break;
                default:
                    icon = '📋';
                    iconBg = '#888';
                    text = 'Unknown activity';
            }

            return `
                <div class="activity-item">
                    <div class="activity-icon" style="background: ${iconBg}; color: #000;">
                        ${icon}
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${text}</div>
                        <div class="activity-time">${activity.timestamp}</div>
                    </div>
                </div>
            `;
        }).join('');

        activityFeed.innerHTML = activityHTML;
    }

    renderLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        if (!leaderboard) return;

        const sortedResearchers = [...this.researchers].sort((a, b) => b.reputation - a.reputation);
        
        const leaderboardHTML = sortedResearchers.slice(0, 5).map((researcher, index) => {
            return `
                <div class="researcher-item">
                    <div class="researcher-rank">${index + 1}</div>
                    <div class="researcher-info">
                        <div class="researcher-name">${researcher.username}</div>
                        <div class="researcher-stats">${researcher.vulnerabilities_found} vulns • ${researcher.total_earnings}</div>
                    </div>
                    <div class="researcher-rep">${researcher.reputation}</div>
                </div>
            `;
        }).join('');

        leaderboard.innerHTML = leaderboardHTML;
    }

    renderVulnerabilities() {
        const vulnerabilityGrid = document.getElementById('vulnerabilityGrid');
        if (!vulnerabilityGrid) return;

        const vulnerabilitiesHTML = this.vulnerabilities.map(vuln => {
            const severityClass = this.getSeverityClass(vuln.severity);
            const statusClass = this.getStatusClass(vuln.status);

            return `
                <div class="card vulnerability-card">
                    <div class="vuln-header">
                        <div class="vuln-id">${vuln.id}</div>
                        <div class="severity-badge ${severityClass}">
                            CVSS ${vuln.cvss}
                        </div>
                    </div>
                    <h3 class="vuln-title">${vuln.title}</h3>
                    <div class="vuln-meta">
                        <div class="vuln-target">${vuln.target}</div>
                        <div class="status ${statusClass}">${vuln.status}</div>
                    </div>
                    <div class="vuln-type">${vuln.type}</div>
                    <div class="vuln-description">${vuln.description}</div>
                    <div class="vuln-footer">
                        <div class="vuln-bounty">${vuln.bounty}</div>
                        <div class="vuln-researcher">${vuln.researcher}</div>
                    </div>
                </div>
            `;
        }).join('');

        vulnerabilityGrid.innerHTML = vulnerabilitiesHTML;
    }

    renderBounties() {
        const bountyGrid = document.getElementById('bountyGrid');
        if (!bountyGrid) return;

        const bountiesHTML = this.bountyPrograms.map(bounty => {
            return `
                <div class="card bounty-card">
                    <div class="bounty-header">
                        <div class="bounty-org">${bounty.organization}</div>
                        <div class="status status--success">${bounty.status}</div>
                    </div>
                    <div class="bounty-pool">${bounty.totalPool}</div>
                    <div class="bounty-scope">Scope: ${bounty.scope}</div>
                    <div class="bounty-stats">
                        <div class="bounty-stat">
                            <div class="bounty-stat-value">${bounty.vulnerabilities}</div>
                            <div class="bounty-stat-label">Vulnerabilities</div>
                        </div>
                        <div class="bounty-stat">
                            <div class="bounty-stat-value">${bounty.participants}</div>
                            <div class="bounty-stat-label">Participants</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn--primary btn--full-width">
                            🎯 Join Program
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        bountyGrid.innerHTML = bountiesHTML;
    }

    renderTools() {
        // Tools are already rendered in HTML, just add any dynamic content if needed
        console.log('Tools section rendered');
    }

    filterVulnerabilities() {
        const severityFilter = document.getElementById('severityFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (!severityFilter || !statusFilter) return;

        const severityValue = severityFilter.value;
        const statusValue = statusFilter.value;

        let filteredVulns = this.vulnerabilities;

        if (severityValue) {
            filteredVulns = filteredVulns.filter(vuln => {
                switch(severityValue) {
                    case 'critical':
                        return vuln.severity >= 9;
                    case 'high':
                        return vuln.severity >= 7 && vuln.severity < 9;
                    case 'medium':
                        return vuln.severity >= 4 && vuln.severity < 7;
                    case 'low':
                        return vuln.severity < 4;
                    default:
                        return true;
                }
            });
        }

        if (statusValue) {
            filteredVulns = filteredVulns.filter(vuln => vuln.status === statusValue);
        }

        this.renderFilteredVulnerabilities(filteredVulns);
    }

    renderFilteredVulnerabilities(vulnerabilities) {
        const vulnerabilityGrid = document.getElementById('vulnerabilityGrid');
        if (!vulnerabilityGrid) return;

        const vulnerabilitiesHTML = vulnerabilities.map(vuln => {
            const severityClass = this.getSeverityClass(vuln.severity);
            const statusClass = this.getStatusClass(vuln.status);

            return `
                <div class="card vulnerability-card">
                    <div class="vuln-header">
                        <div class="vuln-id">${vuln.id}</div>
                        <div class="severity-badge ${severityClass}">
                            CVSS ${vuln.cvss}
                        </div>
                    </div>
                    <h3 class="vuln-title">${vuln.title}</h3>
                    <div class="vuln-meta">
                        <div class="vuln-target">${vuln.target}</div>
                        <div class="status ${statusClass}">${vuln.status}</div>
                    </div>
                    <div class="vuln-type">${vuln.type}</div>
                    <div class="vuln-description">${vuln.description}</div>
                    <div class="vuln-footer">
                        <div class="vuln-bounty">${vuln.bounty}</div>
                        <div class="vuln-researcher">${vuln.researcher}</div>
                    </div>
                </div>
            `;
        }).join('');

        vulnerabilityGrid.innerHTML = vulnerabilitiesHTML;
    }

    handleQuickAction(action) {
        switch(action) {
            case 'submit':
                this.navigateToSection('submit');
                this.updateActiveNavLink(document.querySelector('[data-section="submit"]'));
                break;
            case 'scan':
                this.navigateToSection('vulnerabilities');
                this.updateActiveNavLink(document.querySelector('[data-section="vulnerabilities"]'));
                break;
            case 'bounties':
                this.navigateToSection('bounties');
                this.updateActiveNavLink(document.querySelector('[data-section="bounties"]'));
                break;
        }
    }

    submitVulnerability() {
        this.showLoadingNotification("Submitting vulnerability report...");
        
        setTimeout(() => {
            // Simulate blockchain transaction
            this.showTransactionNotification("0x1a2b3c4d5e6f7890abcdef1234567890abcdef12");
            
            setTimeout(() => {
                this.showSuccessNotification("Vulnerability report submitted successfully!");
                
                // Add to recent activity
                this.recentActivity.unshift({
                    type: "vulnerability_submitted",
                    researcher: this.currentUser.username,
                    target: "new-target.com",
                    timestamp: "Just now"
                });
                
                this.renderActivityFeed();
                this.navigateToSection('dashboard');
                this.updateActiveNavLink(document.querySelector('[data-section="dashboard"]'));
            }, 2000);
        }, 1000);
    }

    updateUserStats() {
        if (!this.currentUser) return;

        const userVulns = document.getElementById('userVulns');
        const userRep = document.getElementById('userRep');
        const userEarnings = document.getElementById('userEarnings');
        const userRank = document.getElementById('userRank');

        if (userVulns) userVulns.textContent = this.currentUser.vulnerabilities_found;
        if (userRep) userRep.textContent = this.currentUser.reputation;
        if (userEarnings) userEarnings.textContent = this.currentUser.total_earnings;
        if (userRank) userRank.textContent = `#${this.currentUser.rank}`;
    }

    startActivityFeed() {
        // Simulate real-time activity updates
        setInterval(() => {
            if (this.isWalletConnected && this.recentActivity.length > 0) {
                // Randomly update timestamps
                this.recentActivity.forEach(activity => {
                    if (activity.timestamp.includes('hour')) {
                        const hours = parseInt(activity.timestamp.match(/\d+/)[0]) + 1;
                        activity.timestamp = `${hours} hours ago`;
                    }
                });
                
                // Re-render if on dashboard
                const dashboardSection = document.getElementById('dashboard');
                if (dashboardSection && dashboardSection.classList.contains('active')) {
                    this.renderActivityFeed();
                }
            }
        }, 30000); // Update every 30 seconds
    }

    getSeverityClass(severity) {
        if (severity >= 9) return 'severity-critical';
        if (severity >= 7) return 'severity-high';
        if (severity >= 4) return 'severity-medium';
        return 'severity-low';
    }

    getStatusClass(status) {
        switch(status) {
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

    showLoadingNotification(message) {
        // Remove any existing notifications first
        this.removeExistingNotifications();
        this.createNotification(message, 'loading');
    }

    showSuccessNotification(message) {
        this.removeExistingNotifications();
        this.createNotification(message, 'success');
    }

    showTransactionNotification(txHash) {
        this.removeExistingNotifications();
        this.createNotification(`Transaction submitted: ${txHash}`, 'info');
    }

    removeExistingNotifications() {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
    }

    createNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-cyber-gray);
            border: 1px solid var(--color-cyber-green);
            border-radius: var(--radius-base);
            padding: var(--space-16);
            color: var(--color-cyber-green);
            font-family: var(--font-family-mono);
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            animation: slideIn 0.3s ease-out;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-12);">
                <span style="font-size: 20px;">
                    ${type === 'loading' ? '⏳' : type === 'success' ? '✅' : '📡'}
                </span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after duration based on type
        const duration = type === 'loading' ? 3000 : 5000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dvulnDB = new DVulnDBApp();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);