pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract BoosterFactory is ERC721, ERC721Enumerable, Ownable, ERC721Burnable  {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("Pokemon Booster", "BOOSTER")
        Ownable(initialOwner)  
    {
        _nextTokenId = 0;
    }

    struct Booster {
        uint tokenId;      // token ID
        uint collectionId;  // collection ID
        string name;
        string[] pokemonIds;
        uint pokemonCount;
        string imageUrl;    // image URL 
        uint256 price; // price in wei
    }

    mapping(uint256 => Booster) public _boosters; 

    function getBooster(uint256 tokenId) 
        public 
        view 
        returns (Booster memory) {
        return _boosters[tokenId];
    }

    function getMultipleBoosters(uint256[] memory tokenIds) 
        public 
        view 
        returns (Booster[] memory) {
        Booster[] memory boosters = new Booster[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            boosters[i] = _boosters[tokenIds[i]];
        }
        return boosters;
    }

    function getAllBoosters() 
        public 
        view 
        returns (Booster[] memory) {
        uint count = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_boosters[i].pokemonCount > 0) {
                count++;
            }
        }
        Booster[] memory result = new Booster[](count);
        uint index = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_boosters[i].pokemonCount > 0) {
                result[index] = _boosters[i];
                index++;
            }
        }
        return result;
    }
    
    function getOwnedBoosters(address owner) 
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

    function createBooster(string memory name, string memory imageUrl, uint256 collectionId, string[] memory pokemonIds, uint pokemonCount, uint256 price)
        public  
        onlyOwner 
        returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _boosters[tokenId] = Booster(tokenId, collectionId, name, pickRandomIds(pokemonIds, pokemonCount), pokemonCount, imageUrl, price);
        _mint(owner(), tokenId);
        return tokenId;
    }

    
    function pickRandomIds(string[] memory allIds, uint n) 
        private 
        view 
        returns (string[] memory)
    {
        string[] memory result = new string[](n);
        for (uint i = 0; i < n; i++) {
            uint index = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,_nextTokenId))) % allIds.length;
            result[i] = allIds[index];
        }
        return result;
    }

    function buyBooster(uint256 tokenId, address to)
        public 
        payable {
        require(msg.value == _boosters[tokenId].price, "BoosterFactory: invalid price");
        address payable owner = payable(address(this));
        owner.transfer(msg.value);
        approve(to, tokenId);
        _transfer(ownerOf(tokenId), to, tokenId);
    }
    
    function burn (uint256 tokenId) 
        public
        override(ERC721Burnable)
    {
        _burn(tokenId);
        delete _boosters[tokenId];
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

    receive() external payable {} // to support receiving ETH by default
    fallback() external payable {}

}