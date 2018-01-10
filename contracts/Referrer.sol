pragma solidity ^0.4.18;

contract Referrer {

    mapping(address => string) public locations;

    function refer(string _content) public {
        locations[msg.sender] = _content;
    }

}