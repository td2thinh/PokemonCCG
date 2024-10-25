import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useParams } from "react-router-dom";

// Simulate a function to fetch booster details by ID
const fetchBoosterById = (id: string) => {
  // Simulated data
  const boosters = [
    { id: "1", imageUrl: "https://images.pokemontcg.io/swsh4/1.png", cardCount: 5, price: 10, inSell: false },
    { id: "2", imageUrl: "https://images.pokemontcg.io/swsh4/2.png", cardCount: 10, price: 20, inSell: true },
    { id: "3", imageUrl: "https://images.pokemontcg.io/swsh4/3.png", cardCount: 15, price: 30, inSell: true },
    { id: "4", imageUrl: "https://images.pokemontcg.io/swsh4/4.png", cardCount: 20, price: 40, inSell: false },
    { id: "5", imageUrl: "https://images.pokemontcg.io/swsh4/5.png", cardCount: 25, price: 50, inSell: false },
  ];

  // Find the booster by id
  return boosters.find((booster) => booster.id === id) || null;
};

// Define the styles
const useStyles = createUseStyles({
  container: {
    maxWidth: "300px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  details: {
    marginTop: "15px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px", // Space between buttons
  },
  button: {
    padding: "10px 20px",
    width: "100px", // Set fixed width for buttons
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  cancelButton: {
    padding: "10px 20px",
    width: "105px", // Set fixed width for buttons
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  },
  redeemButton: {
    marginTop: "10px",
    padding: "10px 20px",
    width: "100px", // Ensure all buttons have the same width
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#218838",
    },
  },
});

function BoosterDetails() {
  const classes = useStyles();
  const [booster, setBooster] = useState<{ imageUrl: string; cardCount: number; price: number; inSell: boolean } | null>(null);
  const { id } = useParams<{ id: string }>();

  // Fetch booster details when the component mounts
  useEffect(() => {
    const fetchedBooster = fetchBoosterById(id || "");
    if (fetchedBooster) {
      setBooster(fetchedBooster);
    }
  }, [id]);

  const handleSell = () => {
    console.log("Booster sold!");
    if (booster) {
      setBooster({ ...booster, inSell: true });
    }
  };

  const handleCancelSale = () => {
    console.log("Sale canceled!");
    if (booster) {
      setBooster({ ...booster, inSell: false });
    }
  };

  const handleRedeem = () => {
    console.log("Booster redeemed!");
  };

  if (!booster) {
    return <div>Loading booster details...</div>;
  }

  return (
    <div className={classes.container}>
      <img src={booster.imageUrl} alt="Booster" className={classes.image} />
      <div className={classes.details}>
        <p><strong>Card Count:</strong> {booster.cardCount}</p>
        <p><strong>Price:</strong> ${booster.price}</p>
      </div>

      {/* Grouping Sell/Cancel Sale and Redeem button */}
      <div className={classes.buttonGroup}>
        {booster.inSell ? (
          <button className={classes.cancelButton} onClick={handleCancelSale}>
            Cancel Sale
          </button>
        ) : (
          <button className={classes.button} onClick={handleSell}>
            Sell
          </button>
        )}
      </div>
      <button className={classes.redeemButton} onClick={handleRedeem}>
        Redeem
      </button>
    </div>
  );
}

export default BoosterDetails;