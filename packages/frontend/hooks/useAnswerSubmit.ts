import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  CHAIN_NAME,
  SUBMISSION_MARK_CONTRACT_ADDRESS,
} from "../constants/constants";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getContract";
import { useAccount } from "./useAccount";
import { useFormData } from "./useFormData";
import { useLitCeramic } from "./useLitCeramic";

const litAccessControlConditions = ({
  surveyId,
  nftAddress,
}: {
  surveyId: string;
  nftAddress: string;
}) => [
  {
    conditionType: "evmContract",
    contractAddress: SUBMISSION_MARK_CONTRACT_ADDRESS,
    functionName: "hasMark",
    functionParams: [":userAddress", surveyId],
    functionAbi: {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "string",
          name: "surveyId",
          type: "string",
        },
      ],
      name: "hasMark",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    chain: CHAIN_NAME,
    returnValueTest: {
      key: "",
      comparator: "=",
      value: "true",
    },
  },
  { operator: "and" },
  {
    conditionType: "evmBasic",
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

const isSubmittingAtom = atom<boolean>(false);

export const useAnswerSubmit = () => {
  const router = useRouter();
  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();
  const { nftAddress } = useFormData();
  const surveyId = router.query?.id?.toString() || null;

  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const submitAnswer = useCallback(
    async ({
      submissionStrToEncrypt,
    }: {
      submissionStrToEncrypt: string;
    }): Promise<{ success: boolean }> => {
      try {
        const submissionMarkContract = getSubmissionMarkContract();

        if (
          !account ||
          !litCeramicIntegration ||
          !submissionMarkContract ||
          !nftAddress ||
          !surveyId
        ) {
          throw new Error("Cannot submit answer");
        }

        setIsSubmitting(true);

        createToast({
          title: "Answer submission initiated",
          description: "Please wait...",
          status: "success",
        });

        // submit form to Ceramic.
        // the stream ID of Ceramic becomes the answer ID.
        let answerId: string;
        try {
          answerId = await litCeramicIntegration.encryptAndWrite(
            submissionStrToEncrypt,
            litAccessControlConditions({ surveyId, nftAddress }),
            "unifiedAccessControlConditions" // supported only in our forked version!!!
          );
          // encryptAnsWrite does not necessarily throw error even if error occurs
          if (answerId.includes("wrong")) {
            throw new Error(JSON.stringify(answerId));
          }
        } catch (error) {
          console.error(error);
          throw new Error("Upload answer to Ceramic failed");
        }

        // add submission mark to contract
        const tx = await submissionMarkContract.addMark(surveyId, {
          gasLimit: 200000,
        });

        try {
          await tx.wait();
        } catch (error) {
          console.error(error);
          throw new Error(
            "Cannot submit answer. Make sure you holds at least one NFT in project"
          );
        }

        // record answer ID in our DB
        try {
          await fetch(`/api/survey/${surveyId}/answerIds`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: answerId,
            }),
          });
        } catch (error) {
          console.error(error);
          throw new Error("Cannot submit answer. Please try again");
        }

        createToast({
          title: "Answer successfully submitted!",
          status: "success",
        });

        setIsSubmitting(false);

        return { success: true };
      } catch (error: any) {
        createToast({
          title: "Failed to submit answer",
          description: error.message,
          status: "error",
        });

        setIsSubmitting(false);

        return { success: false };
      }
    },
    [account, litCeramicIntegration, nftAddress, setIsSubmitting, surveyId]
  );

  return {
    isSubmitting,
    submitAnswer,
  };
};
