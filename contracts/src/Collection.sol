// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Collection is ERC721URIStorage {
    using Counters for Counters.Counter;
    
    struct CardMetadata {
        uint256 cardId;
        string img;
    }

    string public collectionName;
    uint256 public cardCount;
    Counters.Counter private _tokenIdCounter;

    event CardMinted(uint256 cardId, string img);

    constructor(string memory _collectionName, uint256 _cardCount) ERC721("CollectibleCard", "CCARD") {
        collectionName = _collectionName;
        cardCount = _cardCount;
    }

    function mintCard(string memory img) public {
        require(_tokenIdCounter.current() < cardCount, "All cards have been minted");

        _tokenIdCounter.increment();
        uint256 cardId = _tokenIdCounter.current();

        _mint(msg.sender, cardId);
        _setTokenURI(cardId, img); 

        emit CardMinted(cardId, img);
    }
}