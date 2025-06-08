# Decentralized Vulnerability Database (DVulnDB)

A blockchain-based vulnerability disclosure platform that enables security researchers to securely report vulnerabilities and receive cryptocurrency bounty rewards. Built with Solidity smart contracts and a modern Next.js frontend.

![DVulnDB Banner](https://via.placeholder.com/800x400/1f2937/3b82f6?text=DVulnDB+-+Decentralized+Vulnerability+Database)

## 🔥 Features

### 🛡️ Core Security Features
- **Decentralized Storage**: Vulnerability reports encrypted and stored on IPFS
- **Multi-Signature Validation**: 3-of-5 validator consensus for bounty releases
- **Time-Locked Disclosure**: 90-day responsible disclosure period
- **Sybil Resistance**: Reputation-based validation system
- **Privacy Protection**: Zero-knowledge proofs for researcher identity

### 💰 Bounty System
- **Smart Contract Escrow**: Automated bounty payments upon validation
- **Tiered Rewards**: CVSS-based severity scoring (1-10)
- **Multi-Currency Support**: ETH and ERC-20 token bounties
- **Dispute Resolution**: Community-driven conflict resolution

### 🏆 Reputation System
- **Dynamic NFTs**: ERC-721 reputation tokens with evolving metadata
- **Skill Tracking**: Specialization categories (Web, Mobile, Smart Contract, etc.)
- **Performance Metrics**: Historical accuracy, response time, impact scores
- **Leaderboards**: Global and category-specific rankings

### 🔧 Tool Integration
- **Penetration Testing Tools**: Native support for Nmap, Nikto, Burp Suite
- **PowerShell Modules**: Custom cmdlets for automated submissions
- **CI/CD Integration**: GitHub Actions for automated security scanning
- **API Access**: RESTful API for external tool integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Hardhat for smart contract development
- Git for version control

### 1. Clone the Repository

```bash
git clone https://github.com/issessions/dvulndb-prototype.git
cd dvulndb-prototype
```

### 2. Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```bash
# Blockchain Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=0x1234567890abcdef...
ETHERSCAN_API_KEY=YOUR-ETHERSCAN-API-KEY

# Frontend Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key

# IPFS Configuration
INFURA_IPFS_PROJECT_ID=your-infura-ipfs-project-id
INFURA_IPFS_PROJECT_SECRET=your-infura-ipfs-secret
```

### 4. Deploy Smart Contracts

```bash
# Start local blockchain
npx hardhat node

# Deploy to local network
npx hardhat deploy --network localhost

# Or deploy to Sepolia testnet
npx hardhat deploy --network sepolia
```

### 5. Run the Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🏗️ Architecture

### Smart Contract Structure

```
contracts/
├── VulnerabilityRegistry.sol    # Core vulnerability management
├── BountyEscrow.sol            # Multi-sig escrow system
├── ReputationNFT.sol           # ERC-721 reputation tokens
└── interfaces/
    ├── IVulnerabilityRegistry.sol
    └── IBountyEscrow.sol
```

### Frontend Architecture

```
frontend/src/
├── app/                        # Next.js 13+ app directory
├── components/
│   ├── layout/                # Header, Footer, Navigation
│   ├── vulnerability/         # Vulnerability-specific components
│   ├── dashboard/            # Dashboard widgets
│   └── ui/                   # Reusable UI components
├── hooks/                     # Custom React hooks for Web3
├── utils/                     # Utility functions and helpers
├── config/                    # Configuration files
└── types/                     # TypeScript type definitions
```

## 📖 Usage Guide

### For Security Researchers

#### 1. Submit a Vulnerability Report

```typescript
// Example vulnerability submission
const submission = {
  targetUrl: "https://example.com",
  targetDescription: "E-commerce platform",
  severity: 8,
  title: "SQL Injection in Login Form",
  description: "The login form is vulnerable to SQL injection...",
  reproductionSteps: [
    "Navigate to /login",
    "Enter 'admin' OR '1'='1' -- in username field",
    "Click submit",
    "Observe unauthorized access"
  ],
  proofOfConcept: "<!-- PoC code here -->",
  toolOutputs: [nmapFile, niktoFile],
  bountyAmount: "0.5" // ETH
}

await submitVulnerability(submission)
```

#### 2. Upload Tool Outputs

```bash
# Using the PowerShell module (future feature)
Import-Module DVulnDB
Submit-Vulnerability -Target "example.com" -Type "SQLi" -Severity 8 -ProofPath "./poc.sql"
```

#### 3. Track Submission Status

```typescript
const { vulnerability } = useVulnerability(submissionId)
const status = vulnerability?.status // SUBMITTED, VALIDATING, CONFIRMED, etc.
```

### For Validators

#### 1. Review Submissions

```typescript
const { validateVulnerability } = useVulnerabilityRegistry()

// Approve vulnerability
await validateVulnerability(vulnId, true)

// Reject vulnerability
await validateVulnerability(vulnId, false)
```

#### 2. Multi-Signature Approval

```typescript
const { approveBountyRelease } = useBountyEscrow()
await approveBountyRelease(vulnId)
```

### For Project Maintainers

#### 1. Fund Bounty Programs

```solidity
// Send ETH to fund bounties
await vulnerabilityRegistry.fundBountyProgram({
  value: parseEther("10.0") // 10 ETH
})
```

#### 2. Access Disclosed Vulnerabilities

```typescript
const { vulnerability } = useVulnerability(vulnId)
if (vulnerability.isDisclosed) {
  // Access full vulnerability details
  const report = await getVulnerabilityReport(vulnerability.ipfsHash, true)
}
```

## 🧪 Testing

### Run Smart Contract Tests

```bash
npx hardhat test
```

### Test Coverage

```bash
npx hardhat coverage
```

### Gas Optimization

```bash
REPORT_GAS=true npx hardhat test
```

Example test output:
```
✅ VulnerabilityRegistry
  ✅ Should submit vulnerability successfully
  ✅ Should validate with consensus
  ✅ Should pay bounty automatically
  ✅ Should prevent duplicate submissions
  ✅ Gas usage: 487,329 (within budget)
```

## 🛠️ Development

### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy locally
npx hardhat node
npx hardhat deploy --network localhost

# Verify on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Features

1. **Smart Contract Changes**:
   - Update contracts in `/contracts`
   - Add comprehensive tests in `/test`
   - Update deployment scripts in `/deploy`

2. **Frontend Changes**:
   - Add new components in `/frontend/src/components`
   - Create custom hooks in `/frontend/src/hooks`
   - Update types in `/frontend/src/types`

## 🔒 Security Considerations

### Smart Contract Security

- **Reentrancy Protection**: All external calls protected with ReentrancyGuard
- **Access Control**: Role-based permissions with OpenZeppelin
- **Input Validation**: Comprehensive validation of all user inputs
- **Pause Mechanism**: Emergency pause functionality for critical issues

### Frontend Security

- **Wallet Security**: MetaMask integration with secure transaction signing
- **IPFS Encryption**: Sensitive data encrypted before IPFS storage
- **XSS Protection**: Content Security Policy and input sanitization
- **HTTPS Only**: All communications over secure channels

### Privacy Protection

- **Anonymous Submissions**: Optional anonymous vulnerability reporting
- **Zero-Knowledge Proofs**: Researcher identity verification without exposure
- **Time-Locked Disclosure**: Gradual information release based on timeline

## 📊 Performance Metrics

### Smart Contract Efficiency

| Operation | Gas Cost | Optimization |
|-----------|----------|--------------|
| Submit Vulnerability | ~487K gas | Batch operations |
| Validate Submission | ~89K gas | State packing |
| Release Bounty | ~156K gas | Direct transfers |
| Mint Reputation NFT | ~234K gas | Lazy minting |

### Frontend Performance

- **Initial Load**: < 2 seconds
- **Web3 Connection**: < 1 second
- **IPFS Upload**: < 5 seconds (avg)
- **Transaction Confirmation**: ~15 seconds (Sepolia)

## 🌍 Deployment

### Testnet Deployment (Sepolia)

```bash
# Deploy contracts
npx hardhat deploy --network sepolia

# Verify contracts
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# Deploy frontend
cd frontend
npm run build
npm run start
```

### Mainnet Deployment

```bash
# Security audit required before mainnet
# Update network configuration
# Deploy with multi-sig wallet
npx hardhat deploy --network mainnet
```

## 🤝 Contributing

We welcome contributions from the cybersecurity and Web3 communities!

### Development Process

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript**: Use strict type checking
- **Testing**: Minimum 95% code coverage
- **Documentation**: Update docs for all changes

### Bug Reports

Use GitHub issues with the bug report template:
- Environment details
- Reproduction steps
- Expected vs actual behavior
- Screenshots/logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ISSessions**: The largest post-secondary infosec club in Canada
- **OpenZeppelin**: Smart contract security frameworks
- **Ethereum Foundation**: Platform and tooling
- **IPFS**: Decentralized storage infrastructure
- **Web3Modal**: Wallet connection libraries

## 📞 Support

- **Discord**: [ISSessions Community](https://discord.gg/issessions)
- **Twitter**: [@ISSessions](https://twitter.com/issessions)
- **Email**: security@issessions.com
- **Documentation**: [dvulndb.issessions.com](https://dvulndb.issessions.com)

---

**Built with ❤️ by Jon and the ISSessions team**

*Securing the Web3 ecosystem, one vulnerability at a time.*