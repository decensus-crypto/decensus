import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../lib/prisma";

// backend API to store stream IDs of survey answers in Ceramic

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: surveyId } = req.query;
  if (typeof surveyId === "object" || !surveyId)
    throw new Error("invalid input");

  if (req.method === "PUT") {
    const { id } = req.body;
    if (!id) throw new Error("invalid input");

    await prisma.surveyAnswers.upsert({
      where: {
        id: id?.toString(),
      },
      update: {}, // record is immutable
      create: {
        id: id?.toString(),
        surveyId,
      },
    });
    res.status(204).end();
  } else if (req.method === "GET") {
    const answerIds = await prisma.surveyAnswers.findMany({
      where: {
        surveyId,
      },
      select: {
        id: true,
      },
    });
    res.json(answerIds.map((row) => row.id));
  } else {
    throw new Error("invalid input");
  }
}
