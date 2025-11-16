// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KYCRegistry_Maryam is Ownable {
    
    // Struct to store KYC information
    struct KYCRequest {
        address userAddress;
        string fullName;
        string cnic;
        bool isVerified;
        bool exists;
        uint256 timestamp;
    }
    
    // Mapping from address to KYC request
    mapping(address => KYCRequest) public kycRequests;
    
    // Array to keep track of all KYC requests
    address[] public allKYCRequests;
    
    // Events
    event KYCSubmitted(address indexed user, string fullName, string cnic);
    event KYCApproved(address indexed user, string fullName);
    event KYCRejected(address indexed user);
    
    modifier notVerified() {
        require(!kycRequests[msg.sender].isVerified, "Already verified");
        _;
    }
    
    constructor() {}
    
    // Submit KYC request
    function submitKYC(string memory _fullName, string memory _cnic) public notVerified {
        require(bytes(_fullName).length > 0, "Name cannot be empty");
        require(bytes(_cnic).length == 13, "CNIC must be 13 digits");
        require(!kycRequests[msg.sender].exists, "KYC request already submitted");
        
        kycRequests[msg.sender] = KYCRequest({
            userAddress: msg.sender,
            fullName: _fullName,
            cnic: _cnic,
            isVerified: false,
            exists: true,
            timestamp: block.timestamp
        });
        
        allKYCRequests.push(msg.sender);
        
        emit KYCSubmitted(msg.sender, _fullName, _cnic);
    }
    
    // Approve KYC request
    function approveKYC(address _user) public onlyOwner {
        require(kycRequests[_user].exists, "KYC request does not exist");
        require(!kycRequests[_user].isVerified, "Already verified");
        
        kycRequests[_user].isVerified = true;
        
        emit KYCApproved(_user, kycRequests[_user].fullName);
    }
    
    // Reject KYC request
    function rejectKYC(address _user) public onlyOwner {
        require(kycRequests[_user].exists, "KYC request does not exist");
        
        // Remove from mapping and array
        delete kycRequests[_user];
        
        // Remove from array
        for (uint256 i = 0; i < allKYCRequests.length; i++) {
            if (allKYCRequests[i] == _user) {
                allKYCRequests[i] = allKYCRequests[allKYCRequests.length - 1];
                allKYCRequests.pop();
                break;
            }
        }
        
        emit KYCRejected(_user);
    }
    
    // Check if user is verified
    function isUserVerified(address _user) public view returns (bool) {
        return kycRequests[_user].isVerified;
    }
    
    // Get KYC details
    function getKYCDetails(address _user) public view returns (
        string memory fullName,
        string memory cnic,
        bool isVerified,
        bool exists,
        uint256 timestamp
    ) {
        KYCRequest memory kyc = kycRequests[_user];
        return (kyc.fullName, kyc.cnic, kyc.isVerified, kyc.exists, kyc.timestamp);
    }
    
    // Get all pending KYC requests
    function getAllKYCRequests() public view returns (address[] memory) {
        return allKYCRequests;
    }
    
    // Get total KYC requests count
    function getTotalKYCRequests() public view returns (uint256) {
        return allKYCRequests.length;
    }

    // Backwards-compatible admin getter for existing interfaces
    // Returns the contract owner (to maintain compatibility with IKYCRegistry.admin())
    function admin() public view returns (address) {
        return owner();
    }
}