import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME, SUBGRAPH_URL } from "../constants/constants";
import { Answer } from "../types/core";
import { AnswerDecryptionKeyInStorage } from "../types/storage";
import { createToast } from "../utils/createToast";
import { decrypt } from "../utils/crypto";
import { loadJsonFromIpfs } from "../utils/ipfs";
import { decompressFromBase64 } from "../utils/stringCompression";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";
import { useLit } from "./useLit";

const answersListAtom = atom<{ answers: Answer[]; address: string }[] | null>(null);
const isLoadingAnswersListAtom = atom<boolean>(true);

const areAnswersValid = (data: any) => {
  if (typeof data !== "object" || !data) return false;
  if (!data.answers || !Array.isArray(data.answers)) return false;

  const answers = data.answers;
  for (const a of answers) {
    if (!a.qid || typeof a.qid !== "string") return false;
    if (!a.val) return false;
    if (Array.isArray(a.val)) {
      for (const v of a.val) {
        if (typeof v !== "string") return false;
      }
    } else {
      if (typeof a.val !== "string") return false;
    }
  }

  return true;
};

export const useResult = () => {
  const { account } = useAccount();
  const [answersList, setAnswersList] = useAtom(answersListAtom);
  const { decryptWithLit, isLitClientReady, litAuthSig } = useLit();
  const { getFormCollectionContract } = useContracts();

  const [isLoadingAnswersList, setIsLoadingAnswersList] = useAtom(isLoadingAnswersListAtom);

  const fetchResults = useCallback(
    async (formCollectionAddress: string) => {
      if (!isLitClientReady) return;
      if (!litAuthSig) return;
      if (!account) return;

      const formCollectionContract = getFormCollectionContract(formCollectionAddress);
      if (!formCollectionContract) return;

      try {
        setIsLoadingAnswersList(true);

        const keyUri = await formCollectionContract.answerDecryptionKeyURI();
        const { encryptedKey, resultViewerAddresses } =
          await loadJsonFromIpfs<AnswerDecryptionKeyInStorage>(keyUri);

        let rawAnswersList: any[];
        try {
          const keyStr = await decryptWithLit({
            encryptedZipBase64: encryptedKey.encryptedZipBase64,
            encryptedSymmKeyBase64: encryptedKey.encryptedSymmKeyBase64,
            addressesToAllowRead: resultViewerAddresses,
            chain: CHAIN_NAME,
          });

          const query = `
          query GetAnswers($contractAddress: String!) {
            answers(
              where: {contractAddress: $contractAddress}
            ) {
              encryptedAnswer
              respondentAddress
              mintedTokenId
            }
          }`;

          const graphqlQuery = {
            query,
            variables: {
              contractAddress: formCollectionAddress.toLowerCase(),
            },
          };

          const res = await fetch(SUBGRAPH_URL, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(graphqlQuery),
          });

          const data = await res.json();

          rawAnswersList = await Promise.all(
            data.data.answers.map(async (row: any) => {
              try {
                const str = await decrypt({
                  encrypted: decompressFromBase64(row.encryptedAnswer),
                  key: keyStr,
                });
                const data = JSON.parse(str);
                return { address: row.respondentAddress, data };
              } catch (error) {
                console.error(error);
                return null;
              }
            }),
          );
        } catch (error) {
          console.error(error);
          throw new Error("Invalid answer data");
        }

        const validAnswersList = rawAnswersList
          .filter(({ data }) => areAnswersValid(data))
          .map(({ address, data }) => ({ ...data, address }));

        setAnswersList(validAnswersList);
      } catch (error: any) {
        console.error(error);
        createToast({
          title: `Failed to fetch answers: ${error.message}`,
          status: "error",
        });
      } finally {
        setIsLoadingAnswersList(false);
      }
    },
    [
      isLitClientReady,
      litAuthSig,
      account,
      getFormCollectionContract,
      setIsLoadingAnswersList,
      setAnswersList,
      decryptWithLit,
    ],
  );

  return {
    answersList,
    isLoadingAnswersList,
    fetchResults,
  };
};
