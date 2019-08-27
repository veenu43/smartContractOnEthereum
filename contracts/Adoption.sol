pragma solidity ^0.5.0;

import "./EternalStorage.sol";


contract Adoption {
    mapping(address => uint) public amounts;
    uint public totalCollected;
    bool isStopped = false;

    EternalStorage private _storage;

    constructor() public{
        _storage = new EternalStorage();
    }

    function isContractStopped() public returns (bool){
        return isStopped;
    }

    modifier stoppedInEmergency {
        require(!isStopped);
       _;
    }

    modifier onlyAuthorized {
        // Check for authorization of msg.sender here
       _;
    }

    function stopContract() public onlyAuthorized {
        isStopped = true;
    }

    function resumeContract() public onlyAuthorized {
        isStopped = false;
    }

    function adopt(uint petId,uint256 amount) payable public stoppedInEmergency {
        require(msg.value != 0, 'invalid amount');
        require(petId >= 0 && petId <= 15);
        _storage.addPetID(msg.sender, petId);
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;
    }

     function release(uint petId) public stoppedInEmergency returns (uint) {
        require(petId >= 0 && petId <= 15);
         _storage.removePetID(petId);
        return petId;
    }

    function withdraw(address payable collectionAddress,address payable partnerAddress) payable public {
        require(totalCollected > 0x0);
        collectionAddress.transfer(totalCollected/2);
        partnerAddress.transfer(totalCollected/2);
        totalCollected =0x0;
    }


    function getAdopters() public view returns (address[16]memory) {
        return _storage.getAdopters();
    }
}