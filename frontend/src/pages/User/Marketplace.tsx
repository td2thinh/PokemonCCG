import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./MarketStyles";
import { useWalletContext } from "@/contexts/WalletContext";
import { ethers } from "ethers";
import { PokemonCard } from "@/interfaces/card";
import axios from "axios";
import Titre from "@/components/Titre";

// uint256 price;
// address seller;
// string pokemonId;
interface ListingProps {
    tokenId: number,
    price: string,
    seller: string,
    pokemonId: string
}

interface MarketItems {
    listings: ListingProps,
    pokemonCards: PokemonCard
}


function Marketplace() {
    const wallet = useWalletContext();
    const { id } = useParams<{ id: string }>();
    const { pathname } = useLocation();
    const classes = useStyles();
    // const { cards } = useCards(id);
    const [listings, setListings] = useState<any[]>([]);
    const [pokemonCards, setPokemonCards] = useState<PokemonCard[]>([]);
    const [marketItems, setMarketItems] = useState<MarketItems[]>([]);
    const [newPrice, setNewPrice] = useState<{ [key: string]: number }>({});
    const [selectedCard, setSelectedCard] = useState<{ id: string, name: string } | null>(null);
    const [gain, setGain] = useState(""); // met a jour ici le "gain" qu'il a reçu apres qu'il ai pu vendre une carte
    const [showCashout, setShowCashout] = useState<boolean>(true);

    useEffect(() => {
        // Met à jour l'affichage du bouton "Encaisser" en fonction de la valeur du gain
        const fetchGain = async () => {
            const rawGain = await wallet.contract.getEarned(wallet.details?.account);
            if (ethers.BigNumber.from(rawGain).toNumber() > 0) {
                setGain(ethers.utils.formatEther(rawGain));
            }
            else {
                setGain("0");
            }
        }
        fetchGain();
        if (gain == "0") {
            setShowCashout(false);
        } else {
            setShowCashout(true);
        }
    }, [gain]);

    useEffect(() => {
        const fetchListings = async () => {
            const rawListings = await wallet.contract.getAllListings();
            let newListings: ListingProps[] = [];
            let newPokemonCards: PokemonCard[] = [];
            for (let i = 0; i < rawListings[0].length; i++) {
                newListings.push({
                    tokenId: ethers.BigNumber.from(rawListings[0][i]).toNumber(),
                    price: ethers.utils.formatEther(rawListings[1][i]),
                    seller: rawListings[2][i],
                    pokemonId: rawListings[3][i],
                });
                const card = await axios.get(`https://api.pokemontcg.io/v2/cards/${rawListings[3][i]}`);
                newPokemonCards.push({
                    name: card.data.data.name,
                    id: card.data.data.id,
                    image: card.data.data.images.small,
                    text: card.data.data.text,
                });
            }
            setListings(newListings);
            setPokemonCards(newPokemonCards);
            setMarketItems(newListings.map((listing, index) => ({
                listings: listing,
                pokemonCards: newPokemonCards[index],
            })));
        };

        fetchListings();
    }, [marketItems]);

    const openModal = (cardId: string, cardName: string) => {
        setSelectedCard({ id: cardId, name: cardName });
    };

    const closeModal = () => {
        setSelectedCard(null);
    };

    const handlePriceChange = (value: number) => {
        setNewPrice((prevData) => ({
            ...prevData,
            [selectedCard!.id]: value,
        }));
    };

    const handleUpdatePrice = async () => {
        const tokenId = selectedCard!.id;
        const newPriceValue = newPrice[tokenId];
        await wallet.contract?.updateListing(parseInt(tokenId), ethers.utils.parseEther(newPriceValue.toString()));
        closeModal();
    };

    const handleBuy = async (cardId: string, price: string) => {
        await wallet.contract?.buyItem(parseInt(cardId), { value: ethers.utils.parseEther(price) });
    };

    const handleCancelSell = async (cardId: string) => {
        await wallet.contract?.cancelListing(parseInt(cardId));
    };

    const handleCashout = async () => {
        await wallet.contract?.withdrawEarned();
        setGain("0");
    }

    // if (!cards.length) {
    //     return <Skeleton count={10} />;
    // }

    return (
        <Fragment>
            <Titre text="Buy and Sell Cards" color="rebeccapurple" />
            {/* affiche le bouton "Encaisser" seulement si le gain est supérieur à 0 */}
            {showCashout && (
                <div className={classes.cashoutSection}>
                    <label className={classes.gainLabel}>Gain: {gain} ETH</label>
                    <button className={classes.cashoutButton} onClick={handleCashout}>
                        Collect
                    </button>
                </div>
            )}

            <ul className={classes.ul}>
                {marketItems.map(({ listings, pokemonCards }) => (
                    <li key={listings.tokenId} className={classes.li}>
                        <Img
                            src={pokemonCards.image}
                            loader={<Skeleton />}
                            alt={pokemonCards.name}
                            className={classes.img}
                        />
                        <div>
                            <label>{pokemonCards.name}</label>
                            <br />
                            <label>{listings.price} ETH</label>
                            <br />
                        </div>
                        {listings.seller == wallet.details?.account ?
                            (
                                <div>
                                    <button className={classes.button} onClick={() => openModal(listings.tokenId.toString(), pokemonCards.name)}>
                                        Update
                                    </button>
                                    <button className={classes.cancelButton} onClick={() => handleCancelSell(listings.tokenId.toString())}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button className={classes.button} onClick={() => handleBuy(listings.tokenId.toString(), listings.price)}>
                                    Buy
                                </button>
                            )
                        }
                    </li>
                ))}
            </ul>

            {selectedCard && (
                <div className={classes.modalOverlay}>
                    <div className={classes.modal}>
                        <h2>Update {selectedCard.name}</h2>
                        <input
                            type="number"
                            placeholder="New Price"
                            value={newPrice[selectedCard.id] || ""}
                            onChange={(e) => handlePriceChange(Number(e.target.value))}
                            className={classes.input}
                        />
                        <div className={classes.modalButtons}>
                            <button className={classes.button} onClick={handleUpdatePrice}>
                                Validate
                            </button>
                            <button className={classes.cancelButton} onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Marketplace