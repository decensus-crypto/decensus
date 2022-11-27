import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { createToast } from "../utils/createToast";
import { encrypt } from "../utils/crypto";
import { getMerkleTree, getProofForAddress } from "../utils/merkleTree";
import { compressToBase64 } from "../utils/stringCompression";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";
import { useFormCollectionAddress } from "./useFormCollectionAddress";
import { useFormData } from "./useFormData";

const isSubmittingAtom = atom<boolean>(false);

export const useAnswerSubmit = () => {
  const { account } = useAccount();
  const { formCollectionAddress } = useFormCollectionAddress();
  const { formViewerAddresses } = useFormData();
  const { getFormCollectionContract } = useContracts();

  const [isSubmitting, setIsSubmitting] = useAtom(isSubmittingAtom);

  const submitAnswer = useCallback(
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

      try {
        // get Merkle proof
        const merkleTree = getMerkleTree(formViewerAddresses);
        const merkleProof = getProofForAddress(account, merkleTree);

        // get encryption key
        const publicKey = atob(
          await formCollectionContract.answerEncryptionKey()
        );

        // encrypt answer
        const encryptedAnswer = await encrypt({
          text: submissionStrToEncrypt,
          key: publicKey,
        });

        // submit encrypted answer to contract
        try {
          const tx = await formCollectionContract.submitAnswers(
            merkleProof,
            compressToBase64(encryptedAnswer)
          );
          await tx.wait();
        } catch (error: any) {
          console.error(error);
          throw new Error("Error occurred during transaction");
        }

        createToast({
          title: "Answer successfully submitted!",
          status: "success",
        });
      } catch (error: any) {
        console.error(error);
        createToast({
          title: "Failed to submit answer",
          description: error.message,
          status: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      account,
      formCollectionAddress,
      formViewerAddresses,
      getFormCollectionContract,
      setIsSubmitting,
    ]
  );

  return {
    isSubmitting,
    submitAnswer,
  };
};
