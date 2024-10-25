import React, { Fragment, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./CardsStyles";
import useCollection from "../Hooks/useCollection";
import CreateBoosterModal from "./CreateBoosterModal";

interface CollectionsProps {
  isOwner: boolean; 
  id: String;
}

const Boosters: React.FC<CollectionsProps> = ({ isOwner, id }) => {
  const { type } = useParams();
  const { pathname } = useLocation();
  const classes = useStyles();
  const { collections } = useCollection({ isOwner, id });
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateBooster = (boosterData: { imageUrl: string; cardCount: number; collectionId: string; price: number }) => {
    console.log("Booster created:", boosterData);
    // Vous pouvez ajouter ici la logique pour envoyer les données à l'API ou les sauvegarder dans votre système
    handleCloseModal(); // Fermer le modal après création
  };

  if (!collections.length) {
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

export default Boosters ;   