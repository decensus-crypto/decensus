import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { Answer } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { useLitCeramic } from "./useLitCeramic";

const answersListAtom = atom<{ answers: Answer[] }[] | null>(null);
const isLoadingAtom = atom<boolean>(true);

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
  const { litCeramicIntegration } = useLitCeramic();
  const [answersList, setAnswersList] = useAtom(answersListAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const surveyId = new URLSearchParams(location.search).get("id") || null;

  const fetchResults = useCallback(async () => {
    try {
      if (!litCeramicIntegration) return;

      setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [litCeramicIntegration, setIsLoading, surveyId, setAnswersList]);

  return {
    isLoadingAnswersList: isLoading,
    answersList,
    fetchResults,
  };
};
