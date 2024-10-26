pragma solidity ^0.8.20;

import "./CardFactory.sol";

contract CollectionManager is CardFactory {
    uint256 private _nextCollectionId;
    struct Collection {
        uint collectionId;     // collection ID
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
    /**
     * Create a new collection
     * @param name   The name of the collection
     * @param imageUrl    The image URL of the collection
     * @param cardCount    The number of cards in the collection
     * @param pokemonIds    The list of pokemon IDs in the collection
     */
    function createCollection(string memory name, string memory imageUrl, uint256 cardCount, string[] memory pokemonIds) 
        public
        onlyOwner
        returns (uint256) {
        uint256 collectionId = _nextCollectionId++;
        collections[collectionId] = Collection(collectionId, name, imageUrl, pokemonIds, cardCount);
        emit CollectionCreated(name, cardCount);
        return collectionId;
    }
    /**
     * Get a collection by ID
     * @param collectionId   The ID of the collection to get
     */
    function getCollection(uint256 collectionId) 
        public 
        view 
        returns (uint, string memory, string memory, string[] memory, uint256) 
    {
        Collection memory collection = collections[collectionId];
        return (collection.collectionId, collection.name, collection.imageUrl, collection.pokemonIds, collection.cardCount);
    }
    /**
     * Get all collections
     */
    function getAllCollections() 
        public 
        view 
        returns (uint[] memory, string[] memory, string[] memory, string[][] memory, uint256[] memory)
    {
        uint count = 0;
        for (uint256 i = 0; i < _nextCollectionId; i++) {
            if (collections[i].cardCount > 0) {
                count++;
            }
        }
        uint[] memory collectionIds = new uint[](count);
        string[] memory names = new string[](count);
        string[] memory imageUrls = new string[](count);
        string[][] memory pokemonIds = new string[][](count);
        uint256[] memory cardCounts = new uint256[](count);
        uint index = 0;
        for (uint256 i = 0; i < _nextCollectionId; i++) {
            if (collections[i].cardCount > 0) {
                Collection memory collection = collections[i];
                collectionIds[index] = collection.collectionId;
                names[index] = collection.name;
                imageUrls[index] = collection.imageUrl;
                pokemonIds[index] = collection.pokemonIds;
                cardCounts[index] = collection.cardCount;
                index++;
            }
        }
        return (collectionIds, names, imageUrls, pokemonIds, cardCounts);
    }
}