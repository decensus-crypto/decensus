const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
const chalk = require("chalk");
// import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
// import { providers, Wallet } from "ethers";

const { getMerkleTreeRootHash } = require("./whitelist.js");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const FormCollectionFactory = await hre.ethers.getContractFactory(
    "FormCollectionFactory"
  );

  const formCollectionFactory = await FormCollectionFactory.deploy();

  console.log("deploying....");

  await formCollectionFactory.deployed();
  console.log(
    chalk.blue(
      "FormCollectionFactory deployed to:",
      formCollectionFactory.address
    )
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
