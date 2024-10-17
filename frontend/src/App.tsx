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
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    console.log('Trying to connect wallet...');
    const details_ = await ethereum.connect('metamask');
    if (!details_) {
      console.log('No wallet details found.');
      return;
    }
    console.log('Wallet connected:', details_);
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) {
      console.log('Contract initialization failed.');
      return;
    }
    setContract(contract_);
    setIsConnected(true);
    console.log('Contract initialized:', contract_);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return useMemo(() => {
    if (!details) return { isConnected, connectWallet };
    return { details, contract, isConnected, connectWallet };
  }, [details, contract, isConnected]);
};

//----

export const App = () => {
  const wallet = useWallet();

  // Fonction pour créer une nouvelle collection
  const handleCreateCollection = async () => {
    if (wallet && wallet.contract && wallet.details?.account) {
      try {
        const [account] = wallet.details.account
        console.log("Account: ", account)
        // Passe un objet contenant 'from' au lieu de passer l'adresse directement
        await wallet.contract.createCollection('New Collection', 10, {
          from: wallet.details.account, // Utilise l'adresse du compte dans 'from'
        });
        console.log('Collection created successfully!');
      } catch (error) {
        console.error('Failed to create collection:', error);
      }
    } else {
      console.error('Wallet or contract is not available');
    }
  };

  return (
    <div className={styles.body}>
      <h1>Welcome to Pokémon TCG</h1>
      {wallet.isConnected ? (
        <>
          {/* Utiliser wallet.details.account */}
          <p>Connected wallet: {wallet.details?.account}</p>
          <button onClick={handleCreateCollection}>Create Collection</button>
        </>
      ) : (
        <>
          <p>Please connect your wallet</p>
          <button onClick={wallet.connectWallet}>Connect Wallet</button>
        </>
      )}
    </div>
  );
};