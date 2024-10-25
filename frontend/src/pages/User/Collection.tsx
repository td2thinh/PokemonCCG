import React, { useEffect } from 'react'
import * as main from '@/lib/main';
import { Button } from '@mui/material';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

const getAllCards = async (contract: main.Main, wallet: string) => {
    const cards = await contract.getOwnedCards(wallet)
        .then((cards: any) => {
            contract.getMultipleCards(cards)
                .then((cards: any) => {
                    console.log(cards)
                })
        })
}
const handleBuyBooster = async (contract: main.Main, boosterId: string, to: string) => {
    const tx = await contract.buyBooster(boosterId, to, { value: 600000000000 });
    console.log('Transaction:', tx);
}
const handleGetBooster = async (contract: main.Main, boosterId: string) => {
    const owner = await contract.getBooster(boosterId);
    console.log('Owner:', owner);
}
const handleRedeemBooster = async (contract: main.Main, boosterId: string) => {
    const tx = await contract.redeemBooster(boosterId);
    console.log('Transaction:', tx);
}

const handleGetBoosterOwner = async (contract: main.Main, boosterId: string) => {
    const owner = await contract.getOwnerForBooster(boosterId);
    console.log('Owner:', owner);
}

function Collection({ wallet, contract }: { wallet: string | undefined, contract: main.Main }) {

    // useEffect(() => {
    //     getAllCards(contract, wallet).then((cards) => {
    //         console.log(cards);
    //     }
    //     );
    // }, [contract]);

    return (
        <>

            <Button variant="contained" color="primary" onClick={() => handleBuyBooster(contract, '0', wallet || '')}>
                Buy Booster
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleGetBooster(contract, '0')}>
                Get Booster
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleRedeemBooster(contract, '0')}>
                Redeem Booster
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleGetBoosterOwner(contract, '0')}>
                Get Booster Owner
            </Button>
        </>
    )
}

export default Collection