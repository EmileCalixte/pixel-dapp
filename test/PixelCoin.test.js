require("@nomiclabs/hardhat-waffle");

const { expect } = require('chai');
const {SignerWithAddress} = require("@nomiclabs/hardhat-ethers/signers");
const {BigNumber} = require("ethers");


describe("PixelCoin contract", () => {

    /** @type {Contract} */
    let pixelCoin;

    /** @type {Contract} */
    let pixelPic;

    /** @type {SignerWithAddress} */
    let owner;

    /** @type {SignerWithAddress[]} */
    let signers;

    beforeEach(async () => {
        [owner, ...signers] = await ethers.getSigners();

        const PixelCoin = await ethers.getContractFactory('PixelCoin', owner);
        pixelCoin = await PixelCoin.deploy();

        const PixelPic = await ethers.getContractFactory("PixelPic", owner);
        pixelPic = await PixelPic.deploy(pixelCoin.address);
    });

    describe("Deployment", () => {
        it("Should assign the total supply of tokens to the owner", async () => {
            const ownerBalance = await pixelCoin.balanceOf(owner.address);
            const totalSupply = await pixelCoin.totalSupply();

            expect(ownerBalance).to.equal(totalSupply);
        });
    });

    describe("Transactions", () => {
        it("Should transfer tokens between accounts", async () => {
            // Transfer 100 tokens from owner to account 0
            {
                const initialOwnerBalance = await pixelCoin.balanceOf(owner.address);

                await pixelCoin.transfer(signers[0].address, 100);
                const account0Balance = await pixelCoin.balanceOf(signers[0].address);

                expect(account0Balance).to.equal(100);

                const ownerBalance = await pixelCoin.balanceOf(owner.address);

                expect(ownerBalance).to.equal(initialOwnerBalance.sub(BigNumber.from(100)));
            }

            // Transfer 60 tokens from account 0 to account 1
            {
                await pixelCoin
                    .connect(signers[0])
                    .transfer(signers[1].address, 60);

                const account1Balance = await pixelCoin.balanceOf(signers[1].address);

                expect(account1Balance).to.equal(60);

                const account0Balance = await pixelCoin.balanceOf(signers[0].address);

                expect(account0Balance).to.equal(40);
            }

            // Transfer 40 tokens from account 0 to account 2
            {
                await pixelCoin
                    .connect(signers[0])
                    .transfer(signers[2].address, 40);

                const account2Balance = await pixelCoin.balanceOf(signers[2].address);

                expect(account2Balance).to.equal(40);

                const account0Balance = await pixelCoin.balanceOf(signers[0].address);

                expect(account0Balance).to.equal(0);
            }
        });

        it("Should fail if sender doesn't have enough tokens", async () => {
            const initialOwnerBalance = await pixelCoin.balanceOf(owner.address);

            // Try to send 1 token from account 0 which has 0 tokens
            await expect(
                pixelCoin
                    .connect(signers[0])
                    .transfer(owner.address, 1)
            ).to.be.revertedWith("Transfer amount exceeds balance");

            const ownerBalance = await pixelCoin.balanceOf(owner.address);

            expect(ownerBalance).to.equal(initialOwnerBalance);
        });
    });

    describe("Allowance", () => {
        it("Should transfer allowed tokens between accounts", async () => {
            const initialOwnerBalance = await pixelCoin.balanceOf(owner.address);
            const initialAccount0Balance = await pixelCoin.balanceOf(signers[0].address);

            await pixelCoin.approve(signers[0].address, 100);

            await pixelCoin
                .connect(signers[0])
                .transferFrom(owner.address, signers[1].address, 60);

            await pixelCoin
                .connect(signers[0])
                .transferFrom(owner.address, signers[2].address, 40);

            const ownerBalance = await pixelCoin.balanceOf(owner.address);
            const account0Balance = await pixelCoin.balanceOf(signers[0].address);
            const account1Balance = await pixelCoin.balanceOf(signers[1].address);
            const account2Balance = await pixelCoin.balanceOf(signers[2].address);

            expect(ownerBalance).to.equal(initialOwnerBalance.sub(100));
            expect(account0Balance).to.equal(initialAccount0Balance);
            expect(account1Balance).to.equal(60);
            expect(account2Balance).to.equal(40);
        });

        it("Should fail if the transfer amount exceeds allowance", async () => {
            const initialOwnerBalance = await pixelCoin.balanceOf(owner.address);

            await pixelCoin.approve(signers[0].address, 100);

            await pixelCoin
                .connect(signers[0])
                .transferFrom(owner.address, signers[1].address, 50);

            await expect(
                pixelCoin
                    .connect(signers[0])
                    .transferFrom(owner.address, signers[1].address, 51)
            ).to.be.revertedWith("Transfer amount exceeds allowance");

            const ownerBalance = await pixelCoin.balanceOf(owner.address);

            expect(ownerBalance).to.equal(initialOwnerBalance.sub(50));
        });

        it("Should fail if the transfer amount exceeds balance of the tokens owner", async () => {
            // First, give 100 tokens to account 0
            await pixelCoin.transfer(signers[0].address, 100);

            expect(await pixelCoin.balanceOf(signers[0].address)).to.equal(100);

            // Approve more than balance to avoid error due to insufficient allowance
            await pixelCoin
                .connect(signers[0])
                .approve(signers[1].address, 1000);

            await expect(
                pixelCoin
                    .connect(signers[1])
                    .transferFrom(signers[0].address, signers[2].address, 101)
            ).to.be.revertedWith("Transfer amount exceeds balance");

            // Balance should be unchanged
            expect(await pixelCoin.balanceOf(signers[0].address)).to.equal(100);
        });
    });

    describe("Test", () => {
        it("Test msg.sender", async () => {
            const msgsender = await pixelPic
                .connect(signers[0])
                .test();

            console.log(`PixelPic address: ${pixelPic.address}`);
            console.log(`Signer address: ${signers[0].address}`);
            console.log(`Returned msg.sender: ${msgsender}`);
        });
    });
});
