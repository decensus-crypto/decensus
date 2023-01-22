import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import { FormCollection, FormCollectionFactory } from "../typechain-types";
import { getMerkleTree, getMerkleTreeRootHash, getProofForAddress } from "./utils/cryptography";

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
let proof: string[];
const name = "form name";
const description = "this is a test form";
const questions = "questions";
const merkleTreeURI = "m-uri";
const answerEncryptionKey = "key";
const encryptedAnswerDecryptionKeyURI = "k-uri";
const encryptedAnswer = "encrypted!!";

describe("form collection", function () {
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    randomPerson = signers[1];
    randomPerson2 = signers[2];
    factoryContract = await deployFactory();

    merkleTree = getMerkleTree([randomPerson.address, randomPerson2.address]);
    const merkleRoot = getMerkleTreeRootHash(merkleTree);
    proof = getProofForAddress(randomPerson.address, merkleTree);
    const res = await factoryContract
      .createFormCollection(
        name,
        description,
        questions,
        merkleRoot,
        merkleTreeURI,
        answerEncryptionKey,
        encryptedAnswerDecryptionKeyURI,
      )
      .then((tx) => tx.wait());

    const createdEvent = res.events?.find((e) => e.event === "FormCollectionCreated");

    const formAddress = createdEvent?.args ? createdEvent.args[0] : "";

    formContract = await ethers.getContractAt("FormCollection", formAddress);
  });

  it("Should have correct form metadata", async () => {
    expect(await formContract.owner()).to.eql(owner.address);
    expect(await formContract.name()).to.eql(name);
    expect(await formContract.description()).to.eql(description);
    expect(await formContract.questions()).to.eql(questions);
    expect(await formContract.merkleTreeURI()).to.eql(merkleTreeURI);
    expect(await formContract.answerEncryptionKey()).to.eql(answerEncryptionKey);
    expect(await formContract.encryptedAnswerDecryptionKeyURI()).to.eql(
      encryptedAnswerDecryptionKeyURI,
    );
  });

  it("Should succeed in submitting answer", async () => {
    const res2 = await formContract
      .connect(randomPerson)
      .submitAnswers(proof, encryptedAnswer)
      .then((tx) => tx.wait());

    const submittedEvent = res2.events?.find((e) => e.event === "AnswerSubmitted");
    const submittedArgs = submittedEvent?.args ? submittedEvent.args : [];

    expect(submittedArgs[0]).to.eql(randomPerson.address);
    expect(submittedArgs[1]).to.eql(encryptedAnswer);
    expect(submittedArgs[2].toString()).to.eql("0");
  });

  it("Should reject answers from non-whitelisted wallet", async () => {
    await expect(
      formContract.connect(owner).submitAnswers(proof, encryptedAnswer),
    ).to.rejectedWith();
  });

  it("Non-owner cannot close submission", async () => {
    await expect(formContract.connect(randomPerson).close()).to.rejectedWith();
  });

  it("Should reject answers if submission is closed", async () => {
    const res = await formContract
      .connect(owner)
      .close()
      .then((tx) => tx.wait());

    const closedEvent = res.events?.find((e) => e.event === "Closed");

    await expect(closedEvent).to.not.be.undefined;
    await expect(
      formContract.connect(randomPerson).submitAnswers(proof, encryptedAnswer),
    ).to.rejectedWith("Survey closed");
  });

  it("Should reject token transfer", async () => {
    await formContract
      .connect(randomPerson)
      .submitAnswers(proof, encryptedAnswer)
      .then((tx) => tx.wait());

    await expect(
      formContract.connect(randomPerson).transferFrom(randomPerson.address, owner.address, 0),
    ).to.rejectedWith("ERC721: token transfer disabled");
  });

  it("Should generate contractURI", async () => {
    const uri = await formContract.contractURI();
    const [prefix, encoded] = uri.split(",");

    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString());

    expect(prefix).to.eql("data:application/json;base64");
    expect(decoded).to.eql({
      name,
      description,
      external_link: "https://decensus.centiv.xyz",
    });
  });

  it("Should generate tokenURI", async () => {
    await formContract
      .connect(randomPerson)
      .submitAnswers(proof, encryptedAnswer)
      .then((tx) => tx.wait());

    const uri = await formContract.tokenURI(0);
    const [prefix, encoded] = uri.split(",");

    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString());

    const [imagePrefix, encodedImage] = decoded.image.split(",");
    const decodedImage = Buffer.from(encodedImage, "base64").toString();

    expect(prefix).to.eql("data:application/json;base64");
    expect(decoded).to.contain({
      name: `${name}: Answer #0`,
      description,
    });
    expect(imagePrefix).to.eql("data:image/svg+xml;base64");
    expect(decodedImage).to.eql(
      `<svg viewBox="0 0 180 180" style="font-family:monospace" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%"/><path d="M20 0v180M0 20h180" style="stroke:gray"/><text x="23" y="15" style="font-size:6px" fill="#fff">${name}</text><text text-anchor="middle" x="50%" y="40%" fill="#fff" style="font-size:10px">Answer #0</text><text text-anchor="middle" x="50%" y="60%" fill="#fff" style="font-size:16px"><tspan fill="#FC8CC9">de</tspan>census</text></svg>`,
    );
  });
});
