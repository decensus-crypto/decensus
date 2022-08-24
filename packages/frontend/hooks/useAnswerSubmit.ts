import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  CHAIN_NAME,
  SUBMISSION_MARK_CONTRACT_ADDRESS,
} from "../constants/constants";
import { createToast } from "../utils/createToast";
import { encrypt } from "../utils/crypto";
import {
  getFormCollectionContract,
  getSubmissionMarkContract,
} from "../utils/getContract";
import { getMerkleTree, getProofForAddress } from "../utils/merkleTree";
import { useAccount } from "./useAccount";
import { useFormCollectionAddress } from "./useFormCollectionAddress";
import { useFormData } from "./useFormData";
import { useLitCeramic } from "./useLitCeramic";
import { usePhormsMode } from "./usePhormsMode";

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
  const { formCollectionAddress } = useFormCollectionAddress();
  const { formViewerAddresses } = useFormData();

  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  // TODO: remove test mode
  const { isPhormsMode } = usePhormsMode();

  const submitAnswerOld = useCallback(
    async ({
      submissionStrToEncrypt,
    }: {
      submissionStrToEncrypt: string;
    }): Promise<void> => {
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
    },
    [account, litCeramicIntegration, nftAddress, setIsSubmitting, surveyId]
  );

  const submitAnswerPhorms = useCallback(
    async ({
      submissionStrToEncrypt,
    }: {
      submissionStrToEncrypt: string;
    }): Promise<void> => {
      if (!formCollectionAddress || !account || !formViewerAddresses) {
        throw new Error("Cannot submit answer");
      }

      const formCollectionContract = getFormCollectionContract(
        formCollectionAddress
      );
      if (!formCollectionContract) return;

      setIsSubmitting(true);

      createToast({
        title: "Answer submission initiated",
        description: "Please wait...",
        status: "success",
      });

      // get Merkle proof
      const merkleTree = getMerkleTree(formViewerAddresses);
      const merkleProof = getProofForAddress(account, merkleTree);

      // get encryption key
      const publicKey = await formCollectionContract.answerEncryptionKey();

      // encrypt answer
      const encryptedAnswer = await encrypt({
        text: submissionStrToEncrypt,
        key: publicKey,
      });

      // submit encrypted answer to contract
      try {
        const tx = await formCollectionContract.submitAnswers(
          merkleProof,
          encryptedAnswer
        );
        await tx.wait();
      } catch (error) {
        console.error(error);
        throw new Error("Submit answer to contract failed");
      }

      createToast({
        title: "Answer successfully submitted!",
        status: "success",
      });

      setIsSubmitting(false);
    },
    [account, formCollectionAddress, formViewerAddresses, setIsSubmitting]
  );

  const submitAnswer = useCallback(
    async (params: { submissionStrToEncrypt: string }): Promise<void> => {
      if (isPhormsMode) {
        await submitAnswerPhorms(params);
      } else {
        await submitAnswerOld(params);
      }
    },
    [isPhormsMode, submitAnswerOld, submitAnswerPhorms]
  );

  return {
    isSubmitting,
    submitAnswer,
  };
};
