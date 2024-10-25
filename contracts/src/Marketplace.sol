pragma solidity ^0.8.0;

import "./CollectionManager.sol";

contract Marketplace is CollectionManager {

     // Marketplace
     struct Listing {
        uint256 price;
        address seller;
        string pokemonId;
    }

    constructor(address initialOwner) CollectionManager(initialOwner) {}

    mapping(uint => Listing) private listings;
    mapping(address => uint256) private totalEarned;

    function listItem(
        uint256 tokenId,
        uint256 price
    )
        external
    {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        listings[tokenId] = Listing(price, msg.sender, getCard(tokenId).pokemonId);
        // Transfer the token to this contract
        transferFrom(msg.sender, address(this), tokenId);
        // Create listing
        listings[tokenId] = Listing(price, msg.sender, getCard(tokenId).pokemonId);
    }

    function cancelListing(uint256 tokenId)
        external
    {
        require(listings[tokenId].seller == msg.sender, "Not the owner");
        // Transfer the token back to the owner
        _transfer(address(this), msg.sender, tokenId);
        // Clear listing
        delete (listings[tokenId]);
    }

    function buyItem(uint256 tokenId)
        external
        payable
    {
        Listing memory listedItem = listings[tokenId];
        require(listedItem.seller != address(0), "Item not listed");
        require(msg.value >= listedItem.price, "Insufficient payment");
        totalEarned[listedItem.seller] += listedItem.price;
        _transfer(address(this), msg.sender, tokenId);
        delete (listings[tokenId]);
        if (msg.value > listedItem.price) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - listedItem.price}("");
            require(success, "Refund failed");
        }
    }

    function updateListing(
        uint256 tokenId,
        uint256 newPrice
    )
        external
    {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        listings[tokenId].price = newPrice;
    }

    function withdrawEarned() 
        external 
    {
        uint256 earned = totalEarned[msg.sender];
        totalEarned[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: earned}("");
        require(success, "Transfer failed");
    }


    function getListing(uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return listings[tokenId];
    }

    function getEarned(address seller) 
        external 
        view 
        returns (uint256) {
        return totalEarned[seller];
    }

    function getAllListings() 
        external 
        view 
        returns (Listing[] memory) {
        uint totalListings = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            if (listings[i].seller != address(0)) {
                totalListings++;
            }
        }
        Listing[] memory result = new Listing[](totalListings);
        uint index = 0;
        for (uint256 i = 0; i < totalSupply(); i++) {
            if (listings[i].seller != address(0)) {
                result[index] = listings[i];
                index++;
            }
        }
        return result;
    }
}