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
        addr1.address,
        0,
        "Poke1"
    );
    await mintTx.wait();

    return { main, owner, addr1, addr2 };
}

describe("Marketplace Functions tests", function () {
    let main, owner, addr1, addr2;

    beforeEach(async function () {
        const setupData = await setup();
        main = setupData.main;
        owner = setupData.owner;
        addr1 = setupData.addr1;
        addr2 = setupData.addr2;
    });
    it("Address 1 should be able to list Poke1", async function () {
        await main.connect(addr1).listItem(0, 600000000000);
        const listings = await main.getAllListings();
        expect(listings[2][0]).to.equal(addr1.address);
        expect(listings[3][0]).to.equal("Poke1");
    });
    it("Address 1 should be able to update the price of Poke1", async function () {
        await main.connect(addr1).listItem(0, 600000000000);
        await main.connect(addr1).updateListing(0, 100)
        const listings = await main.getAllListings();
        expect(listings[1][0]).to.equal(100);
    });
    it("Address 2 should buy Poke1", async function () {
        await main.connect(addr1).listItem(0, 600000000000);
        await main.connect(addr1).updateListing(0, 1000000000000)
        const listings = await main.getAllListings();
        await main.connect(addr2).buyItem(0, { value: 1000000000000 })
        const ownerAddy = await main.ownerOf(0);
        expect(ownerAddy).to.equal(addr2.address);
    });

});