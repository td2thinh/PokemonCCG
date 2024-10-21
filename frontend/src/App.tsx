import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';
import NavBar from './components/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Manager from './pages/Owner/Manager';
import Factory from './pages/Owner/Factory';
import OwnerStore from './pages/Owner/OwnerStore';
import Collection from './pages/User/Collection';
import Marketplace from './pages/User/Marketplace';
import UserStore from './pages/User/UserStore';
import { Contract } from 'ethers';
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
  }, [isConnected]);

  return useMemo(() => {
    if (!details) return { isConnected, connectWallet };
    return { details, contract, isConnected, connectWallet };
  }, [details, contract, isConnected]);
};

const handleCreateCollection = async (contract: main.Main, name: string, cardCount: number, pokemonIds: string[]) => {
  const tx = await contract.createCollection(name, cardCount, pokemonIds);
  console.log('Transaction:', tx);
};

const handleCreateCard = async (contract: main.Main, to: string, collectionId: string, pokemonId: string, imageUrl: string) => {
  const tx = await contract.mintAndAssign(to, collectionId, pokemonId, imageUrl);
  console.log('Transaction:', tx);
};

const handleGetCard = async (contract: main.Main, tokenId: string) => {
  const card = await contract.getCard(tokenId);
  console.log('Card:', card);
};

const getDeployerAddress = async (contract: main.Main) => {
  const deployerAddress = await contract.getDeployer();
  return deployerAddress;
};

const userPages = [
  { name: 'Cards', link: '/cards' },
  { name: 'Store', link: '/store' },
  { name: 'Marketplace', link: '/marketplace' },
];

const ownerPages = [
  { name: 'Manager', link: '/manager' },
  { name: 'Factory', link: '/factory' },
  { name: 'Store', link: '/store' },
];

export const App = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.isConnected) {
      const cancelAccountsChanged = ethereum.accountsChanged(() => {
        wallet.connectWallet();
      });
      const cancelChainChanged = ethereum.chainChanged(() => {
        wallet.connectWallet();
      });
      return () => {
        cancelAccountsChanged();
        cancelChainChanged();
      };
    }
  }, [wallet.isConnected]);

  // useEffect(() => {
  //   if (wallet.isConnected) {
  //     console.log('Connected to wallet:', wallet.details);
  //   }
  // }, [wallet.isConnected]);

  const [deployerAddress, setDeployerAddress] = useState<string>();
  useEffect(() => {
    getDeployerAddress(wallet.contract!).then((deployerAddress) => {
      setDeployerAddress(deployerAddress);
    }
    );
   
  }, [wallet.contract]);

  return (
    <>
      {!wallet.isConnected ? (
        <BrowserRouter>
          <NavBar pages={userPages} />
          <div className={styles.container}>
            <h1>Connect Wallet</h1>
            <button onClick={wallet.connectWallet}>Connect Wallet</button>
          </div>
        </BrowserRouter>
      ) : wallet.isConnected && wallet.details?.account == deployerAddress ? (
        <div className={styles.container}>
          <BrowserRouter>
            <NavBar pages={ownerPages} />
            <Routes>
              <Route path="/manager" element={<Manager />} />
              <Route path="/factory" element={<Factory />} />
              <Route path="/store" element={<OwnerStore />} />
            </Routes> 
          </BrowserRouter>
        </div>
      ) : (
        <div className={styles.container}>
          <BrowserRouter>
          <NavBar pages={userPages} />
            <Routes>
              <Route path="/cards" element={<Collection />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/store" element={<UserStore />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
};