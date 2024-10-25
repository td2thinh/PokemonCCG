import React, { Fragment, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./CardsStyles";
import useCollection from "../Hooks/useCollection";
import CreateBoosterModal from "./CreateBoosterModal";

interface CollectionsProps {
  isOwner: boolean; 
}

const Boosters: React.FC<CollectionsProps> = ({ isOwner }) => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const classes = useStyles();
  const { collections } = useCollection({ isOwner, id: id ?? "" });
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateBooster = (boosterData: { imageUrl: string; cardCount: number; collectionId: string; price: number }) => {
    console.log("Booster created:", boosterData);
    // Logic to send the booster data to the API or save it in your system
    handleCloseModal(); // Close the modal after creation
  };

  if (!collections.length) {
    return <Skeleton count={10} />;
  }

  return (
    <Fragment>
      <ul className={classes.ul}>
        {collections.map(({ id, image, name }) => (
          <li key={id} className={classes.li}>
            {isOwner ? (
              // Non-clickable version if isOwner is true
              <Img
                src={image}
                loader={<Skeleton />}
                alt={name}
                className={classes.img}
              />
            ) : (
              // Clickable version if isOwner is false
              <Link to={`${pathname}/${id}`}>
                <Img
                  src={image}
                  loader={<Skeleton />}
                  alt={name}
                  className={classes.img}
                />
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Show Create Booster button only if isOwner is true */}
      {isOwner && (
        <button className={classes.managerButton} onClick={handleOpenModal}>
          Create Booster
        </button>
      )}

      {/* Modal to create a booster */}
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