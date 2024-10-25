import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'

const deployer: DeployFunction = async hre => {
  if (hre.network.config.chainId !== 31337) return
  const { deployer } = await hre.getNamedAccounts()
  const { deploy, log } = hre.deployments
  console.log('Deploying contracts with the account:', deployer)

  const mainDeployment = await deploy('Main', {
    from: deployer,
    args: [deployer], // Pass the deployer as the owner
    log: true,
  })
  const mainAddress = mainDeployment.address
  console.log('Main deployed at:', mainAddress)
}

export default deployer
