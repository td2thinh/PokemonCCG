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
  checkbox: {
    marginTop: "10px",
    textAlign: "center",
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
});

export default useStyles;