// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IBountyEscrow.sol";

/**
 * @title BountyEscrow
 * @notice Secure escrow system for vulnerability bounty payments
 * @dev Multi-signature validation with time-locked releases
 * @author Jon - ISSessions Cybersecurity Club
 */
contract BountyEscrow is ReentrancyGuard, Ownable, Pausable, IBountyEscrow {

    struct EscrowRecord {
        uint256 vulnId;
        address researcher;
        uint256 amount;
        uint256 depositTime;
        EscrowStatus status;
        uint256 releaseTime;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    // State variables
    address public vulnerabilityRegistry;
    uint256 public constant APPROVAL_THRESHOLD = 2; // Multi-sig threshold
    uint256 public constant DISPUTE_PERIOD = 7 days;
    uint256 public totalEscrowed;

    // Mappings
    mapping(uint256 => EscrowRecord) public escrows;
    mapping(address => bool) public approvers;
    mapping(uint256 => bool) public disputed;

    // Events
    event BountyDeposited(uint256 indexed vulnId, address indexed researcher, uint256 amount);
    event BountyReleased(uint256 indexed vulnId, address indexed researcher, uint256 amount);
    event BountyRefunded(uint256 indexed vulnId, address indexed researcher, uint256 amount);
    event DisputeRaised(uint256 indexed vulnId, address indexed disputer);
    event DisputeResolved(uint256 indexed vulnId, bool approved);
    event ApproverAdded(address indexed approver);
    event ApproverRemoved(address indexed approver);

    // Modifiers
    modifier onlyRegistry() {
        require(msg.sender == vulnerabilityRegistry, "Only registry contract");
        _;
    }

    modifier onlyApprover() {
        require(approvers[msg.sender], "Not authorized approver");
        _;
    }

    modifier validEscrow(uint256 _vulnId) {
        require(escrows[_vulnId].amount > 0, "Escrow does not exist");
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);
        approvers[msg.sender] = true; // Owner is default approver
    }

    /**
     * @notice Deposit bounty funds for a vulnerability
     * @param _vulnId Vulnerability ID
     * @param _researcher Researcher address
     */
    function depositBounty(
        uint256 _vulnId,
        address _researcher
    ) external payable onlyRegistry nonReentrant whenNotPaused {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_researcher != address(0), "Invalid researcher address");
        require(escrows[_vulnId].amount == 0, "Escrow already exists");

        EscrowRecord storage escrow = escrows[_vulnId];
        escrow.vulnId = _vulnId;
        escrow.researcher = _researcher;
        escrow.amount = msg.value;
        escrow.depositTime = block.timestamp;
        escrow.status = EscrowStatus.DEPOSITED;

        totalEscrowed += msg.value;

        emit BountyDeposited(_vulnId, _researcher, msg.value);
    }

    /**
     * @notice Release bounty to researcher after validation
     * @param _vulnId Vulnerability ID
     */
    function releaseBounty(uint256 _vulnId) 
        external 
        onlyRegistry 
        validEscrow(_vulnId) 
        nonReentrant 
    {
        EscrowRecord storage escrow = escrows[_vulnId];
        require(escrow.status == EscrowStatus.DEPOSITED, "Invalid escrow status");
        require(!disputed[_vulnId], "Escrow is disputed");

        escrow.status = EscrowStatus.RELEASED;
        escrow.releaseTime = block.timestamp;

        uint256 amount = escrow.amount;
        totalEscrowed -= amount;

        // Transfer funds to researcher
        (bool success, ) = payable(escrow.researcher).call{value: amount}("");
        require(success, "Transfer failed");

        emit BountyReleased(_vulnId, escrow.researcher, amount);
    }

    /**
     * @notice Approve bounty release (multi-sig)
     * @param _vulnId Vulnerability ID
     */
    function approveBountyRelease(uint256 _vulnId) 
        external 
        onlyApprover 
        validEscrow(_vulnId) 
        nonReentrant 
    {
        EscrowRecord storage escrow = escrows[_vulnId];
        require(escrow.status == EscrowStatus.DEPOSITED, "Invalid escrow status");
        require(!escrow.approvals[msg.sender], "Already approved");
        require(!disputed[_vulnId], "Escrow is disputed");

        escrow.approvals[msg.sender] = true;
        escrow.approvalCount++;

        // Auto-release if threshold reached
        if (escrow.approvalCount >= APPROVAL_THRESHOLD) {
            _executeRelease(_vulnId);
        }
    }

    /**
     * @notice Internal function to execute bounty release
     */
    function _executeRelease(uint256 _vulnId) internal {
        EscrowRecord storage escrow = escrows[_vulnId];
        escrow.status = EscrowStatus.RELEASED;
        escrow.releaseTime = block.timestamp;

        uint256 amount = escrow.amount;
        totalEscrowed -= amount;

        // Transfer funds to researcher
        (bool success, ) = payable(escrow.researcher).call{value: amount}("");
        require(success, "Transfer failed");

        emit BountyReleased(_vulnId, escrow.researcher, amount);
    }

    /**
     * @notice Raise dispute for bounty payment
     * @param _vulnId Vulnerability ID
     */
    function raiseDispute(uint256 _vulnId) 
        external 
        onlyApprover 
        validEscrow(_vulnId) 
    {
        require(!disputed[_vulnId], "Already disputed");
        require(escrows[_vulnId].status == EscrowStatus.DEPOSITED, "Invalid status");

        disputed[_vulnId] = true;
        emit DisputeRaised(_vulnId, msg.sender);
    }

    /**
     * @notice Resolve dispute
     * @param _vulnId Vulnerability ID
     * @param _approve Whether to approve or refund
     */
    function resolveDispute(
        uint256 _vulnId,
        bool _approve
    ) external onlyOwner validEscrow(_vulnId) nonReentrant {
        require(disputed[_vulnId], "No active dispute");

        disputed[_vulnId] = false;

        if (_approve) {
            _executeRelease(_vulnId);
        } else {
            _executeRefund(_vulnId);
        }

        emit DisputeResolved(_vulnId, _approve);
    }

    /**
     * @notice Refund bounty to original depositor
     */
    function _executeRefund(uint256 _vulnId) internal {
        EscrowRecord storage escrow = escrows[_vulnId];
        escrow.status = EscrowStatus.REFUNDED;

        uint256 amount = escrow.amount;
        totalEscrowed -= amount;

        // Refund to registry contract (which can forward to original depositor)
        (bool success, ) = payable(vulnerabilityRegistry).call{value: amount}("");
        require(success, "Refund failed");

        emit BountyRefunded(_vulnId, escrow.researcher, amount);
    }

    /**
     * @notice Emergency refund after timeout
     * @param _vulnId Vulnerability ID
     */
    function emergencyRefund(uint256 _vulnId) 
        external 
        validEscrow(_vulnId) 
        nonReentrant 
    {
        EscrowRecord storage escrow = escrows[_vulnId];
        require(escrow.status == EscrowStatus.DEPOSITED, "Invalid status");
        require(
            block.timestamp >= escrow.depositTime + 180 days,
            "Timeout not reached"
        );
        require(
            msg.sender == escrow.researcher || msg.sender == owner(),
            "Not authorized"
        );

        _executeRefund(_vulnId);
    }

    /**
     * @notice Get escrow details
     */
    function getEscrowDetails(uint256 _vulnId) 
        external 
        view 
        validEscrow(_vulnId) 
        returns (
            address researcher,
            uint256 amount,
            uint256 depositTime,
            EscrowStatus status,
            uint256 approvalCount,
            bool isDisputed
        ) 
    {
        EscrowRecord storage escrow = escrows[_vulnId];
        return (
            escrow.researcher,
            escrow.amount,
            escrow.depositTime,
            escrow.status,
            escrow.approvalCount,
            disputed[_vulnId]
        );
    }

    /**
     * @notice Add approver
     */
    function addApprover(address _approver) external onlyOwner {
        require(_approver != address(0), "Invalid approver address");
        approvers[_approver] = true;
        emit ApproverAdded(_approver);
    }

    /**
     * @notice Remove approver
     */
    function removeApprover(address _approver) external onlyOwner {
        approvers[_approver] = false;
        emit ApproverRemoved(_approver);
    }

    /**
     * @notice Set vulnerability registry address
     */
    function setVulnerabilityRegistry(address _registry) external onlyOwner {
        require(_registry != address(0), "Invalid registry address");
        vulnerabilityRegistry = _registry;
    }

    /**
     * @notice Check if address is approver
     */
    function isApprover(address _address) external view returns (bool) {
        return approvers[_address];
    }

    /**
     * @notice Get total funds in escrow
     */
    function getTotalEscrowed() external view returns (uint256) {
        return totalEscrowed;
    }

    /**
     * @notice Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdrawal (owner only, paused contract)
     */
    function emergencyWithdraw() external onlyOwner whenPaused {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}