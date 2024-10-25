
import React from 'react';
import { Typography } from '@mui/material'; 

interface TitreProps {
  text: string;
  color?: string; // Option pour définir une couleur personnalisée
}

const Titre: React.FC<TitreProps> = ({ text, color = 'black' }) => {
  return (
    <Typography
      variant="h2"
      align="center" 
      sx={{
        fontWeight: 700, 
        letterSpacing: '.2rem', 
        color: color, 
        paddingBottom: '20px', 
        paddingTop: '1.3em' 
        
      }}
    >
      {text}
    </Typography>
  );
};

export default Titre;