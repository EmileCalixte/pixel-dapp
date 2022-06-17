const main = async () => {
    const PixelCoin = await ethers.getContractFactory("PixelCoin");
    const pixelCoin = await PixelCoin.deploy();

    console.log("PixelCoin deployed to: ", pixelCoin.address);
}

(async () => {
    try {
        await main();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
