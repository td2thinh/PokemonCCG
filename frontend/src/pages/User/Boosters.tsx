import React, { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "@/components/CardsStyles";
import { useWalletContext } from "@/contexts/WalletContext";
import { ethers } from "ethers";
import { BoosterPack } from "@/interfaces/card";
import { Box, Button, Modal, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { PokemonCard } from "@/interfaces/card";
import axios from "axios";
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

const Boosters = () => {
  const wallet = useWalletContext();
  const classes = useStyles();
  const [boosters, setBoosters] = useState<BoosterPack[]>([]);
  const [unpackedCards, setUnpackedCards] = useState<PokemonCard[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRedeem = async (id: number, pokemonIds: string[]) => {
    try {
      await wallet.contract.redeemBooster(id);
      pokemonIds.forEach(async (pokemonId) => {
        await axios.get(`https://api.pokemontcg.io/v2/cards/${pokemonId}`)
          .then((cardData: any) => {
            const pokemonCard: PokemonCard = {
              name: cardData.data.data.name,
              id: cardData.data.data.id,
              image: cardData.data.data.images.small,
              text: cardData.data.data.text,
            };
            setUnpackedCards((prevCards) => [...prevCards, pokemonCard]);
          }
          );
      }
      );
      setOpen(true);
      console.log("Booster redeemed");
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
        const boosterIds = await wallet.contract.getOwnedBoosters(wallet.details?.account);
        const rawBoosters = await wallet.contract.getMultipleBoosters(boosterIds);
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
  }, [boosters, unpackedCards]);



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
        Click to redeem your boosters
      </Typography>
      <ul className={classes.ul}>
        {boosters.map(({ id, image, name, pokemonIds }) => (
          <li key={id} className={classes.li}>
            <Img
              onClick={() => handleRedeem(id, pokemonIds)}
              src={image}
              loader={<Skeleton />}
              alt={name}
              className={classes.img}
            />
          </li>
        ))}
      </ul>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Congratulations! You have unpacked the following cards:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {unpackedCards.map((card) => (
                <Grid key={card.id} size={2}>
                  <Img src={card.image} alt={card.name} />
                </Grid>
              ))}
            </Grid>
          </Typography>
        </Box>
      </Modal>
    </Fragment>
  );
};

export default Boosters;