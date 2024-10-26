// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact td2thinh@gmail.com
contract CardFactory is ERC721, ERC721Enumerable, Ownable {
    uint256 public _nextTokenId;

    constructor(address initialOwner)
        ERC721("Pokemon Card", "POCKET")
        Ownable(initialOwner) 
    {
        _nextTokenId = 0;
    }

    struct Card {
        uint tokenId;      // token ID
        uint collectionId;  // collection ID
        string pokemonId;   // pokemon ID
    }

    // Mapping from token ID to card
    mapping(uint256 => Card) private _cards;

    function getDeployer() 
        public 
        view 
        returns (address) {
        return owner();
    }
    
    function getCard(uint256 tokenId) 
        public 
        view 
        returns (Card memory) {
        return _cards[tokenId];
    }
    /**
     * Get multiple cards by token IDs
     * @param tokenIds The list of token IDs
     */
    function getMultipleCards(uint256[] memory tokenIds) 
        public 
        view 
        returns (Card[] memory) {
        Card[] memory cards = new Card[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            cards[i] = _cards[tokenIds[i]];
        }
        return cards;
    }
    /**
     * Mint a card and assign it to an address
     * @param to  The address to mint the card to
     * @param collectionId The collection ID
     * @param pokemonId The pokemon ID
     */
    function mintAndAssign(address to, uint256 collectionId, string memory pokemonId)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        setApprovalForAll(address(this), true);
        _cards[tokenId] = Card(tokenId, collectionId, pokemonId);
        return tokenId;
    }
    /**
     * Mint a batch of cards and assign them to an address
     * @param to  The address to mint the cards to
     * @param collectionId The collection ID
     * @param pokemonIds The list of pokemon IDs
     */
    function mintAndAssignBatch(address to, uint256 collectionId, string[] memory pokemonIds)
        public
        returns (uint256[] memory)
    {
        uint256[] memory tokenIds = new uint256[](pokemonIds.length);
        for (uint256 i = 0; i < pokemonIds.length; i++) {
            tokenIds[i] = _nextTokenId++;
            _mint(to, tokenIds[i]);
            setApprovalForAll(address(this), true);
            _cards[tokenIds[i]] = Card(tokenIds[i], collectionId, pokemonIds[i]);
        }
        return tokenIds;
    }

    function burn(uint256 tokenId) 
        public 
        onlyOwner {
        _burn(tokenId);
        delete _cards[tokenId];
    }
    /**
     * Get all the cards owned by an address
     * @param owner  The address to query
     */
    function getOwnedCards(address owner) 
        public 
        view 
        returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory ownedTokens = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            ownedTokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return ownedTokens;
    }
    /**
     * Get the collection ID for a token
     * @param pokemonId  get all the token owners for a pokemon
     */
    function getOwners(string memory pokemonId) 
        public 
        view 
        returns (address[] memory) {
        uint count = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (keccak256(abi.encodePacked(_cards[i].pokemonId)) == keccak256(abi.encodePacked(pokemonId))) {
                count++;
            }
        }
        address[] memory owners = new address[](count);
        uint index = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (keccak256(abi.encodePacked(_cards[i].pokemonId)) == keccak256(abi.encodePacked(pokemonId))) {
                owners[index] = ownerOf(i);
                index++;
            }
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