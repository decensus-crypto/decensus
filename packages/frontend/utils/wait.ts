export const wait = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, 5000));
