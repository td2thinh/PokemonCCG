import React from 'react';
import Card from "../Components/Card";
import Titre from '@/Components/Titre';
import Collections from '@/Components/Collections';

interface FactoryPageProps {
    isOwner?: boolean;
  }
  
const Factory: React.FC<FactoryPageProps> = ({ isOwner = false }) => {
  
    return (
        <div>
            <Titre text="Bienvenue sur la page d'accueil" color="rebeccapurple" />
            < Collections isOwner={isOwner} id={""} />
        </div>
    )
}

export default Factory;