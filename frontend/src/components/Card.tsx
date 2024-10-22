import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { useParams } from "react-router-dom";
import Icon from "./Icon";
import useCard from "../Hooks/useCard";

const useStyles = createUseStyles({
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "10px",
    textAlign: "center",
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
  quantityField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Centrer horizontalement
    marginBottom: "10px",
  },
  label: {
    marginRight: "25px", // Espacement entre le label et l'input
    fontWeight: "bold",
	width: "100px",
  },
  assignField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Centrer horizontalement
    marginBottom: "10px",
  },
});

const Card = ({ isOwner }: { isOwner: boolean }) => {
  const { id } = useParams();
  const classes = useStyles();
  const { card } = useCard(id);
  const [assignTo, setAssignTo] = useState("");
  const [nbCard, setNbCard] = useState(1); // Nombre de cartes souhaité

  if (!card) return <div>Loading...</div>;
  if (card === "Error") return <div>Error page</div>;

  const { image, name, text, size } = card;

  const handleAssign = () => {
    console.log(`Card assigned to: ${assignTo} (Nb Card: ${nbCard})`);
  };

  const handleSell = () => {
    console.log(`Card sold (Nb Card: ${nbCard})`);
  };

  return (
    <div className={classes.container}>
      <h1>{name}</h1>
      <div className={classes.card}>
        <Icon name={name} text={text} img={image} size={size} />
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
      </div>
    </div>
  );
};

export default Card;