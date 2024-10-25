import React, { Fragment, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useCards from "../Hooks/useCards.tsx";
import useStyles from "./CardsStyles";
import ModalManager from "./CardsManager"; // Import du composant

interface CardsProps {
  isOwner: boolean; // Nouveau paramètre pour indiquer si l'utilisateur est propriétaire
}

const Cards: React.FC<CardsProps> = ({ isOwner }) => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const classes = useStyles();
  const { cards } = useCards(id);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [assignTo, setAssignTo] = useState("");
  const [formData, setFormData] = useState<{ [key: string]: { nbCard: number } }>({});

  const handleSelectCard = (id: string) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cardId) => cardId !== id)
        : [...prevSelected, id]
    );
    setFormData((prevData) => ({
      ...prevData,
      [id]: { nbCard: 1 },
    }));
  };

  const handleOpenModal = () => {
    console.log("Opening modal");  
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");  
    setShowModal(false);
  };

  const handleInputChange = (cardId: string, value: number) => {
    setFormData((prevData) => ({
      ...prevData,
      [cardId]: { nbCard: value },
    }));
  };

  const handleAssign = () => {
    console.log("Assigned to:", assignTo);
    console.log("Cards:", formData);
    handleCloseModal();
  };

  // Vérifie si les cartes sont bien chargées
  if (!cards.length) {
    console.log("No cards available");  
    return <Skeleton count={10} />;
  }

  return (
    <Fragment>
      <ul className={classes.ul}>
        {cards.map(({ id, image, name }) => (
          <li key={id} className={classes.li}>
            <Link to={`${pathname}/${id}`}>
              <Img
                src={image}
                loader={<Skeleton />}
                alt={name}
                className={classes.img}
              />
            </Link>
            <div className={classes.checkbox}>
              <input
                type="checkbox"
                checked={selectedCards.includes(id)}
                onChange={() => handleSelectCard(id)}
              />
              <label> Sélectionner {name}</label>
            </div>
          </li>
        ))}
      </ul>

      {selectedCards.length > 0 && (
        <button className={classes.managerButton} onClick={handleOpenModal}>
          Manager ({selectedCards.length})
        </button>
      )}

      {showModal && (
        <ModalManager
          selectedCards={selectedCards.map((id) => ({
            id,
            name: cards.find((card) => card.id === id)?.name || "",
          }))}
          assignTo={assignTo}
          setAssignTo={setAssignTo}
          formData={formData}
          handleInputChange={handleInputChange}
          handleAssign={handleAssign}
          handleCloseModal={handleCloseModal}
          isOwner={isOwner} 
        />
      )}
    </Fragment>
  );
};

export default Cards;