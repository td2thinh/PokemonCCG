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
  const mainContract = await hre.ethers.getContractAt('Main', mainAddress)
  await mainContract.deployed()
  const owner = await hre.ethers.getSigner(deployer)
  await mainContract
    .connect(owner)
    .createCollection(
      'Base Set',
      'https://www.pokecardex.com//assets/images/sets/BS/decks/Decouverte.png',
      10,
      [
        'base1-1',
        'base1-2',
        'base1-3',
        'base1-4',
        'base1-5',
        'base1-6',
        'base1-7',
        'base1-8',
        'base1-9',
        'base1-10',
      ]
    )

  await mainContract
    .connect(owner)
    .createBooster(
      'Base Set Booster',
      'https://www.pokecardex.com//assets/images/sets/BS/boosters/340px-Set_Base_Charizard_FR.jpg',
      0,
      3,
      hre.ethers.utils.parseEther('0.1')
    )
  await mainContract
    .connect(owner)
    .createBooster(
      'Base Set Booster',
      'https://www.pokecardex.com//assets/images/sets/BS/boosters/344px-Set_Base_Venusaur_FR.jpg',
      0,
      3,
      hre.ethers.utils.parseEther('0.1')
    )
  await mainContract
    .connect(owner)
    .createBooster(
      'Base Set Booster',
      'https://www.pokecardex.com//assets/images/sets/BS/boosters/337px-Set_Base_Blastoise_FR.jpg',
      0,
      3,
      hre.ethers.utils.parseEther('0.1')
    )
  await mainContract
    .connect(owner)
    .mintAndAssign('0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 0, 'base1-1')
  await mainContract.connect(owner).mintAndAssign(owner.address, 0, 'base1-1')
  await mainContract
    .connect(owner)
    .listItem(1, hre.ethers.utils.parseEther('0.1'))
  await mainContract
    .connect(owner)
    .mintAndAssign('0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 0, 'base1-2')
  const myAddress = await hre.ethers.getSigner(
    '0xcd3B766CCDd6AE721141F452C550Ca635964ce71'
  )
  await mainContract.connect(myAddress).buyBooster(0, myAddress.address, {
    value: hre.ethers.utils.parseEther('0.1'),
  })
  await mainContract
    .connect(myAddress)
    .listItem(2, hre.ethers.utils.parseEther('0.1'))
  console.log('Main deployed at:', mainAddress)
}

export default deployer
