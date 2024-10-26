import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  // Styles pour le modal et son overlay
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
  // Style pour les éléments de formulaire
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    "& label": {
      marginBottom: "5px",
      fontWeight: "bold",
    },
    "& input": {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
  },
  // Style pour la liste défilable
  scrollableList: {
    maxHeight: "200px", // Limite la hauteur de la liste
    overflowY: "auto", // Ajoute un scroll vertical
    marginBottom: "20px", // Espace en bas
    border: "1px solid #ccc", // Ajoute une bordure pour différencier
    padding: "10px", // Ajoute un padding
  },
  // Style pour chaque ligne de carte dans la liste
  cardRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    "& label": {
      marginLeft: "10px",
    },
  },
  // Styles pour les boutons
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  assignButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  closeButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  },
});

export default useStyles;