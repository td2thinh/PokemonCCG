import React, { Fragment, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./CardsStyles";
import useCollection from "../Hooks/useCollection";
import CreateCollectionModal from "./CreateCollectionModal"; // Import du nouveau composant modal

interface CollectionsProps {
  isOwner: boolean; 
  id: String;
}

const Collections: React.FC<CollectionsProps> = ({ isOwner, id }) => {
  const { type } = useParams();
  const { pathname } = useLocation();
  const classes = useStyles();
  const { collections } = useCollection({ isOwner, id });
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

  const handleCreateCollection = () => {
    console.log("Collection created:", {
      collectionName,
      collectionImage,
      selectedCards,
    });
    handleCloseModal(); // Fermer le modal après avoir créé la collection
  };

  // Vérifie si les collections sont bien chargées
  if (!collections.length) {
    console.log("No collections available");
    return <Skeleton count={10} />;
  }

  return (
    <Fragment>
      <ul className={classes.ul}>
        {collections.map(({ id, image, name }) => (
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