require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    polygonZkEvmTestnet: {
      url: process.env.POLYGON_ZKEVM_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
