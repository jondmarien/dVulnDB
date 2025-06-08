// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IBountyEscrow
 * @notice Interface for the BountyEscrow contract
 */
interface IBountyEscrow {

    enum EscrowStatus {
        DEPOSITED,
        RELEASED,
        REFUNDED,
        DISPUTED
    }

    function depositBounty(
        uint256 _vulnId,
        address _researcher
    ) external payable;

    function releaseBounty(uint256 _vulnId) external;

    function approveBountyRelease(uint256 _vulnId) external;

    function getEscrowDetails(uint256 _vulnId) 
        external 
        view 
        returns (
            address researcher,
            uint256 amount,
            uint256 depositTime,
            EscrowStatus status,
            uint256 approvalCount,
            bool isDisputed
        );

    function getTotalEscrowed() external view returns (uint256);

    function isApprover(address _address) external view returns (bool);
}