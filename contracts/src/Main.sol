pragma solidity ^0.8.20;
import "./Collection.sol";
import "hardhat/console.sol";

contract Main {
    uint256 private _nextTokenId;

    constructor () {
        _nextTokenId = 0;
    }

    mapping(uint256 => Collection) private collections;
    
    event CollectionCreated(string name, uint256 cardCount);

    function createCollection(string memory name, uint256 cardCount) external payable  {
        Collection collection = new Collection(name, cardCount);
        console.log("Collection created with name: %s and cardCount: %s", name, cardCount);
        collections[_nextTokenId++] = collection;
        emit CollectionCreated(name, cardCount);
    }

    function getCollection(uint256 tokenId) public view returns (Collection) {
        return collections[tokenId];
    }
    receive() external payable {} // to support receiving ETH by default
    fallback() external payable {}
}