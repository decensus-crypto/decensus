import { NextApiRequest, NextApiResponse } from "next";
import { PostFormRequestBody } from "../../types/api-types";
import { validatePostFormRequestBody } from "../../types/api-types.validator";
import { pin } from "../../utils/pinata";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let validBody: PostFormRequestBody;
    try {
      validBody = validatePostFormRequestBody(req.body);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
      return;
    }
    const { form, respondentAddresses } = validBody;

    const result = await pin({ title: form.title, data: { form, respondentAddresses } });

    res.status(200).json(result);
  } else {
    res.status(404).end();
  }
}
