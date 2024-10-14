const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Main Contract", function () {
  let mainContract;

  before(async function () {
    // Déployer le contrat avant de faire les tests
    const Main = await ethers.getContractFactory("Main");
    mainContract = await Main.deploy();
    await mainContract.deployed();
  });

  it("Should create a collection and emit CollectionCreated event", async function () {
    // Appeler la fonction createCollection
    const tx = await mainContract.createCollection("My Collection", 10);

    // Attendre que la transaction soit minée
    await tx.wait();

    // Vérifier que l'événement CollectionCreated a bien été émis
    await expect(tx)
      .to.emit(mainContract, "CollectionCreated")
      .withArgs("My Collection", 10);

    // Ajouter d'autres assertions si nécessaire, comme la vérification du count
  });d
});
