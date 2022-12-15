export const getFormUrl = (origin: string, surveyId: string) => {
  const url = new URL("/answer", origin);
  url.search = new URLSearchParams({ id: surveyId }).toString();

  return url.toString();
};
