import { ContractReceipt } from "ethers";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME } from "../constants/constants";
import { Form } from "../types/core";
import { genKeyPair } from "../utils/crypto";
import { getMerkleTree, getMerkleTreeRootHash } from "../utils/merkleTree";
import { getFormUrl } from "../utils/urls";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";
import { useLit } from "./useLit";

const deployStatusAtom = atom<"pending" | "uploading" | "completed" | "failed">("pending");
const deployErrorMessageAtom = atom<string | null>(null);

export const useDeploy = () => {
  const { getLitAuthSig, encryptWithLit, isLitClientReady } = useLit();
  const { account } = useAccount();
  const { getFormCollectionFactoryContract } = useContracts();

  const [deployStatus, setDeployStatus] = useAtom(deployStatusAtom);
  const [deployErrorMessage, setDeployErrorMessage] = useAtom(deployErrorMessageAtom);

  const deploy = useCallback(
    async ({
      form,
      respondentAddresses,
    }: {
      form: Form;
      respondentAddresses: string[];
    }): Promise<{
      formCollectionAddress: string;
      formUrl: string;
    } | null> => {
      try {
        if (!account) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }
        if (!(deployStatus === "pending" || deployStatus === "failed")) {
          throw new Error("Another deploy process is in progress.");
        }

        console.log("Start Deployment");
        console.log(form);
        console.log(respondentAddresses);

        setDeployStatus("uploading");
        const formCollectionFactoryContract = getFormCollectionFactoryContract();

        if (
          !isLitClientReady ||
          !formCollectionFactoryContract ||
          respondentAddresses.length === 0
        ) {
          throw new Error("Cannot deploy form.");
        }

        const resultViewerAddresses = [account]; // FIXME: this should be more flexible

        // generate key pair for encryption of answers
        const keyPair = await genKeyPair();

        // generate Merkle tree
        const merkleTree = getMerkleTree(respondentAddresses);
        const merkleRoot = getMerkleTreeRootHash(merkleTree);

        // deploy form, private key, merkle tree to Ceramic.
        let merkleTreeUri: string;
        let encryptedAnswerDecryptionKeyUri: string;
        try {
          // because the auth sig got here is not reflected when executing the following processes,
          // explicitly get the sig and pass it to the encryption functions
          const authSig = await getLitAuthSig();

          const encryptedKey = await encryptWithLit({
            strToEncrypt: keyPair.privateKey,
            addressesToAllowRead: resultViewerAddresses,
            chain: CHAIN_NAME,
            authSig,
          });

          const [merkleTreeResult, keyResult] = await Promise.all([
            fetch("/api/merkleTree", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                formTitle: form.title,
                respondentAddresses,
              }),
            }).then((r) => r.json()),
            fetch("/api/encryptedAnswerDecryptionKey", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                formTitle: form.title,
                encryptedKey,
                resultViewerAddresses,
              }),
            }).then((r) => r.json()),
          ]);

          merkleTreeUri = `ipfs://${merkleTreeResult.cid}`;
          encryptedAnswerDecryptionKeyUri = `ipfs://${keyResult.cid}`;
        } catch (error) {
          console.error(error);
          throw new Error("Upload form to IPFS failed");
        }

        let formCollectionAddress: string;
        try {
          const tx = await formCollectionFactoryContract.createFormCollection(
            form.title,
            form.description,
            JSON.stringify(form.questions),
            merkleRoot,
            merkleTreeUri,
            btoa(keyPair.publicKey),
            encryptedAnswerDecryptionKeyUri,
            {
              gasLimit: 15000000,
            },
          );

          const res: ContractReceipt = await tx.wait();
          const createdEvent = res.events?.find((e) => e.event === "FormCollectionCreated");
          formCollectionAddress = createdEvent?.args ? createdEvent.args[0] : "";
        } catch (error) {
          console.error(error);
          throw new Error("Error occurred during transaction");
        }

        setDeployStatus("completed");
        return {
          formCollectionAddress,
          formUrl: getFormUrl(location.origin, formCollectionAddress),
        };
      } catch (error: any) {
        console.error(error);
        setDeployErrorMessage(error.message);
        setDeployStatus("failed");
        return null;
      }
    },
    [
      account,
      deployStatus,
      encryptWithLit,
      getFormCollectionFactoryContract,
      getLitAuthSig,
      isLitClientReady,
      setDeployErrorMessage,
      setDeployStatus,
    ],
  );

  return {
    deploy,
    deployStatus,
    deployErrorMessage,
  };
};
