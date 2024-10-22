import React, { Fragment } from "react";
import useCardsManagerStyles from "./CardsManagerStyles"; // Importer les styles

interface ModalManagerProps {
  selectedCards: { id: string; name: string }[];
  assignTo: string;
  setAssignTo: (value: string) => void;
  formData: { [key: string]: { nbCard: number } };
  handleInputChange: (cardId: string, value: number) => void;
  handleAssign: () => void;
  handleCloseModal: () => void;
}

const ModalManager: React.FC<ModalManagerProps> = ({
  selectedCards,
  assignTo,
  setAssignTo,
  formData,
  handleInputChange,
  handleAssign,
  handleCloseModal,
}) => {
  const classes = useCardsManagerStyles(); // Utiliser les styles du modal

  return (
    <Fragment>
      <div className={classes.overlay} onClick={handleCloseModal}></div>
      <div className={classes.modal}>
        <h2>Manager les cartes sélectionnées</h2>
        <div className={classes.formGroup}>
          <label>Assigné à</label>
          <input
            type="text"
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            className={classes.assignInput}
          />
        </div>
        <div className={classes.scrollableList}>
          {selectedCards.map((card) => (
            <div key={card.id} className={classes.cardRow}>
              <h3>{card.name}</h3>
              <input
                type="number"
                value={formData[card.id]?.nbCard || 1}
                onChange={(e) =>
                  handleInputChange(card.id, Number(e.target.value))
                }
                min="1"
                style={{ marginLeft: "30px" }}
              />
            </div>
          ))}
        </div>
        <div className={classes.buttons}>
          <button className={classes.closeButton} onClick={handleCloseModal}>
            Fermer
          </button>
          <button className={classes.assignButton} onClick={handleAssign}>
            Assigner
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalManager;