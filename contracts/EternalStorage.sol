pragma solidity ^0.5.0;

contract EternalStorage {
    address[16] public adopters;
    mapping(address => uint) public amounts;
    uint public totalCollected;
    bool isStopped = false;

    function stopContract(bool isStoppedValue) external  {
        isStopped = isStoppedValue;
    }

    function resumeContract(bool isStoppedValue) external  {
        isStopped = isStoppedValue;
    }

    function getContractStatus() external  view returns(bool){
        return isStopped;
    }

    function addPetID(address from, uint petId) public returns (bool success) {
        adopters[petId] = from;
        return true;
    }

    function removePetID(uint petId) public returns (bool success){
        delete adopters[petId];
        return true;
    }

    function getAdopters() public view returns (address[16]memory) {
        return adopters;
    }
}
