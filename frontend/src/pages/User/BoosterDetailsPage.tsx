import BoosterDetails from '@/components/BoosterDetails'
import Titre from '@/components/Titre'
import React from 'react'


function BoosterDetailsPage({ isOwner = false }) {
    return (
        <div>
            <Titre text={"Booster Details"} color="rebeccapurple" />
            <BoosterDetails isOwner={isOwner} />
        </div>
    )
}

export default BoosterDetailsPage