pragma solidity ^0.8.20;

import "./CardFactory.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is CardFactory {
    uint256 private _nextCollectionId;
    
    constructor()
        CardFactory(msg.sender)
    {
        _nextCollectionId = 0;
    }
    
    struct Collection {
        uint256 collectionId;   // collection ID
        string name;            // collection name
        string[] pokemonIds;    // list of pokemon IDs
        uint256 cardCount;  // number of cards in the collection
    }

    // Mapping from collection ID to collection
    mapping(uint256 => Collection) private collections;

    // Events
    event CollectionCreated(string name, uint256 cardCount);

    function createCollection(string memory name, uint256 cardCount, string[] memory pokemonIds) public onlyOwner returns (uint256) {
        uint256 collectionId = _nextCollectionId++;
        collections[collectionId] = Collection(collectionId, name, pokemonIds, cardCount);
        emit CollectionCreated(name, cardCount);
        return collectionId;
    }

    function getAllCollections() public view returns (Collection[] memory) {
        Collection[] memory result = new Collection[](_nextCollectionId);
        for (uint256 i = 0; i < _nextCollectionId; i++) {
            result[i] = collections[i];
        }
        return result;
    }

    function getCollection(uint256 collectionId) public view returns (Collection memory) {
        return collections[collectionId];
    }
    
    receive() external payable {} // to support receiving ETH by default
    fallback() external payable {}
}