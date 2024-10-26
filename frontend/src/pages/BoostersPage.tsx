import React from 'react';
import Titre from '@/components/Titre';
import Boosters from '@/components/Boosters';

interface FactoryPageProps {
    isOwner?: boolean;
}

function BoostersPage({ isOwner = false }: FactoryPageProps) {

    return (
        <div>
            <Titre text="Create Booster Packs for sale" color="rebeccapurple" />
            <Boosters isOwner={isOwner} />
        </div>
    )
}

export default BoostersPage;