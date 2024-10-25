import React from 'react';
import Titre from '@/Components/Titre';
import Boosters from '@/Components/Boosters';



  interface BoostersPageProps {
    isOwner?: boolean;
  }
  
  
  
  const BoostersPage: React.FC<BoostersPageProps> = ({ isOwner = false }) => {
  
    return (
        <div>
            <Titre text="Booster " color="rebeccapurple" />
            < Boosters isOwner={isOwner} />
        </div>
    )
}

export default BoostersPage;