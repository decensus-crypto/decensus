import { ContractReceipt } from "ethers";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME, FormTemplate } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { genKeyPair } from "../utils/crypto";
import {
  getFormCollectionFactoryContract,
  getSubmissionMarkContract,
} from "../utils/getContract";
import { getMerkleTree, getMerkleTreeRootHash } from "../utils/merkleTree";
import { compressToBase64 } from "../utils/stringCompression";
import { getFormUrl } from "../utils/urls";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";
import { usePhormsMode } from "./usePhormsMode";

const isDeployingAtom = atom<boolean>(false);

const litAccessControlConditions = (nftAddress: string) => [
  {
    contractAddress: nftAddress,
    standardContractType: "ERC721",
    chain: CHAIN_NAME,
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

export const useDeploy = () => {
  const [isDeploying, setIsDeploying] = useAtom(isDeployingAtom);

  const { litCeramicIntegration } = useLitCeramic();
  const { authenticateCeramic, createDocument, loadDocument } = useCeramic();
  const { getLitAuthSig, encryptWithLit, decryptWithLit } = useLit();

  const { account } = useAccount();

  // TODO: remove test mode
  const { isPhormsMode } = usePhormsMode();

  const deployOld = useCallback(
    async ({
      nftAddress,
      formParams,
    }: {
      nftAddress: string;
      formParams: FormTemplate;
    }): Promise<{ formUrl: string } | null> => {
      console.log("DEPLOYING OLD!");

      try {
        const submissionMarkContract = getSubmissionMarkContract();

        if (!account || !litCeramicIntegration || !submissionMarkContract) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }

        setIsDeploying(true);

        createToast({
          title: "Form deploy initiated",
          description: "Please wait...",
          status: "success",
        });

        // deploy form to Ceramic.
        // the stream ID of Ceramic becomes the survey ID.
        let surveyId: string;
        try {
          surveyId = await litCeramicIntegration.encryptAndWrite(
            JSON.stringify(formParams),
            litAccessControlConditions(nftAddress)
          );
        } catch (error) {
          console.error(error);
          throw new Error("Upload form to Ceramic failed");
        }

        const tx = await submissionMarkContract.addSurvey(
          surveyId,
          nftAddress,
          {
            gasLimit: 200000,
          }
        );

        try {
          await tx.wait();
        } catch (error) {
          console.error(error);
          throw new Error(
            "Couldn't deploy form. Make sure the NFT address is ERC721 and you holds at least one token in it"
          );
        }

        createToast({
          title: "Form successfully deployed!",
          status: "success",
        });

        return { formUrl: getFormUrl(location.origin, surveyId) };
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
    [account, litCeramicIntegration, setIsDeploying]
  );

  const deployPhorms = useCallback(
    async ({
      nftAddress,
      formParams,
    }: {
      nftAddress: string;
      formParams: FormTemplate;
    }): Promise<{ formUrl: string } | null> => {
      console.log("DEPLOYING PHORMS!");

      try {
        const formCollectionFactoryContract =
          getFormCollectionFactoryContract();

        if (
          !account ||
          !litCeramicIntegration ||
          !formCollectionFactoryContract
        ) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }

        setIsDeploying(true);

        createToast({
          title: "Form deploy initiated",
          description: "Please wait...",
          status: "success",
        });

        // TODO: this should be more flexible
        const formViewerAddresses = [...Array(10000)].map((_) => account); // FIXME: test for large number of addresses
        const resultViewerAddresses = [account];

        // generate key pair for encryption of answers
        const keyPair = await genKeyPair();

        // generate Merkle tree (for now, only allow form owner to view results)
        const merkleTree = getMerkleTree([account]);
        const merkleRoot = getMerkleTreeRootHash(merkleTree);

        // deploy form, private key, merkle tree to Ceramic.
        let formDataUri: string;
        let answerDecryptionKeyUri: string;
        try {
          await getLitAuthSig();

          const encryptedFormData = await encryptWithLit({
            strToEncrypt: JSON.stringify({
              formParams,
            }),
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
            JSON.stringify({
              encryptedFormData: encryptedFormData,
              addressesToAllowRead: compressToBase64(
                JSON.stringify(formViewerAddresses)
              ),
            })
          );
          formDataUri = formDataStreamId.toUrl();

          const keyStreamId = await createDocument(
            JSON.stringify({
              encryptedFormData: encryptedKey,
              addressesToAllowRead: resultViewerAddresses,
            })
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
      litCeramicIntegration,
      setIsDeploying,
    ]
  );

  // switch the deploy function depending on the query string
  const deploy = useCallback(
    async (params: { nftAddress: string; formParams: FormTemplate }) => {
      if (isPhormsMode) {
        return await deployPhorms(params);
      } else {
        return await deployOld(params);
      }
    },
    [deployOld, deployPhorms, isPhormsMode]
  );

  return {
    deploy,
    isDeploying,
  };
};
