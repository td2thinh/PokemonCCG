import Titre from '@/Components/Titre'
import Market from '@/Components/Market'
import React from 'react'

function Marketplace() {
    return (
        <div>
            <Titre text="Marketplace" color="rebeccapurple" />
            < Market isOwner={false} />
         </div>
    )
}

export default Marketplace