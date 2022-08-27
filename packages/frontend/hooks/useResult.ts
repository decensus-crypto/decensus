import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import {
  Answer,
  CHAIN_NAME,
  SUBGRAPH_URL,
  ZORA_DEMO_NFT_ADDRESS,
} from "../constants/constants";
import { createToast } from "../utils/createToast";
import { decrypt } from "../utils/crypto";
import { getFormCollectionContract } from "../utils/getContract";
import { decompressFromBase64 } from "../utils/stringCompression";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";
import { useFormCollectionAddress } from "./useFormCollectionAddress";

const answersListAtom = atom<{ answers: Answer[] }[] | null>(null);
const isLoadingAnswersListAtom = atom<boolean>(true);
const nftAddressAtom = atom<string | null>(null);
const isLoadingNftAddressAtom = atom<boolean>(true);

const areAnswersValid = (data: any) => {
  if (typeof data !== "object" || !data) return false;
  if (!data.answers || !Array.isArray(data.answers)) return false;

  const answers = data.answers;
  for (const a of answers) {
    if (!a.question_id || typeof a.question_id !== "string") return false;
    if (!a.question_type || typeof a.question_type !== "string") return false;
    if (!a.answer) return false;
    if (!Array.isArray(a.answer) && typeof a.answer !== "string") return false;
  }

  return true;
};

export const useResult = () => {
  const { account } = useAccount();
  const [answersList, setAnswersList] = useAtom(answersListAtom);
  const [isLoadingAnswersList, setIsLoadingAnswersList] = useAtom(
    isLoadingAnswersListAtom
  );
  const [nftAddress, setNftAddress] = useAtom(nftAddressAtom);
  const [isLoadingNftAddress, setIsLoadingNftAddress] = useAtom(
    isLoadingNftAddressAtom
  );

  const { formCollectionAddress } = useFormCollectionAddress();
  const { loadDocument, isCeramicReady } = useCeramic();
  const { decryptWithLit, isLitClientReady, litAuthSig } = useLit();

  const fetchResults = useCallback(async () => {
    if (
      !formCollectionAddress ||
      !isLitClientReady ||
      !litAuthSig ||
      !isCeramicReady ||
      !account
    )
      return;

    const formCollectionContract = getFormCollectionContract({
      address: formCollectionAddress,
      readonly: true,
    });
    if (!formCollectionContract) return;

    try {
      setIsLoadingAnswersList(true);

      const keyUri = await formCollectionContract.answerDecryptionKeyURI();

      if (keyUri.slice(0, 10) !== "ceramic://")
        throw new Error(
          "answer decryption key storage other than Ceramic is not supported"
        );

      const keyStreamId = keyUri.split("//").slice(-1)[0];

      const keyDataInCeramic = await loadDocument(keyStreamId);

      let rawAnswersList: any[];
      try {
        const { encryptedKey, addressesToAllowRead } = JSON.parse(
          decompressFromBase64(keyDataInCeramic)
        );

        const keyStr = await decryptWithLit({
          encryptedZipBase64: encryptedKey.encryptedZipBase64,
          encryptedSymmKeyBase64: encryptedKey.encryptedSymmKeyBase64,
          addressesToAllowRead,
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
              return data;
            } catch (error: any) {
              console.error(error);
              return null;
            }
          })
        );
      } catch (error) {
        console.error(error);
        throw new Error("Invalid answer data");
      }

      const validAnswersList = rawAnswersList.filter((a) => areAnswersValid(a));

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
  }, [
    formCollectionAddress,
    isLitClientReady,
    litAuthSig,
    isCeramicReady,
    account,
    setIsLoadingAnswersList,
    loadDocument,
    setAnswersList,
    decryptWithLit,
  ]);

  // TODO: use real NFT address
  const fetchNftAddress = useCallback(async () => {
    setNftAddress(ZORA_DEMO_NFT_ADDRESS);
    setIsLoadingNftAddress(false);
  }, [setIsLoadingNftAddress, setNftAddress]);

  return {
    answersList,
    nftAddress,
    isLoadingAnswersList,
    isLoadingNftAddress,
    fetchResults,
    fetchNftAddress,
  };
};
