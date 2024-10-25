import React from 'react'
import Cards from '../Components/Cards'
import Titre from '@/Components/Titre';

interface ManagerCardsProps {
    isOwner?: boolean;
  }
  
const ManagerCards: React.FC<ManagerCardsProps> = ({ isOwner = false }) => {
    
    return (
        <div>
            <Titre text="Collection Cards" color="rebeccapurple" />
            <Cards isOwner={isOwner} />
        </div>
    )
}

export default ManagerCards