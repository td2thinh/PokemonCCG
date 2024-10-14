// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";

contract Main {
    int private collectionCount;
    mapping(int => Collection) private collections;

    event CollectionCreated(string name, uint256 cardCount);

    constructor() {
        collectionCount = 0;
    }

    function createCollection(string calldata name, uint256 cardCount) external {
        collections[collectionCount] = new Collection(name, cardCount);
        emit CollectionCreated(name, cardCount);
        collectionCount++;
    }

    function getCollection(int index) public view returns (Collection) {
        require(index >= 0 && index < collectionCount, "Invalid collection index");
        return collections[index];
    }
}