require("dotenv").config({ path: __dirname + "/.env" });

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 8000000000,
    },
    polygon: {
      url: process.env.POLYGON_URL || "",
      accounts: [process.env.PRIVATE_KEY],
    },
    // just for test purpose
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
