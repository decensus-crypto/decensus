import { ethers } from "hardhat";

async function main() {
  const FormCollectionFactory = await ethers.getContractFactory(
    "FormCollectionFactory"
  );

  const formCollectionFactory = await FormCollectionFactory.deploy();

  console.log("deploying....");

  await formCollectionFactory.deployed();
  console.log(
    "FormCollectionFactory deployed to:",
    formCollectionFactory.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
