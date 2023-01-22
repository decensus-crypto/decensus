import { File, Web3Storage } from "web3.storage";

export const pin = async <T extends Record<string, any>>({
  data,
  path,
}: {
  data: T;
  path: string;
}): Promise<{ cid: string }> => {
  const token = process.env.WEB3_STORAGE_API_TOKEN;
  if (!token)
    throw new Error(
      "please provide web3 storage api token in WEB3_STORAGE_API_TOKEN environment variable.",
    );

  const client = new Web3Storage({ token });

  const file = new File([JSON.stringify(data)], path);

  console.log("file upload to web3 storage in progress: ", file);
  const cid = await client.put([file]);
  console.log("file upload to web3 storage completed: ", cid);

  return { cid };
};
