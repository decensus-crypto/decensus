import { NextApiRequest, NextApiResponse } from "next";
import { PostAnswerDecryptionKeyRequestBody } from "../../types/api-types";
import { validatePostAnswerDecryptionKeyRequestBody } from "../../types/api-types.validator";
import { pin } from "../../utils/pinata";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let validBody: PostAnswerDecryptionKeyRequestBody;
    try {
      validBody = validatePostAnswerDecryptionKeyRequestBody(req.body);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
      return;
    }
    const { formTitle, encryptedKey, resultViewerAddresses } = validBody;

    const result = await pin({
      title: `${formTitle} - Answer decryption key`,
      data: { encryptedKey, resultViewerAddresses },
    });

    res.status(200).json(result);
  } else {
    res.status(404).end();
  }
}
