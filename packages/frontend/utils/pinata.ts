import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT_KEY });

export const pin = async <T extends Record<string, any>, U extends Record<string, any>>({
  title,
  data,
}: {
  title: string;
  data: U;
}): Promise<{ cid: string }> => {
  const options = {
    pinataMetadata: {
      name: title,
    },
    pinataOptions: {
      cidVersion: 1 as const,
    },
  };
  const result = await pinata.pinJSONToIPFS(data, options);

  return { cid: result.IpfsHash };
};
