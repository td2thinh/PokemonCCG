import React, { useEffect, useState } from 'react'
import * as main from '@/lib/main';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useWalletContext } from '@/contexts/WalletContext';
import { PokemonCard } from '@/interfaces/card';
import { ethers } from 'ethers';
import Skeleton from "react-loading-skeleton";
import useStyles from "@/components/CardsStyles";
import axios from 'axios';
import { Img } from 'react-image';
import { Box, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

// uint tokenId;      // token ID
// uint collectionId;  // collection ID
// string pokemonId;   // pokemon ID

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface CardTokenProps {
    tokenId: number;
    collectionId: number;
    pokemonId: string;
    card: PokemonCard;
}


function Collection() {
    const wallet = useWalletContext();
    const [tokens, setTokens] = useState<CardTokenProps[]>([]);
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

    const [clickedToken, setClickedToken] = useState<CardTokenProps | null>(null);
    const classes = useStyles();

    return (
        <>
            <Typography
                variant="h4"
                align="center"
                sx={{
                    fontWeight: 700,
                    letterSpacing: '.2rem',
                    color: "rebeccapurple",
                    paddingBottom: '20px',
                    paddingTop: '1.3em'

                }}
            >
                Your Cards, click to put one in the market
            </Typography>
            <div>
                <ul className={classes.ul}>
                    {tokens.map((token) => (
                        <li key={token.tokenId} className={classes.li}>
                            <Img
                                onClick={() => {
                                    handleOpen();
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h2" component="h2" align="center" fontFamily={"monospace"} color='rebeccapurple'>
                        Sell this card
                    </Typography>
                    <Grid container spacing={2}>
                        <Img src={clickedToken?.card.image} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h4">{clickedToken?.card.name}</Typography>
                            <Typography variant="h6">{clickedToken?.pokemonId}</Typography>
                            <TextField
                                label="Price"
                                value={price}
                                defaultValue="0.1"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <Button
                                onClick={async () => {
                                    if (!wallet.contract) {
                                        console.error("Wallet contract is not initialized");
                                        return;
                                    }
                                    await wallet.contract.listItem(clickedToken?.tokenId, ethers.utils.parseEther(price))
                                        .then((tx: any) => {
                                            console.log("Transaction hash:", tx.hash);
                                            handleClose();
                                        });
                                }}
                            >
                                Sell
                            </Button>
                        </Box>
                    </Grid>
                </Box>
            </Modal>
        </>
    )
}


export default Collection