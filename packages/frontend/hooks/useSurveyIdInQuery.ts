import { useRouter } from "next/router";

export const useSurveyIdInQuery = () => {
  const router = useRouter();
  const surveyId = router.query?.id?.toString() || null;

  return {
    surveyId,
  };
};
