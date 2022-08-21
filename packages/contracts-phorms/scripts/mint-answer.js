const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
const chalk = require("chalk");
//import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
//import { providers, Wallet } from "ethers";

const { getProofForAddress, } = require("./whitelist.js")


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');


  // Manually copy the address of the form collection example
  const formCollectionAddress = "0x1606F413c4591Fa0409d8D2C6661BB1e0516c0d6";
  console.log(chalk.blue("FormCollection deployed to:", formCollectionAddress));

  const formCollection = await hre.ethers.getContractAt("FormCollection", formCollectionAddress);

  const signer = await hre.ethers.getSigners();
  proof = await getProofForAddress(signer[0].address);
  console.log(chalk.yellow("Proof for address ", signer[0].address, "is ", proof))
  const formAnswers = await formCollection.submitAnswers(proof, ["answer1", "answer2"]);

  await formAnswers.wait();

  console.log(chalk.blue("Answers submited at", formAnswers));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
