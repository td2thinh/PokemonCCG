import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { useParams } from "react-router-dom";
import Icon from "./Icon";
import useCard from "../Hooks/useCard.tsx";
import useCardOwners from "@/Hooks/useCardOwners";

const useStyles = createUseStyles({
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "10px",
    textAlign: "center",
  },
  cardOwnersSection: {
    display: "flex",
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: "20px",
  },
  card: {
    display: "inline-block",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    overflow: "hidden",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& input": {
      marginBottom: "10px",
      padding: "10px",
      width: "80%",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    "& button": {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#0056b3",
      },
    },
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "10px",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  quantityField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    marginBottom: "10px",
  },
  label: {
    marginRight: "25px", 
    fontWeight: "bold",
    width: "100px",
  },
  assignField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    marginBottom: "10px",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    borderRadius: "10px",
    zIndex: 1000,
    width: "60%", 
    maxWidth: "500px",
    textAlign: "center",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  ownerList: {
    maxHeight: "200px", // Limite la hauteur du contenu
    overflowY: "auto", // Ajoute la capacité de faire défiler le contenu
    marginTop: "20px",
  },
  closeButton: {
    marginTop: "20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  },
});

const Card = ({ isOwner }: { isOwner: boolean }) => {
  const { id } = useParams();
  const classes = useStyles();
  const { card } = useCard(id);
  const { owners: cardOwners } = useCardOwners(id);
  const [assignTo, setAssignTo] = useState("");
  const [nbCard, setNbCard] = useState(1);
  const [showOwners, setShowOwners] = useState(false); // État pour afficher le pop-up

  if (!card) return <div>Loading...</div>;
  if (card === "Error") return <div>Error page</div>;

  const { image, name, text, size } = card;

  const handleAssign = () => {
    console.log(`Card assigned to: ${assignTo} (Nb Card: ${nbCard})`);
  };

  const handleSell = () => {
    console.log(`Card sold (Nb Card: ${nbCard})`);
  };

  const toggleOwnersPopup = () => {
    setShowOwners(!showOwners);
  };

  return (
    <div className={classes.container}>
      <h1>
        {name}
        {isOwner && (
          <button className={classes.button} onClick={toggleOwnersPopup}>
            Show Owners
          </button>
        )}
      </h1>
      <div className={classes.cardOwnersSection}>
        <div className={classes.card}>
          <Icon name={name} text={text} img={image} size={size} />
        </div>
      </div>

      <div className={classes.form}>
        <div className={classes.quantityField}>
          <label className={classes.label}>Quantity</label>
          <input
            type="number"
            placeholder="Nb de cartes"
            value={nbCard}
            min="1"
            onChange={(e) => setNbCard(Number(e.target.value))}
          />
        </div>

        {isOwner ? (
          <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
            <div className={classes.assignField}>
              <label className={classes.label}>Assign to</label>
              <input
                type="text"
                placeholder="key of assignment"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              />
            </div>
            <button className={classes.button} type="button" onClick={handleAssign}>
              Assign
            </button>
          </form>
        ) : (
          <button className={classes.button} onClick={handleSell}>
            Sell
          </button>
        )}
        
        {/* Pop-up des propriétaires */}
        {showOwners && (
          <div className={classes.overlay} onClick={toggleOwnersPopup}>
            <div className={classes.modal}>
              <h2>Owners</h2>
              <div className={classes.ownerList}>
                {cardOwners.length ? (
                  cardOwners.map((owner) => (
                    <p key={owner.id}>
                      {owner.name} - {owner.cardCount} cards
                    </p>
                  ))
                ) : (
                  <p>No owners found</p>
                )}
              </div>
              <button className={classes.closeButton} onClick={toggleOwnersPopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;