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
let randomPerson2: SignerWithAddress;
let factoryContract: FormCollectionFactory;
let formContract: FormCollection;
let merkleTree: MerkleTree;
const name = "form name";
const description = "this is a test form";
const formDataURI = "f-uri";
const answerEncryptionKey = "key";
const answerDecryptionKeyURI = "key-uri";

describe("form collection", function () {
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    randomPerson = signers[1];
    randomPerson2 = signers[2];
    factoryContract = await deployFactory();

    merkleTree = getMerkleTree([randomPerson.address, randomPerson2.address]);
    const merkleRoot = getMerkleTreeRootHash(merkleTree);
    const res = await factoryContract
      .createFormCollection(
        name,
        description,
        merkleRoot,
        formDataURI,
        answerEncryptionKey,
        answerDecryptionKeyURI
      )
      .then((tx) => tx.wait());

    const createdEvent = res.events?.find(
      (e) => e.event === "FormCollectionCreated"
    );

    const formAddress = createdEvent?.args ? createdEvent.args[0] : "";

    formContract = await ethers.getContractAt("FormCollection", formAddress);
  });

  it("Should have correct form metadata", async () => {
    expect(await formContract.description()).to.eql(description);
    expect(await formContract.formDataURI()).to.eql(formDataURI);
    expect(await formContract.answerEncryptionKey()).to.eql(
      answerEncryptionKey
    );
    expect(await formContract.answerDecryptionKeyURI()).to.eql(
      answerDecryptionKeyURI
    );
  });

  it("Should succeed in submitting answer", async () => {
    const proof = getProofForAddress(randomPerson.address, merkleTree);

    const encryptedAnswer = "encrypted!!!";

    const res2 = await formContract
      .connect(randomPerson)
      .submitAnswers(proof, encryptedAnswer)
      .then((tx) => tx.wait());

    const submittedEvent = res2.events?.find(
      (e) => e.event === "AnswerSubmitted"
    );
    const submittedArgs = submittedEvent?.args ? submittedEvent.args : [];

    expect(submittedArgs[0]).to.eql(randomPerson.address);
    expect(submittedArgs[1]).to.eql(encryptedAnswer);
    expect(submittedArgs[2].toString()).to.eql("0");
  });

  it("Should reject answers from non-whitelisted wallet", async () => {
    const proof = getProofForAddress(owner.address, merkleTree);

    const encryptedAnswer = "encrypted!!!";

    await expect(
      formContract.connect(owner).submitAnswers(proof, encryptedAnswer)
    ).to.rejectedWith();
  });
});