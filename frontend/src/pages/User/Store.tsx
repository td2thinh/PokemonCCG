import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "@/components/CardsStyles";
import { useWalletContext } from "@/contexts/WalletContext";
import { ethers } from "ethers";
import { BoosterPack } from "@/interfaces/card";
import { Button, Typography } from "@mui/material";


const Store = () => {
    const wallet = useWalletContext();
    const classes = useStyles();
    const [boosters, setBoosters] = useState<BoosterPack[]>([]);
    const [showModal, setShowModal] = useState(false);
    const handleBuyBooster = async (id: number, price: string) => {
        try {
            await wallet.contract.buyBooster(id, wallet.details?.account, { value: ethers.utils.parseEther(price) });
            console.log("Booster bought");
        } catch (err) {
            console.error("Error redeeming booster:", err);
        }
    }
    useEffect(() => {
        const fetchBoosters = async () => {
            if (!wallet.contract) {
                console.error("Wallet contract is not initialized");
                return;
            }
            try {
                const rawBoosters = await wallet.contract.getBoostersForSale();
                let newBoosters: BoosterPack[] = [];
                for (let i = 0; i < rawBoosters[0].length; i++) {
                    newBoosters.push({
                        id: ethers.BigNumber.from(rawBoosters[0][i]).toNumber(),
                        collectionId: ethers.BigNumber.from(rawBoosters[1][i]).toNumber(),
                        name: rawBoosters[2][i],
                        pokemonIds: rawBoosters[3][i],
                        cardCount: ethers.BigNumber.from(rawBoosters[4][i]).toNumber(),
                        image: rawBoosters[5][i],
                        price: ethers.utils.formatEther(rawBoosters[6][i]),
                    });
                }
                setBoosters(newBoosters);
            } catch (err) {
                console.error("Error loading boosters:", err);
            }
        };

        fetchBoosters();
    }, []);



    // if (!collections.length) {
    //   return <Skeleton count={10} />;
    // }

    return (
        <Fragment>
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
                Click to buy booster packs
            </Typography>
            <ul className={classes.ul}>
                {boosters.map(({ id, image, name, price }) => (
                    <li key={id} className={classes.li}>
                        <Img
                            onClick={() => handleBuyBooster(id, price)}
                            src={image}
                            loader={<Skeleton />}
                            alt={name}
                            className={classes.img}
                        />
                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export default Store;   