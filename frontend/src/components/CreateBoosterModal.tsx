import React, { useState, Fragment } from "react";
import useStyles from "./createBosterModalStyle";

interface CreateBoosterModalProps {
  handleCloseModal: () => void;
  handleCreateBooster: (boosterData: {
    name: string;
    imageUrl: string;
    cardCount: number;
    collectionId: string;
    price: number;
  }) => void;
}

const CreateBoosterModal: React.FC<CreateBoosterModalProps> = ({
  handleCloseModal,
  handleCreateBooster,
}) => {
  const classes = useStyles();

  // Champs pour les données du booster
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [cardCount, setCardCount] = useState(0);
  const [collectionId, setCollectionId] = useState("");
  const [price, setPrice] = useState(0);

  const handleSubmit = () => {
    // Validation simple
    if (!imageUrl || !collectionId || cardCount <= 0 || price <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    // Envoi des données du booster
    handleCreateBooster({
      name,
      imageUrl,
      cardCount,
      collectionId,
      price,
    });
    handleCloseModal();
  };

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <h2>Create a Booster</h2>
        <div className={classes.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="cardCount">Card Count</label>
          <input
            type="number"
            id="cardCount"
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
            min="1"
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="collectionId">Collection ID</label>
          <input
            type="text"
            id="collectionId"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
          />
        </div>
        <div className={classes.buttons}>
          <button className={classes.closeButton} onClick={handleCloseModal}>
            Cancel
          </button>
          <button className={classes.assignButton} onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div >
  );
};

export default CreateBoosterModal;