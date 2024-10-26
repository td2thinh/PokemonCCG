pragma solidity ^0.8.0;

import "./CollectionManager.sol";

contract Marketplace is CollectionManager {
    struct Listing {
        uint tokenId;
        uint256 price;
        address seller;
        string pokemonId;
    }

    constructor(address initialOwner) CollectionManager(initialOwner) {}

    mapping(uint => Listing) private listings;
    mapping(address => uint256) private totalEarned;

    /**
     * Put a token up for sale
     * @param tokenId   The ID of the token to list
     * @param price    The price to list the token for
     */
    function listItem(
        uint256 tokenId,
        uint256 price
    )
        external
    {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        listings[tokenId] = Listing(tokenId, price, msg.sender, getCard(tokenId).pokemonId);
        // Transfer the token to this contract
        transferFrom(msg.sender, address(this), tokenId);
        // Create listing
        listings[tokenId] = Listing(tokenId, price, msg.sender, getCard(tokenId).pokemonId);
    }

    /**
     * Cancel a listing
     * @param tokenId   The ID of the token to cancel the listing for
     */
    function cancelListing(uint256 tokenId)
        external
    {
        require(listings[tokenId].seller == msg.sender, "Not the owner");
        // Transfer the token back to the owner
        _transfer(address(this), msg.sender, tokenId);
        // Clear listing
        delete (listings[tokenId]);
    }
    /** 
    * Buy a token that is up for sale
    * @param tokenId   The ID of the token to buy
    */
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
    /**
     * Update the price of a listing
     * @param tokenId   The ID of the token to update the listing for
     * @param newPrice  The new price to update the listing to
     */
    function updateListing(
        uint256 tokenId,
        uint256 newPrice
    )
        external
    {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        listings[tokenId].price = newPrice;
    }
    /**
     * Withdraw earned funds
     */
    function withdrawEarned() 
        external 
    {
        uint256 earned = totalEarned[msg.sender];
        totalEarned[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: earned}("");
        require(success, "Transfer failed");
    }
    /**
     * Get the listing for a token
     * @param tokenId   The ID of the token to get the listing for
     */
    function getListing(uint256 tokenId)
        external
        view
        returns (uint, uint256, address, string memory)
    {
        Listing memory listing = listings[tokenId];
        return (listing.tokenId, listing.price, listing.seller, listing.pokemonId);
    }
    /**
     * Get all listings
     */
    function getEarned(address seller) 
        external 
        view 
        returns (uint256) {
        return totalEarned[seller];
    }
    /**
     * Get all listings
     */
    function getAllListings() 
        external 
        view 
        returns (uint[] memory, uint256[] memory, address[] memory, string[] memory)
    {
        uint count = 0;
        for (uint i = 0; i < _nextTokenId; i++) {
            if (listings[i].seller != address(0)) {
                count++;
            }
        }
        uint[] memory tokenIds = new uint[](count);
        uint256[] memory prices = new uint256[](count);
        address[] memory sellers = new address[](count);
        string[] memory pokemonIds = new string[](count);
        uint index = 0;
        for (uint i = 0; i < _nextTokenId; i++) {
            if (listings[i].seller != address(0)) {
                Listing memory listing = listings[i];
                tokenIds[index] = listing.tokenId;
                prices[index] = listing.price;
                sellers[index] = listing.seller;
                pokemonIds[index] = listing.pokemonId;
                index++;
            }
        }
        return (tokenIds, prices, sellers, pokemonIds);
    }
}