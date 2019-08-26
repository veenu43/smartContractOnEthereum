pragma solidity ^0.5.0;

contract Adoption {
    address[16] public adopters;
    mapping(address => uint) public amounts;
    uint public totalCollected;
    bool isStopped = false;

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
        require(msg.value==amount);
        require(petId >= 0 && petId <= 15);
        adopters[petId] = msg.sender;
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;
    }

     function release(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);
        delete adopters[petId];
        return petId;
    }

    function withdraw(address payable collectionAddress,address payable partnerAddress) payable public {
        require(totalCollected > 0x0);
        collectionAddress.transfer(totalCollected/2);
        partnerAddress.transfer(totalCollected/2);
        totalCollected =0x0;
    }


    function getAdopters() public view returns (address[16]memory) {
        return adopters;
    }
}