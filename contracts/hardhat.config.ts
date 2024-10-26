import 'dotenv/config'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'hardhat-abi-exporter'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20', // any version you want
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: 'u',
          },
        },
      },
    },
  },
  paths: {
    deploy: './deploy',
    sources: './src',
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 0, // Mine blocks as fast as possible
        mempool: {
          order: 'priority', // Process higher gas price txs first
        },
      },
      // Increase block gas limit if you have complex transactions
      blockGasLimit: 30000000,
      // Allow parallel transaction processing
      allowUnlimitedContractSize: true,
    },
  },
  namedAccounts: {
    deployer: { default: 0 },
    admin: { default: 0 },
    second: { default: 1 },
    random: { default: 8 },
  },
  abiExporter: {
    runOnCompile: true,
    path: '../frontend/src/abis',
    clear: true,
    flat: true,
    only: [],
    pretty: true,
  },
  typechain: {
    outDir: '../typechain',
  },
}

export default config
