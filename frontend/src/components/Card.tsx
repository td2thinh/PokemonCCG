import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { useParams } from "react-router-dom";
import Icon from "./Icon";
import { useWalletContext } from "@/contexts/WalletContext";
import { PokemonCard } from "@/interfaces/card";
import axios from "axios";
import { useEffect } from "react";

const useStyles = createUseStyles({
  container: {
    maxWidth: "400px",
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
  const wallet = useWalletContext();
  const { CrId } = useParams();
  const { ClId } = useParams();
  const collectionId = parseInt(ClId!);
  const id = String(CrId);
  const classes = useStyles();
  const [card, setCards] = useState<PokemonCard | "Error" | null>(null);
  const [cardOwners, setCardOwners] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [nbCard, setNbCard] = useState(1);
  const [showOwners, setShowOwners] = useState(false); // État pour afficher le pop-up

  useEffect(() => {
    axios
      .get(`https://api.pokemontcg.io/v2/cards/${id}`)
      .then((res) => {
        const { data } = res.data;
        setCards({
          name: data.name,
          image: data.images.small,
          id: data.id,
          text: data.flavorText
        });
      })
      .catch((err) => {
        console.error("Error fetching card:", err);
        setCards("Error");
      });

  }, []);



  if (!card) return <div>Loading...</div>;
  if (card === "Error") return <div>Error page</div>;

  const { image, name, text } = card;

  const handleAssign = async () => {
    const pokemonIds = Array(nbCard).fill(id);
    const mintTx = await wallet.contract?.mintAndAssignBatch(assignTo, collectionId, pokemonIds);
    console.log("Mint transaction:", mintTx);
  };

  const handleSell = () => {
    console.log(`Card sold (Nb Card: ${nbCard})`);
  };

  const toggleOwnersPopup = async () => {
    const owners = await wallet.contract.getOwners(id);
    setCardOwners(owners);
    setShowOwners(!showOwners);
  };

  const countOccurrencesAddress = (list: string[]) => {
    let dictionary = {} as { [key: string]: number };
    list.forEach((item) => {
      if (!dictionary[item]) {
        dictionary[item] = 0;
      }
      dictionary[item]++;
    });
    return dictionary;
  }

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
          <Icon name={name} text={text} img={image} size="Large" />
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
              <label className={classes.label}>Address</label>
              <input
                type="text"
                placeholder="Wallet Address to mint to"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              />
            </div>
            <button className={classes.button} type="button" onClick={handleAssign}>
              Mint Card
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
                  Object.entries(countOccurrencesAddress(cardOwners)).map(([address, count]) => (
                    <p key={address}>
                      {address} : {count} cards
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