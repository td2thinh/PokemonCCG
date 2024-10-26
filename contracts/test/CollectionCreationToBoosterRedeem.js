const { expect } = require("chai");

async function setup() {
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    // Get the contract factory
    const Main = await ethers.getContractFactory("Main");

    // Deploy the contract and wait for deployment
    const main = await Main.deploy(owner.address);

    // No need for await main.deployed() in newer versions of ethers
    // Instead, wait for the deployment transaction
    await main.deployed();

    // Create collection
    const createCollectionTx = await main.connect(owner).createCollection(
        "Collection 1",
        "https://www.collection1.com",
        "3",
        ["Poke1", "Poke2", "Poke3"]
    );
    await createCollectionTx.wait();

    // Mint and assign
    const mintTx = await main.connect(owner).mintAndAssign(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        0,
        "Poke1"
    );
    await mintTx.wait();

    // Create booster
    const boosterTx = await main.connect(owner).createBooster(
        "Booster 1",
        "https://www.booster1.com",
        0,
        2,
        600000000000,
    );
    await boosterTx.wait();
    return { main, owner, addr1, addr2 };
}

describe("CollectionToBoosterRedeem", function () {
    let main, owner, addr1, addr2;

    beforeEach(async function () {
        const setupData = await setup();
        main = setupData.main;
        owner = setupData.owner;
        addr1 = setupData.addr1;
        addr2 = setupData.addr2;
    });
    it("Collection 1 should be created with 3 pokemons", async function () {
        const collection = await main.getCollection(0);
        expect(collection[1]).to.equal("Collection 1");
        expect(collection[2]).to.equal("https://www.collection1.com");
        expect(collection[3].length).to.equal(3);
    });
    it("Should mint and assign Poke1 to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", async function () {
        const owners = await main.getOwners("Poke1");
        expect(owners[0]).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    });
    it("Should create Booster 1 with 2 pokemons", async function () {
        const booster = await main.getBooster(0);
        expect(booster[2]).to.equal("Booster 1");
    });
    it("addr1 should buy 1 booster from owner", async function () {
        const beforeAddress = await main.getOwnerForBooster(0);
        const buyTx = await main.buyBooster(0, addr1.address, { value: 600000000000 });
        await buyTx.wait();
        const afterAddress = await main.getOwnerForBooster(0);
        expect(beforeAddress).to.not.equal(afterAddress);
    });
    it("Should buy one booster and open to get 2 pokemons in the wallet", async function () {
        const buyTx = await main.connect(addr1).buyBooster(0, addr1.address, { value: 600000000000 });
        await buyTx.wait();
        const redeemTx = await main.connect(addr1).redeemBooster(0)
        await redeemTx.wait();
        const pokemons = await main.getOwnedCards(addr1.address);
        expect(pokemons.length).to.equal(2);
    });

});