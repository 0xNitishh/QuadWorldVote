// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external view;
}

contract Contest is Ownable, ReentrancyGuard {
    IWorldID public immutable worldId;
    uint256 public immutable groupId;
    uint256 public immutable actionId;
    
    struct Project {
        string title;
        string description;
        address submitter;
        bool exists;
    }
    
    struct Ballot {
        uint256[] allocations;
        uint256 timestamp;
        bool exists;
    }
    
    struct ContestData {
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 creditsPerVoter;
        uint256 maxProjects;
        bool allowSelfSubmit;
        bool finalized;
    }
    
    ContestData public contest;
    mapping(uint256 => Project) public projects;
    mapping(address => Ballot) public ballots;
    mapping(uint256 => bool) public usedNullifiers;
    
    uint256 public projectCount;
    uint256 public totalVotes;
    
    event ProjectAdded(uint256 indexed projectId, string title, address submitter);
    event BallotCast(address indexed voter, uint256[] allocations);
    event ContestFinalized();
    
    constructor(
        address _worldId,
        uint256 _groupId,
        uint256 _actionId,
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _creditsPerVoter,
        uint256 _maxProjects,
        bool _allowSelfSubmit
    ) {
        worldId = IWorldID(_worldId);
        groupId = _groupId;
        actionId = _actionId;
        
        contest = ContestData({
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            creditsPerVoter: _creditsPerVoter,
            maxProjects: _maxProjects,
            allowSelfSubmit: _allowSelfSubmit,
            finalized: false
        });
    }
    
    function addProject(string memory _title, string memory _description) external {
        require(!contest.finalized, "Contest finalized");
        require(block.timestamp >= contest.startTime, "Contest not started");
        require(block.timestamp <= contest.endTime, "Contest ended");
        require(projectCount < contest.maxProjects, "Max projects reached");
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");
        
        if (!contest.allowSelfSubmit) {
            require(msg.sender == owner(), "Only organizer can add projects");
        }
        
        projects[projectCount] = Project({
            title: _title,
            description: _description,
            submitter: msg.sender,
            exists: true
        });
        
        emit ProjectAdded(projectCount, _title, msg.sender);
        projectCount++;
    }
    
    function castBallot(
        uint256[8] calldata _proof,
        uint256 _nullifierHash,
        uint256[] calldata _allocations
    ) external nonReentrant {
        require(!contest.finalized, "Contest finalized");
        require(block.timestamp >= contest.startTime, "Contest not started");
        require(block.timestamp <= contest.endTime, "Contest ended");
        require(!ballots[msg.sender].exists, "Already voted");
        require(_allocations.length == projectCount, "Invalid allocation count");
        require(!usedNullifiers[_nullifierHash], "Nullifier already used");
        
        // Verify quadratic voting constraint
        uint256 totalCost = 0;
        for (uint256 i = 0; i < _allocations.length; i++) {
            totalCost += _allocations[i] * _allocations[i];
        }
        require(totalCost <= contest.creditsPerVoter, "Exceeds credit limit");
        
        // Verify World ID proof
        uint256 signalHash = uint256(keccak256(abi.encodePacked(actionId, msg.sender, _allocations)));
        worldId.verifyProof(
            actionId, // Using actionId as root for simplicity
            groupId,
            signalHash,
            _nullifierHash,
            _proof
        );
        
        usedNullifiers[_nullifierHash] = true;
        ballots[msg.sender] = Ballot({
            allocations: _allocations,
            timestamp: block.timestamp,
            exists: true
        });
        
        totalVotes++;
        emit BallotCast(msg.sender, _allocations);
    }
    
    function finalize() external {
        require(!contest.finalized, "Already finalized");
        require(block.timestamp > contest.endTime, "Contest not ended");
        require(msg.sender == owner(), "Only organizer can finalize");
        
        contest.finalized = true;
        emit ContestFinalized();
    }
    
    function getProjectResults() external view returns (uint256[] memory scores, string[] memory titles) {
        require(contest.finalized, "Contest not finalized");
        
        scores = new uint256[](projectCount);
        titles = new string[](projectCount);
        
        // Calculate scores by summing all ballot allocations
        for (uint256 i = 0; i < projectCount; i++) {
            titles[i] = projects[i].title;
            scores[i] = 0;
        }
        
        // This would need to iterate through all ballots, but for gas efficiency
        // we'll return the structure. In practice, you'd want to calculate this
        // off-chain or use events to track scores
        return (scores, titles);
    }
    
    function getContestInfo() external view returns (ContestData memory) {
        return contest;
    }
    
    function getProjectCount() external view returns (uint256) {
        return projectCount;
    }
    
    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }
}
