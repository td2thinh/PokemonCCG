import { createUseStyles } from "react-jss";


const useStyles = createUseStyles({
    // Style pour l'overlay
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    // Style pour la modal
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      borderRadius: "10px",
      zIndex: 1000,
      width: "400px",
      maxWidth: "100%",
      textAlign: "center",
    },
    // Groupe de champs de formulaire
    formGroup: {
      marginBottom: "15px",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
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
    // Style pour le groupe de boutons
    buttons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
    },
    // Style pour le bouton "Close"
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
    // Style pour le bouton "Create"
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
  });
  
  export default useStyles;