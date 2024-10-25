import React, { Fragment } from "react";
import useStyles from "./CreateCollectionModalStyles"; // Import du hook de styles
import useCards from "../Hooks/useCards.tsx";

interface CreateCollectionModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  collectionName: string;
  setCollectionName: (value: string) => void;
  collectionImage: string;
  setCollectionImage: (value: string) => void;
  selectedCards: string[];
  handleCheckboxChange: (cardId: string) => void;
  handleCreateCollection: () => void;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  showModal,
  handleCloseModal,
  collectionName,
  setCollectionName,
  collectionImage,
  setCollectionImage,
  selectedCards,
  handleCheckboxChange,
  handleCreateCollection,
}) => {
  const classes = useStyles();
   // on va recuperer toute les cartes pour la suggestion de creation de collection
  const { cards } = useCards("null", true);
  console.log(cards);
  

  if (!showModal) {
    return null; // Ne rien rendre si le modal n'est pas ouvert
  }

  return (
    <Fragment>
      <div className={classes.overlay} onClick={handleCloseModal}></div>
      <div className={classes.modal}>
        <h2>Create a New Collection</h2>
        <div className={classes.formGroup}>
          <label htmlFor="collectionName">Collection Name</label>
          <input
            type="text"
            id="collectionName"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="collectionImage">Collection Image URL</label>
          <input
            type="text"
            id="collectionImage"
            value={collectionImage}
            onChange={(e) => setCollectionImage(e.target.value)}
          />
        </div>
        <div className={classes.formGroup}>
          <label>Select Cards</label>
          <div className={classes.scrollableList}>
            {cards.map(({ id, name }) => (
              <div key={id} className={classes.cardRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(id)}
                    onChange={() => handleCheckboxChange(id)}
                  />
                  {name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.buttons}>
          <button className={classes.closeButton} onClick={handleCloseModal}>
            Annuler
          </button>
          <button className={classes.assignButton} onClick={handleCreateCollection}>
            Valider
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateCollectionModal;