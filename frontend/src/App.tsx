import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import NavBar from './components/NavBar';
import * as main from '@/lib/main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ManagerCards from './pages/Owner/ManagerCards';
import FactoryPage from './pages/Owner/Factory';
import Marketplace from './pages/User/Marketplace';
import ManagerCard from './pages/Owner/ManagerCard';
import CollectionUser from './pages/User/Collection';
import BoostersPage from './pages/Owner/BoostersPage';
import BoosterDetails from './pages/User/BoosterDetailsPage';
import BoosterUser from './pages/User/Boosters';
import BoosterStore from './pages/User/Store';
import { WalletProvider, useWalletContext } from './contexts/WalletContext';

const userPages = [
  { name: 'Cards', link: '/cards' },
  { name: 'Boosters', link: '/booster' },
  { name: 'Store', link: '/store' },
  { name: 'Marketplace', link: '/marketplace' },
];

const ownerPages = [
  { name: 'Factory', link: '/factory' },
  { name: 'Booster', link: '/booster' },
];

const getDeployerAddress = async (contract: main.Main) => {
  const deployerAddress = await contract.getDeployer();
  return deployerAddress;
};

const AppContent = () => {
  const wallet = useWalletContext();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (wallet.contract) {
      getDeployerAddress(wallet.contract).then((deployerAddress) => {
        setIsOwner(wallet.details?.account == deployerAddress);
      });
    }

  }, [wallet.contract]);

  if (!wallet.isConnected) {
    return (
      <BrowserRouter>
        <NavBar pages={userPages} />
        <div className={styles.container}>
          <h1>Connect Wallet</h1>
          <button onClick={wallet.connectWallet}>Connect Wallet</button>
        </div>
      </BrowserRouter>
    );
  }


  return (
    <div className={styles.container}>
      <BrowserRouter>
        <NavBar pages={isOwner ? ownerPages : userPages} />
        <Routes>
          {isOwner ? (
            <>
              <Route path="/booster" element={<BoostersPage isOwner={isOwner} />} />
              <Route path="/booster/:id" element={<BoosterDetails isOwner={isOwner} />} />
              <Route path="/factory" element={<FactoryPage isOwner={isOwner} />} />
              <Route path="/factory/:ClId" element={<ManagerCards isOwner={isOwner} />} />
              <Route path="/factory/:ClId/:CrId" element={<ManagerCard isOwner={isOwner} />} />
              <Route path='/' element={<FactoryPage isOwner={isOwner} />} />
            </>
          ) : (
            <>
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/store" element={<BoosterStore />} />
              <Route path="/" element={<CollectionUser />} />
              <Route path="/cards" element={<CollectionUser />} />
              <Route path="/booster" element={<BoosterUser />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export const App = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};