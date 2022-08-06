import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import {
  DecensusSurveySubmissionMark,
  ERC721TokenForTest,
} from "../typechain-types";

const deploy = async () => {
  const Contract = await ethers.getContractFactory(
    "DecensusSurveySubmissionMark"
  );
  const contract = await Contract.deploy();
  await contract.deployed();
  return contract;
};

const deployNFT = async () => {
  const Contract = await ethers.getContractFactory("ERC721TokenForTest");
  const contract = await Contract.deploy();
  await contract.deployed();
  return contract;
};

let owner: SignerWithAddress;
let randomPerson: SignerWithAddress;
let chainId: number;
let contract: DecensusSurveySubmissionMark;
let dummyContract: DecensusSurveySubmissionMark;
let nftContract: ERC721TokenForTest;
const surveyId = "sid";

describe("survey submission mark", function () {
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    owner = signers[0];
    randomPerson = signers[1];
    chainId = network.chainId;
    contract = await deploy();
    dummyContract = await deploy();
    nftContract = await deployNFT();
  });

  it("Should succeed in adding survey & mark", async () => {
    await nftContract.mint(owner.address).then((tx) => tx.wait());
    await nftContract.mint(randomPerson.address).then((tx) => tx.wait());

    await contract
      .addSurvey(surveyId, nftContract.address)
      .then((tx) => tx.wait());

    await contract
      .connect(randomPerson)
      .addMark(surveyId)
      .then((tx) => tx.wait());

    expect(await contract.hasMark(randomPerson.address, surveyId)).to.equal(
      true
    );
    expect(await contract.hasMark(owner.address, surveyId)).to.equal(false);
  });

  it("Should fail in adding survey if contract address does not support ERC721", async () => {
    await expect(
      contract.addSurvey(surveyId, dummyContract.address)
    ).to.be.revertedWith("NFT contract does not support ERC721");
  });

  it("Should fail in adding survey if owner does not hold NFT", async () => {
    await expect(
      contract.addSurvey(surveyId, nftContract.address)
    ).to.be.revertedWith("survey owner must hold NFT");
  });

  it("Should fail in adding mark if survey does not exist", async () => {
    await nftContract.mint(owner.address).then((tx) => tx.wait());

    await contract
      .addSurvey(surveyId, nftContract.address)
      .then((tx) => tx.wait());

    await expect(
      contract.connect(randomPerson).addMark("invalid-survey-id")
    ).to.be.revertedWith("survey does not exist");
  });

  it("Should fail in adding mark if survey submitter does not hold NFT", async () => {
    await nftContract.mint(owner.address).then((tx) => tx.wait());

    await contract
      .addSurvey(surveyId, nftContract.address)
      .then((tx) => tx.wait());

    await expect(
      contract.connect(randomPerson).addMark(surveyId)
    ).to.be.revertedWith("survey submitter must hold NFT");
  });
});
