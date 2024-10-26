import Titre from '@/components/Titre';
import Card from '../../components/Card'

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