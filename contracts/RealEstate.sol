pragma solidity ^0.4.23;

contract RealEstate {
 struct Buyer {
     address buyerAddress;
     bytes32 email;
 }

 mapping (uint => Buyer) public buyerInfo;
 address public owner;
 address[100] public buyers;

event LogBuyRealEstate(
    address _buyer,
    uint _id
);

 constructor () public { owner = msg.sender; }

 function buyRealEstate(uint _id, bytes32 _email, bytes32 _passwd) public payable {
    //require(_id >= 0 && _id <= 9999);
    buyers[_id] = msg.sender;
    buyerInfo[_id] = Buyer(msg.sender, _email);

    owner.transfer(msg.value);
    emit LogBuyRealEstate(msg.sender, _id);
 }
    function getBuyerInfo(uint _id) public view returns (address, bytes32){
        Buyer memory buyer = buyerInfo[_id];
        return (buyer.buyerAddress, buyer.email);
    }
    function getAllBuyers() public view returns (address[100]){
        return buyers;
    }
}
