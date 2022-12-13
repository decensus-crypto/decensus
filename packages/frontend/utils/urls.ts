export const getFormUrl = (origin: string, surveyId: string) => `${origin}/answer?id=${surveyId}`;
export const getResultUrl = (origin: string, surveyId: string) => `${origin}/result?id=${surveyId}`;
