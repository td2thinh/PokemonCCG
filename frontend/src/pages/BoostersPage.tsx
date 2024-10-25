import React from 'react';
import Titre from '@/Components/Titre';
import Boosters from '@/Components/Boosters';

interface FactoryPageProps {
    isOwner?: boolean;
  }
  
function BoostersPage() {
  
    return (
        <div>
            <Titre text="Booster " color="rebeccapurple" />
            < Boosters isOwner={true} id={""} />
        </div>
    )
}

export default BoostersPage;