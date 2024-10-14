// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    uint private collectionCount;
    mapping(uint => Collection) private collections;

    event CollectionCreated(string name, uint256 cardCount);

    constructor() {
        collectionCount = 0;
    }

    // Fonction pour créer une nouvelle collection (seulement le propriétaire peut l'appeler)
    function createCollection(string calldata name, uint256 cardCount, address cardContract) external onlyOwner {
        Collection newCollection = new Collection(name, cardCount, cardContract);
        collections[collectionCount] = newCollection;
        emit CollectionCreated(name, cardCount);
        collectionCount++;
    }

    // Récupérer une collection par son index
    function getCollection(uint index) public view returns (Collection) {
        require(index >= 0 && index < collectionCount, "Invalid collection index");
        return collections[index];
    }
}