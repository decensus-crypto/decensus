import { ContractReceipt } from "ethers";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME, FormTemplate } from "../constants/constants";
import { genKeyPair } from "../utils/crypto";
import { getMerkleTree, getMerkleTreeRootHash } from "../utils/merkleTree";
import { compressToBase64 } from "../utils/stringCompression";
import { getFormUrl, getResultUrl } from "../utils/urls";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";

const deployStatusAtom = atom<
  "pending" | "encrypting" | "uploading" | "completed" | "failed"
>("pending");
const deployErrorMessageAtom = atom<string | null>(null);

export const useDeploy = () => {
  const { authenticateCeramic, createDocument, isCeramicReady } = useCeramic();
  const { getLitAuthSig, encryptWithLit, isLitClientReady } = useLit();
  const { account } = useAccount();
  const { getFormCollectionFactoryContract } = useContracts();

  const [deployStatus, setDeployStatus] = useAtom(deployStatusAtom);
  const [deployErrorMessage, setDeployErrorMessage] = useAtom(
    deployErrorMessageAtom
  );

  const deploy = useCallback(
    async ({
      formParams,
      formViewerAddresses,
      nftAddress,
    }: {
      formParams: FormTemplate;
      formViewerAddresses: string[];
      nftAddress: string;
    }): Promise<{
      formCollectionAddress: string;
      formUrl: string;
      resultUrl: string;
    } | null> => {
      try {
        if (!account) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }
        if (!(deployStatus === "pending" || deployStatus === "failed")) {
          throw new Error("Another deploy process is in progress.");
        }

        console.log("Start Deployment");
        console.log(formParams);
        console.log(formViewerAddresses);
        console.log(nftAddress);

        setDeployStatus("encrypting");
        const formCollectionFactoryContract =
          getFormCollectionFactoryContract();

        if (
          !isCeramicReady ||
          !isLitClientReady ||
          !formCollectionFactoryContract ||
          formViewerAddresses.length === 0
        ) {
          throw new Error("Cannot deploy form.");
        }

        const resultViewerAddresses = [account]; // FIXME: this should be more flexible

        // generate key pair for encryption of answers
        const keyPair = await genKeyPair();

        // generate Merkle tree
        const merkleTree = getMerkleTree(formViewerAddresses);
        const merkleRoot = getMerkleTreeRootHash(merkleTree);

        // deploy form, private key, merkle tree to Ceramic.
        let formDataUri: string;
        let answerDecryptionKeyUri: string;
        try {
          // because the auth sig got here is not reflected when executing the following processes,
          // explicitly get the sig and pass it to the encryption functions
          const authSig = await getLitAuthSig();

          const encryptedFormData = await encryptWithLit({
            strToEncrypt: JSON.stringify(formParams),
            nftAddressToAllowRead: nftAddress,
            chain: CHAIN_NAME,
            authSig,
          });

          const encryptedKey = await encryptWithLit({
            strToEncrypt: keyPair.privateKey,
            addressesToAllowRead: resultViewerAddresses,
            chain: CHAIN_NAME,
            authSig,
          });

          await authenticateCeramic();

          const formDataStreamId = await createDocument(
            compressToBase64(
              JSON.stringify({
                encryptedFormData: encryptedFormData,
                addressesToAllowRead: formViewerAddresses,
                nftAddress,
              })
            )
          );
          formDataUri = formDataStreamId.toUrl();

          const keyStreamId = await createDocument(
            compressToBase64(
              JSON.stringify({
                encryptedKey,
                addressesToAllowRead: resultViewerAddresses,
                nftAddress,
              })
            )
          );
          answerDecryptionKeyUri = keyStreamId.toUrl();
        } catch (error) {
          console.error(error);
          throw new Error("Upload form to Ceramic failed");
        }

        setDeployStatus("uploading");
        let formCollectionAddress: string;
        try {
          const tx = await formCollectionFactoryContract.createFormCollection(
            formParams.title,
            formParams.description,
            merkleRoot,
            formDataUri,
            btoa(keyPair.publicKey),
            answerDecryptionKeyUri,
            {
              gasLimit: 8000000,
            }
          );

          const res: ContractReceipt = await tx.wait();
          const createdEvent = res.events?.find(
            (e) => e.event === "FormCollectionCreated"
          );
          formCollectionAddress = createdEvent?.args
            ? createdEvent.args[0]
            : "";
        } catch (error) {
          console.error(error);
          throw new Error("Error occurred during transaction");
        }

        setDeployStatus("completed");
        return {
          formCollectionAddress,
          formUrl: getFormUrl(location.origin, formCollectionAddress),
          resultUrl: getResultUrl(location.origin, formCollectionAddress),
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
      authenticateCeramic,
      createDocument,
      deployStatus,
      encryptWithLit,
      getFormCollectionFactoryContract,
      getLitAuthSig,
      isLitClientReady,
      setDeployErrorMessage,
      setDeployStatus,
    ]
  );

  return {
    deploy,
    deployStatus,
    deployErrorMessage,
  };
};
