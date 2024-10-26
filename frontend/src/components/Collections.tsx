import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./CardsStyles";
import useCollection from "../Hooks/useCollection";
import CreateCollectionModal from "./CreateCollectionModal"; // Import du nouveau composant modal
import { useWalletContext } from "@/contexts/WalletContext";
import { ethers } from "ethers";
interface Collection {
  collectionId: number;
  name: string;
  image: string;
  pokemonIds: string[];
  cardCount: number;
}
interface CollectionsProps {
  isOwner: boolean;
}

const Collections: React.FC<CollectionsProps> = ({ isOwner }) => {
  // const { type } = useParams();
  const wallet = useWalletContext();
  let { pathname } = useLocation();
  if (pathname == "/") {
    pathname = "/factory";
  }
  const classes = useStyles();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCollections = async () => {
      if (!wallet.contract) {
        setError('Wallet contract is not initialized');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        let newCollections: Collection[] = [];
        const rawCollections = await wallet.contract.getAllCollections()
          .then((collections: any) => {
            for (let i = 0; i < collections[0].length; i++) {
              newCollections.push({
                collectionId: ethers.BigNumber.from(collections[0][i]).toNumber(),
                name: collections[1][i],
                image: collections[2][i],
                pokemonIds: collections[3][i],
                cardCount: ethers.BigNumber.from(collections[4][i]).toNumber(),
              });
            }
            console.log("Collections loaded:", newCollections);
            setCollections(newCollections);
          }
          );
      } catch (err) {
        console.error("Error loading collections:", err);
        setError('Failed to load collections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [wallet.contract]); // Add wallet.contract as dependency


  const [showModal, setShowModal] = useState(false);

  // État pour le nom et l'image de la collection
  const [collectionName, setCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState("");

  // État pour les cartes sélectionnées
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleOpenModal = () => {
    console.log("Opening modal");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
  };

  const handleCheckboxChange = (cardId: string) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(cardId)
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]
    );
  };

  const handleCreateCollection = async () => {
    const createTx = await wallet.contract?.createCollection(collectionName, collectionImage, selectedCards.length, selectedCards);
    handleCloseModal(); // Fermer le modal après avoir créé la collection
  };

  // // Vérifie si les collections sont bien chargées
  // if (!collections.length) {
  //   console.log("No collections available");
  //   return <Skeleton count={10} />;
  // }

  return (
    <Fragment>
      <ul className={classes.ul}>
        {collections.map(({ collectionId, image, name }) => (
          <li key={collectionId} className={classes.li}>
            <Link to={`${pathname}/${collectionId}`}>
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

      {/* Afficher le bouton Create Card uniquement si isOwner est true */}
      {isOwner && (
        <button className={classes.managerButton} onClick={handleOpenModal}>
          Create Collection
        </button>
      )}

      {/* Affiche le modal lorsque showModal est true */}
      {showModal && (
        <CreateCollectionModal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          collectionName={collectionName}
          setCollectionName={setCollectionName}
          collectionImage={collectionImage}
          setCollectionImage={setCollectionImage}
          selectedCards={selectedCards}
          handleCheckboxChange={handleCheckboxChange}
          handleCreateCollection={handleCreateCollection}
        />
      )}
    </Fragment>
  );
};

export default Collections;