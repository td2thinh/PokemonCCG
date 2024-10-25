pragma solidity ^0.8.20;

import "./CardFactory.sol";

contract CollectionManager is CardFactory {
    uint256 private _nextCollectionId;
    struct Collection {
        string name;            // collection name
        string imageUrl;        // image URL
        string[] pokemonIds;    // list of pokemon IDs
        uint256 cardCount;  // number of cards in the collection
    }

    constructor(address initialOwner) CardFactory(initialOwner) {
        _nextCollectionId = 0;
    }

    // Events
    event CardsUnpacked(string[] pokemonIds);

    // Mapping from collection ID to collection
    mapping(uint256 => Collection) public collections;

    // Events
    event CollectionCreated(string name, uint256 cardCount);

    function createCollection(string memory name, string memory imageUrl, uint256 cardCount, string[] memory pokemonIds) 
        public
        onlyOwner
        returns (uint256) {
        uint256 collectionId = _nextCollectionId++;
        collections[collectionId] = Collection(name, imageUrl, pokemonIds, cardCount);
        emit CollectionCreated(name, cardCount);
        return collectionId;
    }

    function getCollection(uint256 collectionId) 
        public 
        view 
        returns (Collection memory) 
    {
        return collections[collectionId];
    }

    function getAllCollections() 
        public 
        view 
        returns (Collection[] memory) 
    {
        Collection[] memory result = new Collection[](_nextCollectionId);
        for (uint256 i = 0; i < _nextCollectionId; i++) {
            result[i] = collections[i];
        }
        return result;
    }

}