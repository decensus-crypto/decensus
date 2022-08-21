const { ethers } = require("ethers");
const { MerkleTree } = require('merkletreejs');
const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
const chalk = require("chalk");
//import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
//import { providers, Wallet } from "ethers";
//
whitelistAddresses = [
  "0x75F35FB2E4bc6034D2308e9Ba46C2ceF41427367",
  "0x236669e8C6292B2B6BdD6b19a3a30F5474427892",
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
]


function getProofForAddress(address) {
  const leafNodes = whitelistAddresses.map((addr) => ethers.utils.keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true });
  return merkleTree.getHexProof(ethers.utils.keccak256(address));
}


function getMerkleTreeRootHash() {
  const leafNodes = whitelistAddresses.map((addr) => ethers.utils.keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true });
  const rootHash = '0x' + merkleTree.getRoot().toString('hex')
  return rootHash;

}

class PhormAnswer {
  constructor(answers, encrypt = false) {
    this.answers = answers;
    this.encrypt = encrypt;
  }

  getEncoded() {
    // return btoa(JSON.stringify(this.answers));
  }
}



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');


  // We get the contract to deploy
  const FormCollectionFactory = await hre.ethers.getContractFactory("FormCollectionFactory");
  const FormCollection = await hre.ethers.getContractFactory("FormCollection");
  const formCollectionFactory = await FormCollectionFactory.deploy();

  await formCollectionFactory.deployed();
  console.log(chalk.blue("FormCollectionFactory deployed to:", formCollectionFactory.address));

  // rootHash = await getMerkleTreeRootHash();
  // const questions = btoa(JSON.stringify(['Q1', 'Q2']));
  // const formCollection = await formCollectionFactory.createFormCollection("test title", "test description", questions, rootHash);
  // // rootHash = await getMerkleTreeRootHash();
  // const questions = Buffer.from(JSON.stringify(['Q1', 'Q2'])).toString('base64')
  // const questions = btoa(JSON.stringify(['Q1', 'Q2']));
  // const formCollection = await formCollectionFactory.createFormCollection("test title", "test description", questions, '0x360f0b8f0f0cfe60ae63b20d1dbdc8b2bf9fc5cdc00d9e42a49123c4a8254c4b', 'https://www.google.com');

  // let receipt = await formCollection.wait();

  // const formCollectionCreatedEvent = receipt.events.filter((x) => { return x.event == "FormCollectionCreated" })[0]

  // const deployedFormCollectionAddr = formCollectionCreatedEvent.args[0]

  // console.log(chalk.blue("New form created at", deployedFormCollectionAddr));
  // let deployedForm = await hre.ethers.getContractAt("FormCollection", deployedFormCollectionAddr);
  // console.log(await deployedForm.name());

  // const proof = getProofForAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

  // const answer = new PhormAnswer(['my answer']);
  // await deployedForm.submitAnswers(proof, answer.getEncoded())

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
