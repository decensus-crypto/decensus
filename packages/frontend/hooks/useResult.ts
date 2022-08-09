import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Answer } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { getSubmissionMarkContract } from "../utils/getSubmissionMarkContract";
import { useAccount } from "./useAccount";
import { useLitCeramic } from "./useLitCeramic";

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
  const router = useRouter();
  const { litCeramicIntegration } = useLitCeramic();
  const { account } = useAccount();
  const [answersList, setAnswersList] = useAtom(answersListAtom);
  const [isLoadingAnswersList, setIsLoadingAnswersList] = useAtom(
    isLoadingAnswersListAtom
  );
  const [nftAddress, setNftAddress] = useAtom(nftAddressAtom);
  const [isLoadingNftAddress, setIsLoadingNftAddress] = useAtom(
    isLoadingNftAddressAtom
  );

  const surveyId = router.query?.id?.toString() || null;

  const fetchResults = useCallback(async () => {
    if (!litCeramicIntegration) return;

    try {
      setIsLoadingAnswersList(true);
      const answerIdsRes = await fetch(`/api/survey/${surveyId}/answerIds`, {
        method: "GET",
      });
      const answerIds: string[] = await answerIdsRes.json();

      const rawAnswersList = await Promise.all(
        answerIds.map(async (answerId) => {
          const str = await litCeramicIntegration.readAndDecrypt(answerId);
          try {
            const data = JSON.parse(str);
            return data;
          } catch {
            return null;
          }
        })
      );

      const validAnswersList = rawAnswersList.filter((a) => areAnswersValid(a));

      setAnswersList(validAnswersList);
    } catch (error: any) {
      console.error(error);
      createToast({
        title: "Failed to fetch answers",
        status: "error",
      });
    } finally {
      setIsLoadingAnswersList(false);
    }
  }, [
    litCeramicIntegration,
    setIsLoadingAnswersList,
    surveyId,
    setAnswersList,
  ]);

  const fetchNftAddress = useCallback(async () => {
    const submissionMarkContract = getSubmissionMarkContract();

    if (!submissionMarkContract || !surveyId || !account) return;

    try {
      setIsLoadingNftAddress(true);
      const nftAddress: string = await submissionMarkContract.surveys(surveyId);
      setNftAddress(nftAddress);
    } catch (error: any) {
      console.error(error);
      createToast({
        title: "Failed to fetch NFT contract address",
        status: "error",
      });
    } finally {
      setIsLoadingNftAddress(false);
    }
  }, [account, setIsLoadingNftAddress, setNftAddress, surveyId]);

  return {
    answersList,
    nftAddress,
    isLoadingAnswersList,
    isLoadingNftAddress,
    fetchResults,
    fetchNftAddress,
  };
};
