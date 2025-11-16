// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IKYCRegistry {
    function isUserVerified(address _user) external view returns (bool);
    function admin() external view returns (address);
}

contract Crowdfunding_Maryam is ReentrancyGuard {
    
    // Campaign status enum
    enum CampaignStatus { Active, Completed, Withdrawn }
    
    // Campaign structure
    struct Campaign {
        uint256 id;
        string title;
        string description;
        address payable creator;
        uint256 goalAmount;
        uint256 fundsRaised;
        CampaignStatus status;
        uint256 createdAt;
        bool exists;
    }
    
    // Contribution structure
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }
    
    // KYC Registry contract reference
    IKYCRegistry public kycRegistry;
    
    // Campaign storage
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;
    
    // Campaign contributions
    mapping(uint256 => Contribution[]) public campaignContributions;
    
    // Track user contributions per campaign
    mapping(uint256 => mapping(address => uint256)) public userContributions;
    
    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        string title,
        address indexed creator,
        uint256 goalAmount
    );
    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );
    event CampaignCompleted(uint256 indexed campaignId);
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );
    
    // Modifiers
    modifier onlyVerifiedOrAdmin() {
        require(
            kycRegistry.isUserVerified(msg.sender) || 
            msg.sender == kycRegistry.admin(),
            "Only verified users or admin can create campaigns"
        );
        _;
    }
    
    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        _;
    }
    
    modifier onlyCampaignCreator(uint256 _campaignId) {
        require(
            campaigns[_campaignId].creator == msg.sender,
            "Only campaign creator can perform this action"
        );
        _;
    }
    
    constructor(address _kycRegistryAddress) {
        kycRegistry = IKYCRegistry(_kycRegistryAddress);
    }
    
    // Create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount
    ) public onlyVerifiedOrAdmin {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        
        campaignCount++;
        
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: _title,
            description: _description,
            creator: payable(msg.sender),
            goalAmount: _goalAmount,
            fundsRaised: 0,
            status: CampaignStatus.Active,
            createdAt: block.timestamp,
            exists: true
        });
        
        emit CampaignCreated(campaignCount, _title, msg.sender, _goalAmount);
    }
    
    // Contribute to a campaign
    function contribute(uint256 _campaignId) 
        public 
        payable 
        campaignExists(_campaignId) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.status == CampaignStatus.Active, "Campaign is not active");
        require(msg.value > 0, "Contribution must be greater than 0");
        require(
            campaign.fundsRaised + msg.value <= campaign.goalAmount,
            "Contribution exceeds goal amount"
        );
        
        // Update campaign funds
        campaign.fundsRaised += msg.value;
        
        // Record contribution
        campaignContributions[_campaignId].push(Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        // Track user contribution
        userContributions[_campaignId][msg.sender] += msg.value;
        
        emit ContributionMade(_campaignId, msg.sender, msg.value);
        
        // Check if goal is reached
        if (campaign.fundsRaised >= campaign.goalAmount) {
            campaign.status = CampaignStatus.Completed;
            emit CampaignCompleted(_campaignId);
        }
    }
    
    // Withdraw funds (only creator of completed campaign)
    function withdrawFunds(uint256 _campaignId)
        public
        campaignExists(_campaignId)
        onlyCampaignCreator(_campaignId)
        nonReentrant
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(
            campaign.status == CampaignStatus.Completed,
            "Campaign must be completed to withdraw"
        );
        
        uint256 amount = campaign.fundsRaised;
        require(amount > 0, "No funds to withdraw");
        
        // Update status before transfer (reentrancy protection)
        campaign.status = CampaignStatus.Withdrawn;
        
        // Transfer funds to creator
        (bool success, ) = campaign.creator.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(_campaignId, campaign.creator, amount);
    }
    
    // Get campaign details
    function getCampaign(uint256 _campaignId)
        public
        view
        campaignExists(_campaignId)
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address creator,
            uint256 goalAmount,
            uint256 fundsRaised,
            CampaignStatus status,
            uint256 createdAt
        )
    {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.id,
            campaign.title,
            campaign.description,
            campaign.creator,
            campaign.goalAmount,
            campaign.fundsRaised,
            campaign.status,
            campaign.createdAt
        );
    }
    
    // Get all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        
        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        
        return allCampaigns;
    }
    
    // Get campaign contributions
    function getCampaignContributions(uint256 _campaignId)
        public
        view
        campaignExists(_campaignId)
        returns (Contribution[] memory)
    {
        return campaignContributions[_campaignId];
    }
    
    // Get user contribution to a campaign
    function getUserContribution(uint256 _campaignId, address _user)
        public
        view
        returns (uint256)
    {
        return userContributions[_campaignId][_user];
    }
    
    // Get total campaigns count
    function getTotalCampaigns() public view returns (uint256) {
        return campaignCount;
    }
}