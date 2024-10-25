import * as main from '@/lib/main';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';


const handleCreateCollection = async (contract: main.Main, name: string, imgURL: string, cardCount: number, pokemonIds: string[]) => {
    const tx = await contract.createCollection(name, imgURL, cardCount, pokemonIds);
    console.log('Transaction:', tx);
};

const handleCreateCard = async (contract: main.Main, to: string, collectionId: string, pokemonId: string) => {
    const tx = await contract.mintAndAssign(to, collectionId, pokemonId);
    console.log('Transaction:', tx);
};

const handleCreateBooster = async (contract: main.Main, name: string, imgURL: string, collectionId: string, cardCount: number, price: number) => {
    const tx = await contract.createBooster(name, imgURL, collectionId, cardCount, price);
    console.log('Transaction:', tx);
}
const handleApproveBooster = async (contract: main.Main, boosterId: string) => {
    const tx = await contract.approveBooster(boosterId);
    console.log('Transaction:', tx);
}



function Factory({ contract }: { contract: main.Main }) {
    return (
        <>
            <Button variant="contained" color="primary" onClick={() => handleCreateCollection(contract, 'My Collection', "https://example.org", 3, ['1', '2', '3'])}>
                Create Collection
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleCreateCard(contract, "0xcd3B766CCDd6AE721141F452C550Ca635964ce71", '0', '1')}>
                Create Card
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleCreateBooster(contract, 'My Booster', "https://example.org", '0', 2, 600000000000)}>
                Create Booster
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApproveBooster(contract, '0')}>
                Approve Booster
            </Button>

        </>
    );
}

export default Factory