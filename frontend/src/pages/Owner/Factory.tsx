import React from 'react';
import Titre from '@/components/Titre';
import Collections from '@/components/Collections';

interface FactoryPageProps {
    isOwner?: boolean;
}

const Factory: React.FC<FactoryPageProps> = ({ isOwner = false }) => {

    return (
        <div>
            <Titre text="Manage all the collections" color="rebeccapurple" />
            <Collections isOwner={isOwner} />
        </div>
    )
}

export default Factory;