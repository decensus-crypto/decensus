import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { DecensusProofOfSurveySubmission } from "../typechain-types";

const deploy = async () => {
  const Contract = await ethers.getContractFactory(
    "DecensusProofOfSurveySubmission"
  );
  const contract = await Contract.deploy();
  await contract.deployed();
  return contract;
};

const getSignature = async (params: {
  owner: SignerWithAddress;
  chainId: number;
  contract: Contract;
  account: string;
  surveyId: string;
}) => {
  const signature = await params.owner._signTypedData(
    // Domain
    {
      name: "DecensusProofOfSurveySubmission",
      version: "0.0.1",
      chainId,
      verifyingContract: params.contract.address,
    },
    // Types
    {
      SubmittedSurvey: [
        { name: "account", type: "address" },
        { name: "surveyId", type: "string" },
      ],
    },
    // Value
    { account: params.account, surveyId: params.surveyId }
  );

  return signature;
};

let owner: SignerWithAddress;
let randomPerson: SignerWithAddress;
let chainId: number;
let contract: DecensusProofOfSurveySubmission;
const surveyId = "sid";

describe("proof of survey submission", function () {
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    owner = signers[0];
    randomPerson = signers[1];
    chainId = network.chainId;
    contract = await deploy();
  });

  it("Should succeed in adding proof with valid signature", async () => {
    const signature = await getSignature({
      owner,
      chainId,
      contract,
      account: randomPerson.address,
      surveyId,
    });

    const tx = await contract.addProof(
      randomPerson.address,
      surveyId,
      signature
    );
    await tx.wait();

    expect(await contract.hasProof(randomPerson.address, surveyId)).to.equal(
      true
    );
  });

  it("Should return false if no proof is added", async () => {
    expect(await contract.hasProof(randomPerson.address, surveyId)).to.equal(
      false
    );
  });

  it("Should fail in adding proof with invalid signature (self-signed signature)", async () => {
    const signature = await getSignature({
      owner: randomPerson,
      chainId,
      contract,
      account: randomPerson.address,
      surveyId,
    });

    await expect(
      contract.addProof(randomPerson.address, surveyId, signature)
    ).to.be.revertedWith("Invalid signature");
    expect(await contract.hasProof(randomPerson.address, surveyId)).to.equal(
      false
    );
  });

  it("can add proof multiple times idempotently", async () => {
    const surveyId2 = "sid2";
    const signature = await getSignature({
      owner,
      chainId,
      contract,
      account: randomPerson.address,
      surveyId,
    });
    const signature2 = await getSignature({
      owner,
      chainId,
      contract,
      account: randomPerson.address,
      surveyId: surveyId2,
    });

    const tx = await contract.addProof(
      randomPerson.address,
      surveyId,
      signature
    );
    await tx.wait();
    const tx2 = await contract.addProof(
      randomPerson.address,
      surveyId,
      signature
    );
    await tx2.wait();
    const tx3 = await contract.addProof(
      randomPerson.address,
      surveyId2,
      signature2
    );
    await tx3.wait();

    expect(await contract.hasProof(randomPerson.address, surveyId)).to.equal(
      true
    );
    expect(await contract.hasProof(randomPerson.address, surveyId2)).to.equal(
      true
    );
  });
});
