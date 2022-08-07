import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import {
  CHAIN_NAME,
  FormTemplate,
  SUBMISSION_MARK_CONTRACT_ADDRESS,
} from "../constants/constants";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getSubmissionMarkContract";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";

const litAccessControlConditions = ({ surveyId }: { surveyId: string }) => [
  {
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
];

const formDataAtom = atom<FormTemplate | null>(null);
const nftAddressAtom = atom<string | null>(null);
const isLoadingAtom = atom<boolean>(false);
const isSubmittingAtom = atom<boolean>(false);

export const useAnswerForm = () => {
  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();
  const surveyId = new URLSearchParams(location.search).get("id") || null;

  const [formData, setFormData] = useAtom(formDataAtom);
  const [nftAddress, setNftAddress] = useAtom(nftAddressAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const fetchFormData = useCallback(async () => {
    try {
      if (!surveyId || !litCeramicIntegration) return;
      const submissionMarkContract = getSubmissionMarkContract();
      if (!submissionMarkContract) return;

      setIsLoading(true);

      const [formDataStr, nftAddress]: [string, string] = await Promise.all([
        litCeramicIntegration.readAndDecrypt(surveyId),
        submissionMarkContract.surveys(surveyId),
      ]);

      try {
        // should perform type validation!!!!
        const formData = JSON.parse(formDataStr);

        setFormData(formData);
      } catch {
        throw new Error("invalid form data");
      }

      setNftAddress(nftAddress);
    } catch (error: any) {
      createToast({
        title: "Failed to get form data",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    litCeramicIntegration,
    setFormData,
    setIsLoading,
    setNftAddress,
    surveyId,
  ]);

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
            litAccessControlConditions({ surveyId }),
            "evmContractConditions" // undocumented in lit docs
          );
          // encryptAnsWrite does not necessarily throw error even if error occurs
          if (answerId.includes("wrong")) {
            throw new Error();
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
    formData,
    nftAddress,
    surveyId,
    isLoadingFormData: isLoading,
    isSubmitting,
    fetchFormData,
    submitAnswer,
  };
};
