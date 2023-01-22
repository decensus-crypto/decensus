import { NextApiRequest, NextApiResponse } from "next";
import { PostMerkleTreeRequestBody } from "../../types/api-types";
import { validatePostMerkleTreeRequestBody } from "../../types/api-types.validator";
import { pin } from "../../utils/pinata";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let validBody: PostMerkleTreeRequestBody;
    try {
      validBody = validatePostMerkleTreeRequestBody(req.body);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
      return;
    }
    const { formTitle, respondentAddresses } = validBody;

    const result = await pin({
      title: `${formTitle} - Merkle tree`,
      data: { respondentAddresses },
    });

    res.status(200).json(result);
  } else {
    res.status(404).end();
  }
}
