import React, { useEffect, useState } from 'react'
import * as main from '@/lib/main';
import { Button, Typography } from '@mui/material';
import { useWalletContext } from '@/contexts/WalletContext';
import { PokemonCard } from '@/interfaces/card';
import { ethers } from 'ethers';
import Skeleton from "react-loading-skeleton";
import useStyles from "@/components/CardsStyles";
import axios from 'axios';
import { Img } from 'react-image';

// uint tokenId;      // token ID
// uint collectionId;  // collection ID
// string pokemonId;   // pokemon ID

interface CardTokenProps {
    tokenId: number;
    collectionId: number;
    pokemonId: string;
    card: PokemonCard;
}


function Collection() {
    const wallet = useWalletContext();
    const [tokens, setTokens] = useState<CardTokenProps[]>([]);


    useEffect(() => {
        const fetchTokens = async () => {
            if (!wallet.contract) {
                console.error("Wallet contract is not initialized");
                return;
            }
            await wallet.contract.getOwnedCards(wallet.details?.account)
                .then(async (tokens: any) => {
                    await wallet.contract.getMultipleCards(tokens)
                        .then((cards: any) => {
                            cards.forEach(async (card: any) => {
                                await axios.get(`https://api.pokemontcg.io/v2/cards/${card.pokemonId}`)
                                    .then((cardData: any) => {
                                        const pokemonCard: PokemonCard = {
                                            name: cardData.data.data.name,
                                            id: cardData.data.data.id,
                                            image: cardData.data.data.images.small,
                                            text: cardData.data.data.text,
                                        };
                                        setTokens((prevTokens) => [...prevTokens, {
                                            tokenId: card.tokenId,
                                            collectionId: card.collectionId,
                                            pokemonId: card.pokemonId,
                                            card: pokemonCard,
                                        }]);
                                    }
                                    );
                            });
                        });
                });
        }
        fetchTokens();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [clickedToken, setClickedToken] = useState<CardTokenProps | null>(null);
    const classes = useStyles();

    return (
        <>
            <Typography
                variant="h2"
                align="center"
                sx={{
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: "rebeccapurple",
                    paddingBottom: '20px',
                    paddingTop: '1.3em'

                }}
            >
                Your Cards
            </Typography>
            <div>
                <ul className={classes.ul}>
                    {tokens.map((token) => (
                        <li key={token.tokenId} className={classes.li}>
                            <Img
                                onClick={() => {
                                    setShowModal(true);
                                    setClickedToken(token);
                                }}
                                src={token.card.image}
                                loader={<Skeleton />}
                                alt={token.card.name}
                                className={classes.img}
                            />
                        </li>
                    ))}
                </ul>
            </div>

        </>
    )
}


export default Collection