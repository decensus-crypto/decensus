import chalk from "chalk";
import { ethers } from "hardhat";

async function main() {
  const FormCollectionFactory = await ethers.getContractFactory(
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
