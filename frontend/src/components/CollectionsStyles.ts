import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  ul: {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    justifyContent: "center",
    listStyleType: "none",
    maxWidth: "1400px",
    padding: 0,
    margin: "0 auto",
    "@media (max-width: 767px)": {
      "& a": {
        width: "50%",
      },
    },
  },
  li: {
    margin: "0.25rem",
    padding: "0.5rem",
    transition: "0.2s all",
    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer",
    },
  },
  img: {
    width: "230px",
    "@media (max-width: 767px)": {
      width: "100%",
    },
  },
  managerButton: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  // Styles for the modal and form
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
  scrollableList: {
    maxHeight: "200px", // Hauteur limite pour la zone défilable
    overflowY: "auto", // Scroll vertical
    marginBottom: "20px", 
  },
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
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "left",
    marginBottom: "10px",
  },
});

export default useStyles;