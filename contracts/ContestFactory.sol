// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Contest.sol";

contract ContestFactory {
    address public immutable worldId;
    uint256 public immutable groupId;
    
    mapping(address => address[]) public organizerContests;
    address[] public allContests;
    
    event ContestCreated(address indexed contest, address indexed organizer, string title);
    
    constructor(address _worldId, uint256 _groupId) {
        worldId = _worldId;
        groupId = _groupId;
    }
    
    function createContest(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _creditsPerVoter,
        uint256 _maxProjects,
        bool _allowSelfSubmit
    ) external returns (address) {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");
        require(_startTime > block.timestamp, "Start time must be in future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_creditsPerVoter > 0, "Credits per voter must be positive");
        require(_maxProjects > 0, "Max projects must be positive");
        
        // Generate unique actionId for this contest
        uint256 actionId = uint256(keccak256(abi.encodePacked(
            _title,
            _description,
            _startTime,
            _endTime,
            block.timestamp,
            msg.sender
        )));
        
        Contest newContest = new Contest(
            worldId,
            groupId,
            actionId,
            _title,
            _description,
            _startTime,
            _endTime,
            _creditsPerVoter,
            _maxProjects,
            _allowSelfSubmit
        );
        
        newContest.transferOwnership(msg.sender);
        
        organizerContests[msg.sender].push(address(newContest));
        allContests.push(address(newContest));
        
        emit ContestCreated(address(newContest), msg.sender, _title);
        
        return address(newContest);
    }
    
    function getOrganizerContests(address organizer) external view returns (address[] memory) {
        return organizerContests[organizer];
    }
    
    function getAllContests() external view returns (address[] memory) {
        return allContests;
    }
    
    function getContestCount() external view returns (uint256) {
        return allContests.length;
    }
}
