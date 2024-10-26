import React from 'react'
import Cards from '../components/Cards'
import Titre from '@/components/Titre';

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