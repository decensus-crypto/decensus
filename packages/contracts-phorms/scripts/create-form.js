const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
const chalk = require("chalk");
//import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
//import { providers, Wallet } from "ethers";

const { getMerkleTreeRootHash } = require("./whitelist.js")
const { getPublicKey } = require("./cryptography.js")


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Manually copy the form collection factory address
  const formCollectionFactoryAddress = "0xEE19c51c724705CC3147CAd3015691a26b34372d";
  console.log(chalk.blue("FormCollectionFactory deployed to:", formCollectionFactoryAddress));

  const formCollectionFactory = await hre.ethers.getContractAt("FormCollectionFactory", formCollectionFactoryAddress);

  // get root hash
  rootHash = await getMerkleTreeRootHash();
  const formCollection = await formCollectionFactory.createFormCollection("Form test title", "From test description", ["question1", "question2???"], rootHash);

  // get form address
  const receipt = await formCollection.wait();
  const form_creator_pubkey = getPublicKey(receipt.tx_hash)
  const receipt_address = receipt.events.find(el => el !== undefined)
  console.log(chalk.blue("New form created at", receipt_address.address));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
