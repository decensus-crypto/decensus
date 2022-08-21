import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import {
  getMerkleTree,
  getMerkleTreeRootHash,
  getProofForAddress,
} from "../scripts/utils/cryptography";
import { FormCollection, FormCollectionFactory } from "../typechain-types";

const deployFactory = async () => {
  const Contract = await ethers.getContractFactory("FormCollectionFactory");
  const contract = await Contract.deploy();
  await contract.deployed();
  return contract;
};

let owner: SignerWithAddress;
let randomPerson: SignerWithAddress;
let factoryContract: FormCollectionFactory;
let formContract: FormCollection;
let merkleTree: MerkleTree;
const name = "form name";
const description = "this is a test form";
const questions = "questions";
const merkleTreeUrl = "https://example.com";

describe("form collection", function () {
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    randomPerson = signers[1];
    factoryContract = await deployFactory();

    merkleTree = getMerkleTree([randomPerson.address]);
    const merkleRoot = getMerkleTreeRootHash(merkleTree);
    const res = await factoryContract
      .createFormCollection(
        name,
        description,
        questions,
        merkleRoot,
        merkleTreeUrl
      )
      .then((tx) => tx.wait());

    const createdEvent = res.events?.find(
      (e) => e.event === "FormCollectionCreated"
    );

    const formAddress = createdEvent?.args ? createdEvent.args[0] : "";

    formContract = await ethers.getContractAt("FormCollection", formAddress);
  });

  it("Should have correct form metadata", async () => {
    expect(await formContract.questions()).to.eql(questions);
    expect(await formContract.description()).to.eql(description);
    expect(await formContract.merkleTreeURL()).to.eql(merkleTreeUrl);
  });

  it("Should succeed in submitting answer", async () => {
    const proof = getProofForAddress(randomPerson.address, merkleTree);

    const answers = "this is a sample answer";

    const res2 = await formContract
      .connect(randomPerson)
      .submitAnswers(proof, answers)
      .then((tx) => tx.wait());

    const submittedEvent = res2.events?.find(
      (e) => e.event === "AnswerSubmitted"
    );
    const submittedArgs = submittedEvent?.args ? submittedEvent.args : [];

    expect(submittedArgs[0]).to.eql(randomPerson.address);
    expect(submittedArgs[1]).to.eql(answers);
  });

  it("Should reject answers from non-whitelisted wallet", async () => {
    const proof = getProofForAddress(owner.address, merkleTree);

    const answers = "this is a sample answer";

    await expect(
      formContract.connect(owner).submitAnswers(proof, answers)
    ).to.rejectedWith();
  });
});
