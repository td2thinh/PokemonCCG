import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';

type Canceler = () => void;

const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>();
  useEffect(() => {
    asyncEffect()
      .then((canceler) => (cancelerRef.current = canceler))
      .catch((error) => console.warn('Uncaught error', error));
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current();
        cancelerRef.current = undefined;
      }
    };
  }, dependencies);
};

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>();
  const [contract, setContract] = useState<main.Main>();

  useAffect(async () => {
    const details_ = await ethereum.connect('metamask');
    if (!details_) return;
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) return;
    setContract(contract_);
  }, []);

  return useMemo(() => {
    if (!details || !contract) return;
    return { details, contract };
  }, [details, contract]);
};

export const App = () => {
  const wallet = useWallet();

  // Fonction pour créer une nouvelle collection
  const handleCreateCollection = async () => {
    if (wallet) {
      try {
        await wallet.contract.createCollection('New Collection', 10, {
          from: wallet.details.account 
        });
        console.log('Collection created successfully!');
      } catch (error) {
        console.error('Failed to create collection:', error);
      }
    }
  };

  return (
    <div className={styles.body}>
      <h1>Welcome to Pokémon TCG</h1>
      {wallet ? (
        <>
          {/* Utiliser wallet.details.account au lieu de wallet.details.address */}
          <p>Connected wallet: {wallet.details.account}</p>
          <button onClick={handleCreateCollection}>Create Collection</button>
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};