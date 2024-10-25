import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useCards from "../Hooks/useCards.tsx";
import useStyles from "./MarketStyles";

interface CardsProps {
  isOwner: boolean;
}

const Market: React.FC<CardsProps> = ({ isOwner }) => {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const classes = useStyles();
  const { cards } = useCards(id);
  const [newPrice, setNewPrice] = useState<{ [key: string]: number }>({});
  const [selectedCard, setSelectedCard] = useState<{ id: string, name: string } | null>(null);
  const [gain, setGain] = useState<number>(30); // met a jour ici le "gain" qu'il a reçu apres qu'il ai pu vendre une carte
  const [showCashout, setShowCashout] = useState<boolean>(true);

  useEffect(() => {
    // Met à jour l'affichage du bouton "Encaisser" en fonction de la valeur du gain
    if (gain === 0) {
      setShowCashout(false);
    } else {
      setShowCashout(true);
    }
  }, [gain]);

  const openModal = (cardId: string, cardName: string) => {
    setSelectedCard({ id: cardId, name: cardName });
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const handlePriceChange = (value: number) => {
    setNewPrice((prevData) => ({
      ...prevData,
      [selectedCard!.id]: value,
    }));
  };

  const handleUpdatePrice = () => {
    console.log(`Updating price for card: ${selectedCard!.name} to ${newPrice[selectedCard!.id]}`);
    closeModal();
  };

  const handleBuy = (cardId: string) => {
    console.log(`Buying card: ${cardId}`);
  };

  const handleCancelSell = (cardId: string) => {
    console.log(`Cancel selling card: ${cardId}`);
  };

  if (!cards.length) {
    return <Skeleton count={10} />;
  }

  return (
    <Fragment>
      {/* affiche le bouton "Encaisser" seulement si le gain est supérieur à 0 */}
      {showCashout && (
        <div className={classes.cashoutSection}>
          <label className={classes.gainLabel}>Gain: ${gain}</label>
          <button className={classes.cashoutButton} onClick={() => setGain(gain-5)}>
          Collect 
          </button>
        </div>
      )}

      <ul className={classes.ul}>
        {cards.map(({ id, image, name, price, isMine }) => (
          <li key={id} className={classes.li}>
            <Link to={`${pathname}/${id}`}>
              <Img
                src={image}
                loader={<Skeleton />}
                alt={name}
                className={classes.img}
              />
            </Link>

            <p>Current Price: ${price}</p>

            {isOwner ? (
              <p>{name}</p>
            ) : (
              isMine ? (
                <Fragment>
                  <button className={classes.button} onClick={() => openModal(id, name)}>
                    Update Price
                  </button>
                  <button className={classes.cancelButton} onClick={() => handleCancelSell(id)}>
                    Cancel Sell
                  </button>
                </Fragment>
              ) : (
                <button className={classes.button} onClick={() => handleBuy(id)}>
                  Buy
                </button>
              )
            )}
          </li>
        ))}
      </ul>

      {selectedCard && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <h2>Update {selectedCard.name}</h2>
            <input
              type="number"
              placeholder="New Price"
              value={newPrice[selectedCard.id] || ""}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className={classes.input}
            />
            <div className={classes.modalButtons}>
              <button className={classes.button} onClick={handleUpdatePrice}>
                Validate
              </button>
              <button className={classes.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Market;