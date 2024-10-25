pragma solidity ^0.8.20;

import "./Marketplace.sol";
import "./CardFactory.sol";
import "./BoosterFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Marketplace {
    
    BoosterFactory private _boosterFactory;
    BoosterFactory.Booster private _booster;
    
    constructor(address initialOwner) Marketplace(initialOwner) {
        _boosterFactory = new BoosterFactory(address(this));
    }

    // Booster
    function createBooster(string memory name, string memory imageUrl, uint256 collectionId, uint pokemonCount, uint price) 
        public 
        onlyOwner 
        returns (uint256) {
        string[] memory pokemonIds = new string[](pokemonCount);
        for (uint i = 0; i < pokemonCount; i++) {
            pokemonIds[i] = collections[collectionId].pokemonIds[i];
        }
        return _boosterFactory.createBooster(name, imageUrl, collectionId, pokemonIds, pokemonCount, price);
    }

    function redeemBooster(uint256 boosterId) 
        public 
        {
        require(_boosterFactory.ownerOf(boosterId) == msg.sender, "Main: not the owner of the booster");
        _booster = _boosterFactory.getBooster(boosterId);
        mintAndAssignBatch(msg.sender, _booster.collectionId, _booster.pokemonIds);
        emit CardsUnpacked(_booster.pokemonIds);
        _boosterFactory.burn(boosterId);
    }

    function getBooster(uint256 boosterId) 
        public 
        view 
        returns (BoosterFactory.Booster memory) {
        return _boosterFactory.getBooster(boosterId);
    }

    function getOwnedBoosters(address owner) 
        public 
        view 
        returns (uint256[] memory) {
        return _boosterFactory.getOwnedBoosters(owner);
    }

    function getAllBoosters() 
        public 
        view 
        returns (BoosterFactory.Booster[] memory) {
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

    receive() external payable {} // to support receiving ETH by default
    fallback() external payable {}
}