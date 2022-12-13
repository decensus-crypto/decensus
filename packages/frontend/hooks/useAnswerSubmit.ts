import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { encrypt } from "../utils/crypto";
import { getMerkleTree, getProofForAddress } from "../utils/merkleTree";
import { compressToBase64 } from "../utils/stringCompression";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";
import { useFormData } from "./useFormData";

const submitAnswerStatusAtom = atom<
  "pending" | "encrypting" | "uploading" | "completed" | "failed"
>("pending");
const submitAnswerErrorMessageAtom = atom<string | null>(null);

export const useAnswerSubmit = () => {
  const { account } = useAccount();
  const { formViewerAddresses } = useFormData();
  const { getFormCollectionContract } = useContracts();

  const [submitAnswerStatus, setSubmitAnswerStatus] = useAtom(submitAnswerStatusAtom);
  const [submitAnswerErrorMessage, setSubmitAnswerErrorMessage] = useAtom(
    submitAnswerErrorMessageAtom,
  );
  const submitAnswer = useCallback(
    async ({
      formCollectionAddress,
      submissionStrToEncrypt,
    }: {
      formCollectionAddress: string;
      submissionStrToEncrypt: string;
    }): Promise<void> => {
      if (!account) {
        throw new Error("Cannot submit answer");
      }
      if (!formViewerAddresses) {
        throw new Error("Cannot submit answer");
      }
      if (!(submitAnswerStatus === "pending" || submitAnswerStatus === "failed")) return;

      const formCollectionContract = getFormCollectionContract(formCollectionAddress);
      if (!formCollectionContract) return;

      console.log("Start Submitting the Answer");
      console.log(submissionStrToEncrypt);
      console.log(formCollectionAddress);

      setSubmitAnswerStatus("encrypting");

      try {
        // get Merkle proof
        const merkleTree = getMerkleTree(formViewerAddresses);
        const merkleProof = getProofForAddress(account, merkleTree);

        // get encryption key
        const publicKey = atob(await formCollectionContract.answerEncryptionKey());

        // encrypt answer
        const encryptedAnswer = await encrypt({
          text: submissionStrToEncrypt,
          key: publicKey,
        });

        // submit encrypted answer to contract
        try {
          setSubmitAnswerStatus("uploading");

          const tx = await formCollectionContract.submitAnswers(
            merkleProof,
            compressToBase64(encryptedAnswer),
            {
              gasLimit: 8000000,
            },
          );
          await tx.wait();
        } catch (error: any) {
          console.error(error);
          throw new Error("Error occurred during transaction");
        }
        setSubmitAnswerStatus("completed");
      } catch (error: any) {
        console.error(error);
        setSubmitAnswerErrorMessage(error.message);
        setSubmitAnswerStatus("failed");
      }
    },
    [
      account,
      formViewerAddresses,
      getFormCollectionContract,
      setSubmitAnswerErrorMessage,
      setSubmitAnswerStatus,
      submitAnswerStatus,
    ],
  );

  return {
    submitAnswerStatus,
    submitAnswerErrorMessage,
    submitAnswer,
  };
};
