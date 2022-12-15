import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { SUBGRAPH_URL } from "../constants/constants";
import { getFormUrl } from "../utils/urls";
import { useAccount } from "./useAccount";

export type Form = {
  title: string;
  formUrl: string;
  contractAddress: string;
  createdAt: number;
  closed: boolean;
};

const formListAtom = atom<Form[] | null>(null);
const isLoadingAtom = atom<boolean>(false);

export const useFormList = () => {
  const { account } = useAccount();
  const [formList, setFormList] = useAtom(formListAtom);

  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const fetchFormList = useCallback(
    // specify overrides if there are specific form data you want to overwrite the fetched data
    async (params: { overrides?: Form[] }) => {
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
            contractAddress
            closed
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
          title: f.name,
          contractAddress: f.contractAddress,
          createdAt: parseInt(f.createdAt) * 1000,
          closed: f.closed,
        })) as Form[];

        const overWrittenFormMap: Record<string, Form> = Object.fromEntries(
          _formList.map((f) => [f.contractAddress.toLowerCase(), f]),
        );
        if (params.overrides) {
          params.overrides.forEach((o) => {
            overWrittenFormMap[o.contractAddress.toLowerCase()] = o;
          });
        }

        console.log(
          Object.values(overWrittenFormMap).sort((f1, f2) => f2.createdAt - f1.createdAt),
        );

        setFormList(
          Object.values(overWrittenFormMap).sort((f1, f2) => f2.createdAt - f1.createdAt),
        );
      } catch {
        setFormList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [account, setFormList, setIsLoading],
  );

  return {
    isLoadingFormList: isLoading,
    fetchFormList,
    formList,
  };
};
