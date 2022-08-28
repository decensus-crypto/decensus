import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { SUBGRAPH_URL } from "../constants/constants";
import { getFormUrl, getResultUrl } from "../utils/urls";
import { useAccount } from "./useAccount";

export type Form = {
  title: string;
  formUrl: string;
  resultUrl: string;
};

const formListAtom = atom<Form[] | null>(null);
const isLoadingAtom = atom<boolean>(false);

export const useFormList = () => {
  const { account } = useAccount();
  const [formList, setFormList] = useAtom(formListAtom);

  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const fetchFormList = useCallback(async () => {
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

  return {
    isLoadingFormList: isLoading,
    fetchFormList,
    formList,
  };
};
