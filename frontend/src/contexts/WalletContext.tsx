import React, { createContext, useContext } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

// Define the type for our wallet context
type WalletContextType = {
  details?: ethereum.Details
  contract?: main.Main
  isConnected: boolean
  connectWallet: () => Promise<void>
}

// Create the context with a default value
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  connectWallet: async () => { },
})

// Custom hook to use the wallet context
export const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    console.log('Trying to connect wallet...')
    const details_ = await ethereum.connect('metamask')
    if (!details_) {
      console.log('No wallet details found.')
      return
    }
    console.log('Wallet connected:', details_)
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) {
      console.log('Contract initialization failed.')
      return
    }
    setContract(contract_)
    setIsConnected(true)
    console.log('Contract initialized:', contract_)
  }

  useEffect(() => {
    connectWallet()
  }, [isConnected])

  return useMemo(() => {
    if (!details) return { isConnected, connectWallet }
    return { details, contract, isConnected, connectWallet }
  }, [details, contract, isConnected])
}

// Create the provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const wallet = useWallet()

  useEffect(() => {
    if (wallet.isConnected) {
      const cancelAccountsChanged = ethereum.accountsChanged(() => {
        wallet.connectWallet()
      })
      const cancelChainChanged = ethereum.chainChanged(() => {
        wallet.connectWallet()
      })
      return () => {
        cancelAccountsChanged()
        cancelChainChanged()
      }
    }
  }, [wallet.isConnected])

  useEffect(() => {
    if (!wallet.contract) return
    const contract = wallet.contract

    contract.on('CardsUnpacked', (pokemonIds: string[]) => {
      console.log('CardsUnpacked event:', pokemonIds)
    })

    return () => {
      contract.off('CardsUnpacked')
    }
  }, [wallet.contract])

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  )
}

// Custom hook to use the wallet context
export const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}
