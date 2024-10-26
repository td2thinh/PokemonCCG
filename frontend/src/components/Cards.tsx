import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { Img } from "react-image";
import useStyles from "./CardsStyles";
import ModalManager from "./CardsManager"; // Import du composant
import { useWalletContext } from "@/contexts/WalletContext";
import axios from "axios";
import { PokemonCard } from "@/interfaces/card";

interface CardsProps {
  isOwner: boolean; // Nouveau paramètre pour indiquer si l'utilisateur est propriétaire
}



const Cards: React.FC<CardsProps> = ({ isOwner }) => {
  const { ClId } = useParams<{ ClId: string }>();
  const collectionId = parseInt(ClId!);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const wallet = useWalletContext();
  const { pathname } = useLocation();
  const classes = useStyles();
  useEffect(() => {
    const fetchCollection = async () => {
      if (!wallet.contract) {
        console.error("Wallet contract is not initialized");
        return;
      }
      const collection = await wallet.contract.getCollection(collectionId).then((collection: any) => {
        collection[3].forEach((cardId: string) => {
          axios.get(`https://api.pokemontcg.io/v2/cards/${cardId}`)
            .then((card: any) => {
              const pokemonCard: PokemonCard = {
                name: card.data.data.name,
                id: card.data.data.id,
                image: card.data.data.images.small,
                text: card.data.data.text,
              };
              setCards((prevCards) => [...prevCards, pokemonCard]);
            }
            );
        });
      });
    }
    fetchCollection();
    return () => {
      setCards([]);
    }
  }, []);
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

  const handleAssign = async () => {
    const pokemonIds = selectedCards.flatMap((cardId) =>
      Array(formData[cardId]?.nbCard || 1).fill(cardId)
    );
    const mintTx = await wallet.contract?.mintAndAssignBatch(
      assignTo,
      collectionId,
      pokemonIds
    );
    console.log("Mint transaction:", mintTx);

    handleCloseModal();
  };

  // // Vérifie si les cartes sont bien chargées
  // if (!cards.length) {
  //   console.log("No cards available");
  //   return <Skeleton count={10} />;
  // }

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
              <label> Pick {name}</label>
            </div>
          </li>
        ))}
      </ul>

      {selectedCards.length > 0 && (
        <button className={classes.managerButton} onClick={handleOpenModal}>
          Mint ({selectedCards.length})
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