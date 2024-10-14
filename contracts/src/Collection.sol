// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Card.sol";

contract Collection {
    string public collectionName;
    uint256 public cardCount;
    address public cardContract;
    uint256 public nextCardId;

    event CollectionCreated(string name, uint256 cardCount);
    event CardMinted(uint256 cardId);

    constructor(string memory _collectionName, uint256 _cardCount, address _cardContract) {
        collectionName = _collectionName;
        cardCount = _cardCount;
        cardContract = _cardContract; 
        emit CollectionCreated(_collectionName, _cardCount);
    }

    // Fonction pour mint une carte dans la collection
    function mintCard(string memory img) public {
        require(nextCardId < cardCount, "All cards have been minted");

        // Appeler le contrat Card pour mint une nouvelle carte
        Card card = Card(cardContract);
        uint256 cardId = card.mintCard(msg.sender, img); // Mint une carte NFT avec l'URL de l'image

        emit CardMinted(cardId);
        nextCardId++;
    }

    // Get Card by id
    function getCard(uint256 cardId) public view returns (string memory) {
        Card card = Card(cardContract);
        return card.tokenURI(cardId);
    }
}