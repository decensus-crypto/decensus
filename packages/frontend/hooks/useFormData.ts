import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { FormTemplate } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getSubmissionMarkContract";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";
import { useSurveyIdInQuery } from "./useSurveyIdInQuery";

const formDataAtom = atom<FormTemplate | null>(null);
const nftAddressAtom = atom<string | null>(null);
const isLoadingAtom = atom<boolean>(true);

export const useFormData = () => {
  const { surveyId } = useSurveyIdInQuery();
  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();

  const [formData, setFormData] = useAtom(formDataAtom);
  const [nftAddress, setNftAddress] = useAtom(nftAddressAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const fetchFormData = useCallback(async () => {
    if (!surveyId || !litCeramicIntegration || !account) return;
    const submissionMarkContract = getSubmissionMarkContract();
    if (!submissionMarkContract) return;

    try {
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
    account,
    litCeramicIntegration,
    setFormData,
    setIsLoading,
    setNftAddress,
    surveyId,
  ]);

  return {
    formData,
    nftAddress,
    surveyId,
    isLoadingFormData: isLoading,
    fetchFormData,
  };
};
