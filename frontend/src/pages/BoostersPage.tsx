import React from 'react';
import Card from "../Components/Card";
import Titre from '@/Components/Titre';
import Collections from '@/Components/Collections';

interface FactoryPageProps {
    isOwner?: boolean;
  }
  
function BoostersPage() {
  
    return (
        <div>
            <Titre text="Booster " color="rebeccapurple" />
            {/* < Boosters */}
        </div>
    )
}

export default BoostersPage;