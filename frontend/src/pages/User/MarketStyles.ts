import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  cashoutSection: {
    position: 'fixed',
    top: '110px',
    right: '67px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(34, 34, 34, 0.2)',
    zIndex: 1000,
  },
  gainLabel: {
    marginRight: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  cashoutButton: {
    padding: '8px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
  ul: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    listStyleType: 'none',
    maxWidth: '1400px',
    padding: 0,
    margin: '0 auto',
    '@media (max-width: 767px)': {
      '& a': {
        width: '50%',
      },
    },
  },
  li: {
    margin: '1rem',
    padding: '1rem',
    transition: '0.2s all',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      transform: 'scale(1.05)',
      cursor: 'pointer',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
  },
  img: {
    width: '200px',
    borderRadius: '8px',
    '@media (max-width: 767px)': {
      width: '100%',
    },
  },
  button: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },

  cancelButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
})

export default useStyles
