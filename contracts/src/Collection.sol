pragma solidity ^0.8;

contract Collection {
  string public name;
  uint public cardCount;

  constructor(string memory _name, uint _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }
}