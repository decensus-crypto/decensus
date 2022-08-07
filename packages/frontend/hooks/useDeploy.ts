import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getSubmissionMarkContract";
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

export const useDeploy = () => {
  const [isDeploying, setIsDeploying] = useAtom(isDeployingAtom);

  const { litCeramicIntegration, initLitCeramic } = useLitCeramic();
  const { account } = useAccount();

  const deploy = useCallback(
    async ({
      nftAddress,
      formParamsToEncrypt,
    }: {
      nftAddress: string;
      formParamsToEncrypt: string;
    }) => {
      try {
        initLitCeramic();
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
            formParamsToEncrypt,
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
        setIsDeploying(false);

        createToast({
          title: "Form successfully deployed!",
          status: "success",
        });
      } catch (error: any) {
        createToast({
          title: "Failed to deploy form",
          description: error.message,
          status: "error",
        });
        setIsDeploying(false);
      }
    },
    [account, initLitCeramic, litCeramicIntegration, setIsDeploying]
  );

  return {
    deploy,
    isDeploying,
  };
};
