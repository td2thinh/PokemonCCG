import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {

  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}

export const App = () => {
  const wallet = useWallet()

  useEffect(() => {
    console.log("New  Created:", name, "with card count:");

    if (!wallet || !wallet.contract) return; // Assurez-vous que le portefeuille et le contrat sont disponibles

    const { contract } = wallet;

    // Écoute l'événement "CollectionCreated"
    contract.on("CollectionCreated", (name: string, cardCount: number) => {
      console.log("New truc Created:", name, "with card count:", cardCount.toString());
      // Vous pouvez aussi afficher un message dans l'interface si nécessaire
      // alert(`New Collection Created: ${name} with card count: ${cardCount.toString()}`);
    });

    console.log("Listening for CollectionCreated events...");

    // Fonction de nettoyage pour éviter les fuites de mémoire
    // return () => {
    //   contract.off("CollectionCreated"); // Déconnexion de l'événement
    // };
  }, [wallet]); // Dépendance sur le portefeuille


  return (
    <div className={styles.body}>
      <h1>Welcome to Pokémon TCG</h1>
      
    </div>
  )
}
