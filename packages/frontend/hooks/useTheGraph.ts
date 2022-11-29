import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { QuestionnaireLink } from "../types";

const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/nakaakist/form-collection-mumbai";

const questionnaireLinksAtom = atom<QuestionnaireLink[] | null>(null);
const isLoadingQuestionnaireLinksAtom = atom<boolean>(false);

const getFormUrl = (origin: string, surveyId: string) =>
  `${origin}/answer?id=${surveyId}`;
const getResultUrl = (origin: string, surveyId: string) =>
  `${origin}/result?id=${surveyId}`;

export const useTheGraph = () => {
  const [questionnaireLinks, setQuestionnaireLinks] = useAtom(
    questionnaireLinksAtom
  );
  const [isLoadingQuestionnaireLinks, setIsLoadingQuestionnaireLinks] = useAtom(
    isLoadingQuestionnaireLinksAtom
  );

  const fetchQuestionnaireLinks = useCallback(
    async (wallet: string) => {
      if (isLoadingQuestionnaireLinks) return;

      setIsLoadingQuestionnaireLinks(true);
      try {
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
            owner: wallet.toLowerCase(),
          },
        };
        const res = await fetch(SUBGRAPH_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(graphqlQuery),
        });
        const items = (await res.json()).data.formCollections.map((f: any) => ({
          formUrl: getFormUrl(location.origin, f.contractAddress),
          resultUrl: getResultUrl(location.origin, f.contractAddress),
          title: f.name,
        }));
        setQuestionnaireLinks(items);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingQuestionnaireLinks(false);
      }
    },
    [setQuestionnaireLinks, setIsLoadingQuestionnaireLinks]
  );
  return {
    questionnaireLinks,
    isLoadingQuestionnaireLinks,
    fetchQuestionnaireLinks,
  };
};
