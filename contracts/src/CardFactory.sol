// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact td2thinh@gmail.com
contract CardFactory is ERC721, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct Card {
        uint tokenId;      // token ID
        uint collectionId;  // collection ID
        string pokemonId;   // pokemon ID
        string imageUrl;    // image URL
    }

    // Mapping from token ID to card
    mapping(uint256 => Card) private _cards;
    mapping(string => uint256) private _pokemonIdToTokenId;
    
    constructor(address initialOwner)
        ERC721("Pokemon Card", "POCKET")
        Ownable(initialOwner)
    {}

    function getCard(uint256 tokenId) public view returns (Card memory) {
        return _cards[tokenId];
    }

    function getMultipleCards(uint256[] memory tokenIds) public view returns (Card[] memory) {
        Card[] memory cards = new Card[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            cards[i] = _cards[tokenIds[i]];
        }
        return cards;
    }

    function mintAndAssign(address to, uint256 collectionId, string memory pokemonId, string memory imageUrl)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _cards[tokenId] = Card(tokenId, collectionId, pokemonId, imageUrl);
        _pokemonIdToTokenId[pokemonId] = tokenId;
        return tokenId;
    }

    function mintAndAssignBatch(address to, uint256 collectionId, string[] memory pokemonIds, string[] memory imageUrls)
        public
        onlyOwner
        returns (uint256[] memory)
    {
        uint256[] memory tokenIds = new uint256[](pokemonIds.length);
        for (uint256 i = 0; i < pokemonIds.length; i++) {
            tokenIds[i] = _nextTokenId++;
            _mint(to, tokenIds[i]);
            _cards[tokenIds[i]] = Card(tokenIds[i], collectionId, pokemonIds[i], imageUrls[i]);
            _pokemonIdToTokenId[pokemonIds[i]] = tokenIds[i];
        }
        return tokenIds;
    }

    function burn(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
        delete _cards[tokenId];
    }

    function getOwnedCards(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory ownedTokens = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            ownedTokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return ownedTokens;
    }

    function getOwners(string[] memory pokemonIds) public view returns (address[] memory) {
        address[] memory owners = new address[](pokemonIds.length);
        for (uint256 i = 0; i < pokemonIds.length; i++) {
            owners[i] = ownerOf(_pokemonIdToTokenId[pokemonIds[i]]);
        }
        return owners;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}