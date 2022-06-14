require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.14",
    paths: {
        artifacts: './frontend/src/artifacts',
    },
    networks: {
        // For Metamask
        hardhat: {
            chainId: 1337,
        },
    },
};
