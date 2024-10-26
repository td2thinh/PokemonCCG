import React from 'react'
import * as main from '@/lib/main';
import { Button } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
const handleCreateListing = async (contract: main.Main, tokenId: string, price: BigNumber) => {
    const tx = await contract.listItem(tokenId, price);
    console.log('Transaction:', tx);
}
const handleGetAllCards = async (contract: main.Main, address: string) => {
    const cards = await contract.getOwnedCards(address);
    console.log('Cards:', cards);
    cards.forEach((card: any) => {
        console.log(ethers.BigNumber.from(card).toNumber());
    }
    );
}
const handleUpdateListing = async (contract: main.Main, tokenId: string, price: BigNumber) => {
    const tx = await contract.updateListing(tokenId, price);
    console.log('Transaction:', tx);
}
const handleBuyItem = async (contract: main.Main, tokenId: string, price: BigNumber) => {
    const tx = await contract.buyItem(tokenId, { value: price });
    console.log("Transaction: ", tx);
}
const handleGetAllListing = async (contract: main.Main) => {
    const listings = await contract.getAllListings();
    console.log('Listings:', listings);
}

const handleDelist = async (contract: main.Main, tokenId: string) => {
    const tx = await contract.cancelListing(tokenId);
    console.log('Transaction:', tx);
}

function Marketplace() {
    return (
        <>
            <Button variant="contained" color="primary" onClick={() => handleGetAllCards(contract, "0x976EA74026E726554dB657fA54763abd0C3a0aa9")}>
                Get All Cards
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleCreateListing(contract, '0', ethers.utils.parseEther("0.1"))}>
                Create Listing
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleUpdateListing(contract, '0', ethers.utils.parseEther("0.2"))}>
                Update Listing
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleGetAllListing(contract)}>
                Get All Listings
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleBuyItem(contract, '0', ethers.utils.parseEther("0.2"))}>
                Buy Item
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleDelist(contract, '0')}>
                Delist
            </Button>
        </>

    )
}

export default Marketplace