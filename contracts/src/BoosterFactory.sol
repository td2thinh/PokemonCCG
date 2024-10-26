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
        returns (uint, uint, string memory, string[] memory, uint, string memory, uint256)
    {
        Booster memory booster = _boosters[tokenId];
        return (booster.tokenId, booster.collectionId, booster.name, booster.pokemonIds, booster.pokemonCount, booster.imageUrl, booster.price);
    }
    /**
     * Get multiple boosters by token IDs
     * @param tokenIds The list of token IDs
     */
    function getMultipleBoosters(uint256[] memory tokenIds) 
        public 
        view 
        returns (uint[] memory, uint[] memory, string[] memory, string[][] memory, uint[] memory, string[] memory, uint256[] memory)
    {
        uint count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_boosters[tokenIds[i]].pokemonCount > 0) {
                count++;
            }
        }
        uint[] memory tokenIdsResult = new uint[](count);
        uint[] memory collectionIds = new uint[](count);
        string[] memory names = new string[](count);
        string[] memory imageUrls = new string[](count);
        string[][] memory pokemonIds = new string[][](count);
        uint[] memory pokemonCounts = new uint[](count);
        uint256[] memory prices = new uint256[](count);
        uint j = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_boosters[tokenIds[i]].pokemonCount > 0) {
                tokenIdsResult[j] = _boosters[tokenIds[i]].tokenId;
                collectionIds[j] = _boosters[tokenIds[i]].collectionId;
                names[j] = _boosters[tokenIds[i]].name;
                imageUrls[j] = _boosters[tokenIds[i]].imageUrl;
                pokemonIds[j] = _boosters[tokenIds[i]].pokemonIds;
                pokemonCounts[j] = _boosters[tokenIds[i]].pokemonCount;
                prices[j] = _boosters[tokenIds[i]].price;
                j++;
            }
        }
        return (tokenIdsResult, collectionIds, names, pokemonIds, pokemonCounts, imageUrls, prices);
    }
    /**
     * Get all boosters
     */
    function getAllBoosters() 
        public 
        view 
        returns (uint[] memory, uint[] memory, string[] memory, string[][] memory, uint[] memory, string[] memory, uint256[] memory)
    {
        uint count = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_boosters[i].pokemonCount > 0) {
                count++;
            }
        }
        uint[] memory tokenIds = new uint[](count);
        uint[] memory collectionIds = new uint[](count);
        string[] memory names = new string[](count);
        string[] memory imageUrls = new string[](count);
        string[][] memory pokemonIds = new string[][](count);
        uint[] memory pokemonCounts = new uint[](count);
        uint256[] memory prices = new uint256[](count);
        uint j = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_boosters[i].pokemonCount > 0) {
                tokenIds[j] = _boosters[i].tokenId;
                collectionIds[j] = _boosters[i].collectionId;
                names[j] = _boosters[i].name;
                imageUrls[j] = _boosters[i].imageUrl;
                pokemonIds[j] = _boosters[i].pokemonIds;
                pokemonCounts[j] = _boosters[i].pokemonCount;
                prices[j] = _boosters[i].price;
                j++;
            }
        }
        return (tokenIds, collectionIds, names, pokemonIds, pokemonCounts, imageUrls, prices);
    }
    /**
     * Get all boosters
     */
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
    /**
     * Get boosters for sale, which is all the boosters owned by the contract creator
     * @param contractCreator The address of the contract creator
     */
    function getBoostersForSale(address contractCreator)
        public
        view
          returns (uint[] memory, uint[] memory, string[] memory, string[][] memory, uint[] memory, string[] memory, uint256[] memory)
    {
        uint[] memory tokenIds = getOwnedBoosters(contractCreator);
        return getMultipleBoosters(tokenIds);
    }
    /**
     * Create a booster
     * @param name The name of the booster
     * @param imageUrl The image URL of the booster
     * @param collectionId The collection ID
     * @param pokemonIds The list of pokemon IDs
     * @param pokemonCount The number of pokemon in the booster
     * @param price The price of the booster
     */
    function createBooster(string memory name, string memory imageUrl, uint256 collectionId, string[] memory pokemonIds, uint pokemonCount, uint256 price)
        public  
        onlyOwner 
        returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _boosters[tokenId] = Booster(tokenId, collectionId, name, pickRandomIds(pokemonIds, pokemonCount), pokemonCount, imageUrl, price);
        _mint(owner(), tokenId);
        return tokenId;
    }
    /**
     * Pick n random IDs from a list of IDs
     * @param allIds The list of IDs
     * @param n The number of IDs to pick
     */    
    function pickRandomIds(string[] memory allIds, uint n) 
        private 
        view 
        returns (string[] memory)
    {
        string[] memory result = new string[](n);
        for (uint i = 0; i < n; i++) {
            uint index = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,_nextTokenId, i))) % allIds.length;
            result[i] = allIds[index];
        }
        return result;
    }
    /**
     * Buy a booster
     * @param tokenId The token ID of the booster
     * @param to The address to buy the booster for
     */
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