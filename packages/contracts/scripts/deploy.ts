import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory(
    "DecensusProofOfSurveySubmission"
  );
  // token address is hard-coded (MATIC). Should be configurable in the future.
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log("deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
