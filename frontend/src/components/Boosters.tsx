import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./CardsStyles";
import useCollection from "../Hooks/useCollection";
import { useWalletContext } from "@/contexts/WalletContext";
import { ethers } from "ethers";
import CreateBoosterModal from "./CreateBoosterModal";
import { BoosterPack } from "@/interfaces/card";

interface CollectionsProps {
  isOwner: boolean;
}

const Boosters: React.FC<CollectionsProps> = ({ isOwner }) => {
  const { type } = useParams();
  const wallet = useWalletContext();
  const { pathname } = useLocation();
  const classes = useStyles();
  const [boosters, setBoosters] = useState<BoosterPack[]>([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBoosters = async () => {
      if (!wallet.contract) {
        console.error("Wallet contract is not initialized");
        return;
      }

      try {
        const rawBoosters = await wallet.contract.getAllBoosters();
        console.log("Boosters loaded:", rawBoosters);
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


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateBooster = async (boosterData: { name: string, imageUrl: string; cardCount: number; collectionId: string; price: number }) => {
    const createTx = await wallet.contract?.createBooster(boosterData.name, boosterData.imageUrl, boosterData.collectionId, boosterData.cardCount, ethers.utils.parseEther(boosterData.price.toString()));
    console.log("Create booster transaction:", createTx);
    // Vous pouvez ajouter ici la logique pour envoyer les données à l'API ou les sauvegarder dans votre système
    handleCloseModal(); // Fermer le modal après création
  };

  // if (!collections.length) {
  //   return <Skeleton count={10} />;
  // }

  return (
    <Fragment>
      <ul className={classes.ul}>
        {boosters.map(({ id, image, name }) => (
          <li key={id} className={classes.li}>
            <Link to={`${pathname}/${id}`}>
              <Img
                src={image}
                loader={<Skeleton />}
                alt={name}
                className={classes.img}
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Afficher le bouton Create Booster uniquement si isOwner est true */}
      {isOwner && (
        <button className={classes.managerButton} onClick={handleOpenModal}>
          Create Booster
        </button>
      )}

      {/* Modal pour créer un booster */}
      {showModal && (
        <CreateBoosterModal
          handleCloseModal={handleCloseModal}
          handleCreateBooster={handleCreateBooster}
        />
      )}
    </Fragment>
  );
};

export default Boosters;   