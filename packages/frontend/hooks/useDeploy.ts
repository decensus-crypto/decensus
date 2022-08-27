import { ContractReceipt } from "ethers";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME, FormTemplate } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { genKeyPair } from "../utils/crypto";
import { getFormCollectionFactoryContract } from "../utils/getContract";
import { getMerkleTree, getMerkleTreeRootHash } from "../utils/merkleTree";
import { compressToBase64 } from "../utils/stringCompression";
import { getFormUrl } from "../utils/urls";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";

const isDeployingAtom = atom<boolean>(false);

export const useDeploy = () => {
  const [isDeploying, setIsDeploying] = useAtom(isDeployingAtom);

  const { authenticateCeramic, createDocument } = useCeramic();
  const { getLitAuthSig, encryptWithLit, isLitClientReady } = useLit();

  const { account } = useAccount();

  const deploy = useCallback(
    async ({
      formParams,
    }: {
      formParams: FormTemplate;
    }): Promise<{ formUrl: string } | null> => {
      try {
        const formCollectionFactoryContract =
          getFormCollectionFactoryContract();

        if (!account || !isLitClientReady || !formCollectionFactoryContract) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }

        setIsDeploying(true);

        createToast({
          title: "Form deploy initiated",
          description: "Please wait...",
          status: "success",
        });

        const formViewerAddresses = [account]; // FIXME: this should be NFT owners
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
          await getLitAuthSig();

          const encryptedFormData = await encryptWithLit({
            strToEncrypt: JSON.stringify(formParams),
            addressesToAllowRead: formViewerAddresses,
            chain: CHAIN_NAME,
          });

          const encryptedKey = await encryptWithLit({
            strToEncrypt: keyPair.privateKey,
            addressesToAllowRead: resultViewerAddresses,
            chain: CHAIN_NAME,
          });

          await authenticateCeramic();

          const formDataStreamId = await createDocument(
            compressToBase64(
              JSON.stringify({
                encryptedFormData: encryptedFormData,
                addressesToAllowRead: formViewerAddresses,
              })
            )
          );
          formDataUri = formDataStreamId.toUrl();

          const keyStreamId = await createDocument(
            compressToBase64(
              JSON.stringify({
                encryptedKey,
                addressesToAllowRead: resultViewerAddresses,
              })
            )
          );
          answerDecryptionKeyUri = keyStreamId.toUrl();
        } catch (error) {
          console.error(error);
          throw new Error("Upload form to Ceramic failed");
        }

        const tx = await formCollectionFactoryContract.createFormCollection(
          formParams.title,
          formParams.description,
          merkleRoot,
          formDataUri,
          keyPair.publicKey,
          answerDecryptionKeyUri,
          {
            gasLimit: 2000000,
          }
        );

        let formCollectionAddress: string;
        try {
          const res: ContractReceipt = await tx.wait();
          const createdEvent = res.events?.find(
            (e) => e.event === "FormCollectionCreated"
          );
          formCollectionAddress = createdEvent?.args
            ? createdEvent.args[0]
            : "";
        } catch (error) {
          console.error(error);
          throw new Error("Couldn't deploy form");
        }

        createToast({
          title: "Form successfully deployed!",
          status: "success",
        });

        return { formUrl: getFormUrl(location.origin, formCollectionAddress) };
      } catch (error: any) {
        createToast({
          title: "Failed to deploy form",
          description: error.message,
          status: "error",
        });
        return null;
      } finally {
        setIsDeploying(false);
      }
    },
    [
      account,
      authenticateCeramic,
      createDocument,
      encryptWithLit,
      getLitAuthSig,
      isLitClientReady,
      setIsDeploying,
    ]
  );

  return {
    deploy,
    isDeploying,
  };
};
