import { ContractReceipt } from "ethers";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { CHAIN_NAME, FormTemplate } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { genKeyPair } from "../utils/crypto";
import {
  getFormCollectionFactoryContract,
  getSubmissionMarkContract,
} from "../utils/getContract";
import { getMerkleTree, getMerkleTreeRootHash } from "../utils/merkleTree";
import { getFormUrl } from "../utils/urls";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";

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

const litResultViewerAccessControlConditions = (addresses: string[]) =>
  addresses.flatMap((a, i) => [
    ...(i === 0 ? [] : [{ operator: "or" }]),
    {
      contractAddress: "",
      standardContractType: "",
      chain: CHAIN_NAME,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: a,
      },
    },
  ]);

export const useDeploy = () => {
  const [isDeploying, setIsDeploying] = useAtom(isDeployingAtom);

  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();

  const router = useRouter();

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
        const resultViewerAddresses = [account];

        // generate key pair for encryption of answers
        const keyPair = await genKeyPair();

        // generate Merkle tree (for now, only allow form owner to view results)
        const merkleTree = getMerkleTree([account]);
        const merkleRoot = getMerkleTreeRootHash(merkleTree);

        // deploy form, private key, merkle tree to Ceramic.
        // the stream ID of Ceramic becomes the form data ID.
        let formDataId: string;
        try {
          formDataId = await litCeramicIntegration.encryptAndWrite(
            JSON.stringify(formParams),
            litAccessControlConditions(nftAddress)
          );
          // TODO: store merkle tree, private key
        } catch (error) {
          console.error(error);
          throw new Error("Upload form to Ceramic failed");
        }

        const tx = await formCollectionFactoryContract.createFormCollection(
          formParams.title,
          formParams.description,
          merkleRoot,
          formDataId,
          "", // TODO: merkle tree ID
          keyPair.publicKey,
          {
            gasLimit: 1000000,
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
    [account, litCeramicIntegration, setIsDeploying]
  );

  // switch the deploy function depending on the query string
  const deploy = useCallback(
    async (params: { nftAddress: string; formParams: FormTemplate }) => {
      if (router.query.test != null) {
        return await deployPhorms(params);
      } else {
        return await deployOld(params);
      }
    },
    [deployOld, deployPhorms, router.query.test]
  );

  return {
    deploy,
    isDeploying,
  };
};
