import { ethers } from "hardhat";

async function main() {
  const formContract = await ethers.getContractAt(
    "FormCollection",
    process.env.TEST_FORM_ADDRESS || ""
  );

  await formContract.submitAnswers([], "hogehoge").then((tx) => tx.wait());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
