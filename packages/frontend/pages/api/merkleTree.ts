import { NextApiRequest, NextApiResponse } from "next";
import { PostMerkleTreeRequestBody } from "../../types/api-types";
import { validatePostMerkleTreeRequestBody } from "../../types/api-types.validator";
import { pin } from "../../utils/web3Storage";

const PATH = "data.json";

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

    const result = await pin({ path: PATH, data: { formTitle, respondentAddresses } });

    res.status(200).json({ cid: result.cid, path: PATH });
  } else {
    res.status(404).end();
  }
}
