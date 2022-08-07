import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getSubmissionMarkContract";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";

export type Form = {
  title: string;
  formUrl: string;
  resultUrl: string;
};

const formListAtom = atom<Form[]>([]);
const isLoadingAtom = atom<boolean>(true);

export const useFormList = () => {
  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();
  const [formList, setFormList] = useAtom(formListAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const fetchFormList = useCallback(async () => {
    const submissionMarkContract = getSubmissionMarkContract();

    if (!account || !litCeramicIntegration || !submissionMarkContract) return;

    try {
      setIsLoading(true);
      const surveyIds: string[] = await submissionMarkContract.mySurveys();

      const formList = await Promise.all(
        surveyIds.map(async (surveyId) => {
          const formStr = await litCeramicIntegration.readAndDecrypt(surveyId);
          const title = JSON.parse(formStr).title;
          const formUrl = `${location.origin}/answer?id=${surveyId}`;
          const resultUrl = `${location.origin}/result?id=${surveyId}`;

          return { formUrl, resultUrl, title };
        })
      );

      setFormList(formList);
    } catch (error: any) {
      console.error(error);
      createToast({
        title: "Failed to fetch forms",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, litCeramicIntegration, setFormList, setIsLoading]);

  return {
    isLoadingFormList: isLoading,
    fetchFormList,
    formList,
  };
};
