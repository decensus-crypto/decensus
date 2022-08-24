import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { SUBGRAPH_URL } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getContract";
import { getFormUrl, getResultUrl } from "../utils/urls";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";
import { usePhormsMode } from "./usePhormsMode";

export type Form = {
  title: string;
  formUrl: string;
  resultUrl: string;
};

const formListAtom = atom<Form[] | null>(null);
const isLoadingAtom = atom<boolean>(true);

export const useFormList = () => {
  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();
  const [formList, setFormList] = useAtom(formListAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  // TODO: remove test mode
  const { isPhormsMode } = usePhormsMode();

  const fetchFormListOld = useCallback(async () => {
    const submissionMarkContract = getSubmissionMarkContract();

    if (!account || !litCeramicIntegration || !submissionMarkContract) return;

    try {
      setIsLoading(true);
      const surveyIds: string[] = await submissionMarkContract.mySurveys();

      if (surveyIds.length === 0) {
        setFormList([]);
        return;
      }

      const formList = await Promise.all(
        surveyIds.map(async (surveyId) => {
          const formStr = await litCeramicIntegration.readAndDecrypt(surveyId);
          const title = JSON.parse(formStr).title;
          const formUrl = getFormUrl(location.origin, surveyId);
          const resultUrl = getResultUrl(location.origin, surveyId);

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

  const fetchFormListPhorms = useCallback(async () => {
    if (!account) return;

    try {
      setIsLoading(true);

      const query = `
        query GetOwnedFormCollections($owner: String!) {
          formCollections(
            where: {owner: $owner}
            orderBy: createdAt
            orderDirection: desc
          ) {
            contractAddress
            description
            createdAt
            id
            owner
            name
          }
        }`;

      const graphqlQuery = {
        query,
        variables: {
          owner: account.toLowerCase(),
        },
      };

      const res = await fetch(SUBGRAPH_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });

      const data = await res.json();

      const _formList = data.data.formCollections.map((f: any) => ({
        formUrl: getFormUrl(location.origin, f.contractAddress),
        resultUrl: getResultUrl(location.origin, f.contractAddress),
        title: f.name,
      }));

      setFormList(_formList);
    } catch {
      setFormList([]);
    } finally {
      setIsLoading(false);
    }
  }, [account, setFormList, setIsLoading]);

  const fetchFormList = useCallback(async () => {
    if (isPhormsMode) {
      return await fetchFormListPhorms();
    } else {
      return await fetchFormListOld();
    }
  }, [fetchFormListOld, fetchFormListPhorms, isPhormsMode]);

  return {
    isLoadingFormList: isLoading,
    fetchFormList,
    formList,
  };
};
