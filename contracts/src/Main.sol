pragma solidity ^0.8.20;

import "./Marketplace.sol";
import "./CardFactory.sol";
import "./BoosterFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Marketplace {
    
    // The main contract holds the smart conrtact for the booster tokens
    BoosterFactory private _boosterFactory;
    // Internal struct to hold the booster data
    BoosterFactory.Booster private _booster;
    
    // Inheritance tree: Main -> Marketplace -> CollectionManager -> CardFactory -> ERC721, ERC721Enumerable, Ownable
    constructor(address initialOwner) Marketplace(initialOwner) {
        _boosterFactory = new BoosterFactory(address(this));
    }

    // Booster Functions
    function createBooster(string memory name, string memory imageUrl, uint256 collectionId, uint pokemonCount, uint price) 
        public 
        onlyOwner 
        returns (uint256) {
        return _boosterFactory.createBooster(name, imageUrl, collectionId, collections[collectionId].pokemonIds, pokemonCount, price);
    }

    function redeemBooster(uint256 boosterId) 
        public 
        {
        require(_boosterFactory.ownerOf(boosterId) == msg.sender, "Main: not the owner of the booster");
        (_booster.tokenId, _booster.collectionId, _booster.name, _booster.pokemonIds, _booster.pokemonCount, _booster.imageUrl, _booster.price) = _boosterFactory.getBooster(boosterId);
        mintAndAssignBatch(msg.sender, _booster.collectionId, _booster.pokemonIds);
        emit CardsUnpacked(_booster.pokemonIds);
        _boosterFactory.burn(boosterId);
    }

    function getBooster(uint256 boosterId) 
        public 
        view 
        returns (uint, uint, string memory, string[] memory, uint, string memory, uint256)
    {
        return _boosterFactory.getBooster(boosterId);
    }

    function getOwnedBoosters(address owner) 
        public 
        view 
        returns (uint256[] memory) {
        return _boosterFactory.getOwnedBoosters(owner);
    }

    function getBoostersForSale() 
        public 
        view 
        returns (uint[] memory, uint[] memory, string[] memory, string[][] memory, uint[] memory, string[] memory, uint256[] memory) {
        return _boosterFactory.getBoostersForSale(address(this));
    }

    function getAllBoosters() 
        public 
        view 
        returns (uint[] memory, uint[] memory, string[] memory, string[][] memory, uint[] memory, string[] memory, uint256[] memory)
    {    
        return _boosterFactory.getAllBoosters();
    }

    function buyBooster(uint256 boosterId, address to)
        public 
        payable {
        _boosterFactory.buyBooster{value: msg.value}(boosterId, to);
    }

    function getOwnerForBooster(uint256 boosterId) 
        public 
        view 
        returns (address) {
        return _boosterFactory.ownerOf(boosterId);
    }

    function getMultipleBoosters(uint256[] memory boosterIds) 
        public 
        view 
        returns (uint[] memory, uint[] memory, string[] memory, string[][] memory, uint[] memory, string[] memory, uint256[] memory)
    {
        return _boosterFactory.getMultipleBoosters(boosterIds);
    }

    receive() external payable {} // to support receiving ETH by default
    fallback() external payable {}
}