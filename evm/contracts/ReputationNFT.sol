// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ReputationNFT
 * @notice ERC-721 based reputation system for security researchers
 * @dev Dynamic NFT metadata based on researcher performance
 * @author Jon - ISSessions Cybersecurity Club
 */
abstract contract ReputationNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    // Reputation levels
    enum ReputationLevel {
        NOVICE,      // 0-100 points
        RESEARCHER,  // 101-500 points
        EXPERT,      // 501-1500 points
        ELITE,       // 1501-5000 points
        LEGENDARY    // 5000+ points
    }

    struct ResearcherNFT {
        uint256 reputationScore;
        uint256 vulnerabilitiesFound;
        uint256 totalEarnings;
        uint256 lastUpdate;
        ReputationLevel level;
        string[] specializations; // Web, Mobile, Smart Contract, etc.
        uint256[] criticalFinds; // Critical vulnerability IDs
    }

    // State variables
    address public vulnerabilityRegistry;
    mapping(uint256 => ResearcherNFT) public researcherData;
    mapping(address => uint256) public researcherToTokenId;
    mapping(ReputationLevel => string) public levelNames;
    mapping(ReputationLevel => string) public levelColors;

    // Events
    event ReputationUpdated(
        uint256 indexed tokenId,
        address indexed researcher,
        uint256 newScore,
        ReputationLevel newLevel
    );

    event SpecializationAdded(
        uint256 indexed tokenId,
        string specialization
    );

    event CriticalFindRecorded(
        uint256 indexed tokenId,
        uint256 vulnerabilityId
    );

    modifier onlyRegistry() {
        require(msg.sender == vulnerabilityRegistry, "Only registry contract");
        _;
    }

    constructor() ERC721("SecurityResearcher", "SECR") {
        _transferOwnership(msg.sender);
        _initializeLevels();
    }

    function _initializeLevels() internal {
        levelNames[ReputationLevel.NOVICE] = "Novice";
        levelNames[ReputationLevel.RESEARCHER] = "Researcher";
        levelNames[ReputationLevel.EXPERT] = "Expert";
        levelNames[ReputationLevel.ELITE] = "Elite";
        levelNames[ReputationLevel.LEGENDARY] = "Legendary";

        levelColors[ReputationLevel.NOVICE] = "#8B9DC3";     // Blue
        levelColors[ReputationLevel.RESEARCHER] = "#16A085"; // Green
        levelColors[ReputationLevel.EXPERT] = "#F39C12";     // Orange
        levelColors[ReputationLevel.ELITE] = "#8E44AD";      // Purple
        levelColors[ReputationLevel.LEGENDARY] = "#E74C3C";  // Red
    }

    /**
     * @notice Mint reputation NFT for new researcher
     */
    function mintReputationNFT(address _researcher) 
        public 
        onlyRegistry 
        returns (uint256) 
    {
        require(researcherToTokenId[_researcher] == 0, "NFT already exists");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(_researcher, newTokenId);

        // Initialize researcher data
        ResearcherNFT storage data = researcherData[newTokenId];
        data.reputationScore = 0;
        data.vulnerabilitiesFound = 0;
        data.totalEarnings = 0;
        data.lastUpdate = block.timestamp;
        data.level = ReputationLevel.NOVICE;

        researcherToTokenId[_researcher] = newTokenId;

        _setTokenURI(newTokenId, _generateTokenURI(newTokenId));

        return newTokenId;
    }

    /**
     * @notice Update reputation score and metadata
     */
    function updateReputation(
        address _researcher,
        uint256 _scoreIncrease,
        uint256 _earnings,
        bool _isCritical,
        uint256 _vulnerabilityId
    ) external onlyRegistry {
        uint256 tokenId = researcherToTokenId[_researcher];

        // Mint NFT if doesn't exist
        if (tokenId == 0) {
            tokenId = mintReputationNFT(_researcher);
        }

        ResearcherNFT storage data = researcherData[tokenId];

        // Update stats
        data.reputationScore += _scoreIncrease;
        data.vulnerabilitiesFound += 1;
        data.totalEarnings += _earnings;
        data.lastUpdate = block.timestamp;

        // Record critical finds
        if (_isCritical) {
            data.criticalFinds.push(_vulnerabilityId);
            emit CriticalFindRecorded(tokenId, _vulnerabilityId);
        }

        // Update level
        ReputationLevel newLevel = _calculateLevel(data.reputationScore);
        if (newLevel != data.level) {
            data.level = newLevel;
        }

        // Update NFT metadata
        _setTokenURI(tokenId, _generateTokenURI(tokenId));

        emit ReputationUpdated(tokenId, _researcher, data.reputationScore, newLevel);
    }

    /**
     * @notice Add specialization to researcher
     */
    function addSpecialization(
        address _researcher,
        string calldata _specialization
    ) external onlyRegistry {
        uint256 tokenId = researcherToTokenId[_researcher];
        require(tokenId > 0, "NFT does not exist");

        researcherData[tokenId].specializations.push(_specialization);

        // Update NFT metadata
        _setTokenURI(tokenId, _generateTokenURI(tokenId));

        emit SpecializationAdded(tokenId, _specialization);
    }

    /**
     * @notice Calculate reputation level based on score
     */
    function _calculateLevel(uint256 _score) internal pure returns (ReputationLevel) {
        if (_score >= 5000) return ReputationLevel.LEGENDARY;
        if (_score >= 1501) return ReputationLevel.ELITE;
        if (_score >= 501) return ReputationLevel.EXPERT;
        if (_score >= 101) return ReputationLevel.RESEARCHER;
        return ReputationLevel.NOVICE;
    }

    /**
     * @notice Generate dynamic NFT metadata
     */
    function _generateTokenURI(uint256 _tokenId) internal view returns (string memory) {
        ResearcherNFT storage data = researcherData[_tokenId];

        string memory svg = _generateSVG(_tokenId);

        bytes memory json = abi.encodePacked(
            '{"name": "Security Researcher #', _tokenId.toString(),
            '", "description": "Decentralized Vulnerability Database Reputation NFT",',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)),
            '", "attributes": [',
            '{"trait_type": "Level", "value": "', levelNames[data.level], '"},',
            '{"trait_type": "Reputation Score", "value": ', data.reputationScore.toString(), '},',
            '{"trait_type": "Vulnerabilities Found", "value": ', data.vulnerabilitiesFound.toString(), '},',
            '{"trait_type": "Critical Finds", "value": ', data.criticalFinds.length.toString(), '},',
            '{"trait_type": "Total Earnings", "value": ', data.totalEarnings.toString(), '}',
            ']}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(json)
            )
        );
    }

    /**
     * @notice Generate SVG image for NFT
     */
    function _generateSVG(uint256 _tokenId) internal view returns (string memory) {
        ResearcherNFT storage data = researcherData[_tokenId];
        string memory levelColor = levelColors[data.level];
        string memory levelName = levelNames[data.level];

        return string(
            abi.encodePacked(
                '<svg width="350" height="350" viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">',
                '<defs>',
                '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
                '<stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />',
                '<stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />',
                '</linearGradient>',
                '</defs>',
                '<rect width="350" height="350" fill="url(#bg)" />',
                '<circle cx="175" cy="120" r="60" fill="', levelColor, '" opacity="0.8" />',
                '<text x="175" y="130" text-anchor="middle" fill="white" font-size="24" font-weight="bold">',
                unicode"🛡️",
                '</text>',
                '<text x="175" y="200" text-anchor="middle" fill="white" font-size="18" font-weight="bold">',
                levelName,
                '</text>',
                '<text x="175" y="230" text-anchor="middle" fill="#cccccc" font-size="14">',
                'Score: ', data.reputationScore.toString(),
                '</text>',
                '<text x="175" y="250" text-anchor="middle" fill="#cccccc" font-size="14">',
                'Vulns: ', data.vulnerabilitiesFound.toString(),
                '</text>',
                '<text x="175" y="270" text-anchor="middle" fill="#cccccc" font-size="14">',
                'Critical: ', data.criticalFinds.length.toString(),
                '</text>',
                '<text x="175" y="320" text-anchor="middle" fill="#888888" font-size="12">',
                'Security Researcher #', _tokenId.toString(),
                '</text>',
                '</svg>'
            )
        );
    }

    /**
     * @notice Get researcher NFT data
     */
    function getResearcherData(uint256 _tokenId) 
        external 
        view 
        returns (ResearcherNFT memory) 
    {
        return researcherData[_tokenId];
    }

    /**
     * @notice Get token ID for researcher address
     */
    function getTokenIdByAddress(address _researcher) 
        external 
        view 
        returns (uint256) 
    {
        return researcherToTokenId[_researcher];
    }

    /**
     * @notice Set vulnerability registry address
     */
    function setVulnerabilityRegistry(address _registry) external onlyOwner {
        require(_registry != address(0), "Invalid registry address");
        vulnerabilityRegistry = _registry;
    }

    /**
     * @notice Override required by Solidity
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Soulbound: prevent transfers
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Soulbound: Transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}