# DVulnDB API & Data Management Patterns

## Data Models
- **Vulnerability Record**:
  ```typescript
  interface Vulnerability {
    id: string;
    cveId?: string;
    title: string;
    description: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
    cvssScore: number;
    cvssVector: string;
    cvssVersion: '3.0' | '4.0';
    category: string;
    cweId?: string;
    affectedSystems: string[];
    discoveredBy: string;
    submittedAt: Date;
    status: 'Submitted' | 'Under Review' | 'Validated' | 'Rejected' | 'Disclosed';
    bountyAmount?: number;
    ipfsHash: string;
    blockchainTxHash?: string;
  }
  ```

- **Researcher Profile**:
  ```typescript
  interface Researcher {
    walletAddress: string;
    username: string;
    reputation: number;
    specializations: string[];
    vulnerabilitiesFound: number;
    totalEarnings: number;
    joinedAt: Date;
    nftProfileId?: string;
    badges: string[];
  }
  ```

- **Bounty Program**:
  ```typescript
  interface BountyProgram {
    id: string;
    name: string;
    description: string;
    scope: string[];
    totalPool: number;
    remainingPool: number;
    minSeverity: string;
    maxPayout: number;
    status: 'Active' | 'Paused' | 'Completed';
    validatorRequirements: number;
    createdBy: string;
    escrowAddress: string;
  }
  ```

## API Endpoints Structure
- **RESTful Design**: Use standard HTTP methods and status codes
- **Versioning**: Version APIs with `/api/v1/` prefix
- **Authentication**: JWT tokens for authenticated endpoints
- **Rate Limiting**: Implement rate limiting per user/IP
- **Error Handling**: Consistent error response format

## State Management
- **React Query**: Use for server state management and caching
- **Context API**: For global app state (wallet, user preferences)
- **Local Storage**: Persist user preferences and draft submissions
- **Session Storage**: Temporary data that shouldn't persist

## Blockchain Data Synchronization
- **Event Listeners**: Listen to smart contract events for real-time updates
- **Polling Strategy**: Fallback polling for missed events
- **Data Reconciliation**: Periodic sync between local and blockchain state
- **Optimistic Updates**: Update UI immediately, reconcile with blockchain

## IPFS Integration Patterns
- **Content Structure**:
  ```typescript
  interface VulnerabilityReport {
    metadata: {
      version: string;
      timestamp: string;
      submitter: string;
    };
    vulnerability: {
      title: string;
      description: string;
      impact: string;
      reproduction: string[];
      mitigation: string;
    };
    evidence: {
      screenshots: string[];
      logs: string[];
      proofOfConcept: string;
      toolOutputs: any[];
    };
  }
  ```

- **Upload Strategy**: Pin important content, use temporary pins for drafts
- **Retrieval**: Implement fallback mechanisms for unavailable content
- **Validation**: Verify content integrity using hashes

## Caching Strategy
- **Browser Cache**: Cache static assets and API responses appropriately
- **Service Worker**: Implement for offline functionality
- **CDN**: Use CDN for static assets and frequently accessed data
- **Database**: Cache blockchain data in local database for performance

## Search and Filtering
- **Full-text Search**: Implement search across vulnerability descriptions
- **Faceted Search**: Filter by severity, category, status, date ranges
- **Sorting**: Support multiple sorting criteria
- **Pagination**: Implement efficient pagination for large datasets

## Real-time Updates
- **WebSocket**: Real-time updates for vulnerability status changes
- **Server-Sent Events**: Push notifications for bounty updates
- **Blockchain Events**: Real-time blockchain event processing
- **UI Updates**: Smooth transitions for real-time data changes