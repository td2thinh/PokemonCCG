import Titre from '@/Components/Titre';
import Card from '../Components/Card'

interface ManagerCardProps {
    isOwner?: boolean;
  }
  
const ManagerCard: React.FC<ManagerCardProps> = ({ isOwner = false }) => {
  
    return (
        <div>   
            <Titre text="Pokemon details" color="rebeccapurple" />
            <Card isOwner={isOwner} />
        </div>
    )
}

export default ManagerCard